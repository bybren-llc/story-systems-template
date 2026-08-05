#!/usr/bin/env node
/**
 * model-consult.js — the multi-model connector core (ADR 0001, STO-17).
 *
 * Zero-dependency. Reads the roster from .wtfb/ai-harness/model-registry.json, resolves each
 * model's endpoint/key from the env-var NAMES the registry declares, and consults a model via
 * one adapter interface. The OpenAI-compatible adapter (self-hosted vLLM + OpenAI-compatible
 * clouds) is implemented first. Anthropic models are NOT called here — they run natively in the
 * Claude Code session as subagents.
 *
 * Library use:
 *   const { listModels, consult } = require('./scripts/model-consult.js');
 *   const roster = listModels();                     // redacted, no secrets
 *   const { text, usage } = await consult({ modelId, seat, system, prompt, params });
 *
 * CLI use:
 *   node scripts/model-consult.js list
 *   node scripts/model-consult.js consult <model_id> --seat <seat> --prompt <text> [--system <text>]
 *
 * Failure modes degrade gracefully: a missing endpoint/key or an unreachable server yields a
 * structured ConsultError (never a faked completion). CLI exit: 0 ok, 1 error, 2 bad usage.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const REGISTRY_PATH = path.join('.wtfb', 'ai-harness', 'model-registry.json');
const ENV_PATH = '.env';
const DEFAULT_TIMEOUT_MS = 60000;

/**
 * Load .env into process.env if it exists (STO-32).
 *
 * .env.example and the NOT_CONFIGURED error both tell writers to put their endpoint and key in
 * .env, but nothing read that file — so following the documented instruction produced
 * NOT_CONFIGURED. Fixed here rather than by rewriting the docs to say "export", because .env is
 * what the docs, the example file, and .gitignore all already assume.
 *
 * Hand-rolled rather than `--env-file` or dotenv: the flag needs Node 20.6+ and this repo
 * declares no engines field, and the repo is deliberately zero-dependency.
 *
 * A real environment variable always wins — never clobber what the caller already exported.
 */
function loadDotEnv(file) {
  let raw;
  try {
    raw = fs.readFileSync(file, 'utf8');
  } catch {
    return; // absent .env is the normal case: solo mode needs none of these
  }
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) continue;
    if (Object.prototype.hasOwnProperty.call(process.env, key)) continue;
    let value = trimmed.slice(eq + 1).trim();
    // Strip one matching pair of surrounding quotes, if present.
    if (value.length >= 2 && ((value[0] === '"' && value.endsWith('"')) ||
                              (value[0] === "'" && value.endsWith("'")))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

loadDotEnv(ENV_PATH);

class ConsultError extends Error {
  constructor(code, message, meta) {
    super(message);
    this.name = 'ConsultError';
    this.code = code; // e.g. NO_REGISTRY, UNKNOWN_MODEL, NOT_CONFIGURED, PROVIDER_UNSUPPORTED, HTTP_ERROR, NETWORK_ERROR, BAD_RESPONSE
    this.meta = meta || {};
  }
}

function loadRegistry() {
  if (!fs.existsSync(REGISTRY_PATH)) {
    throw new ConsultError('NO_REGISTRY', `No ${REGISTRY_PATH} — solo mode (Claude only). Nothing to consult.`);
  }
  let data;
  try {
    data = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8').replace(/^﻿/, ''));
  } catch (e) {
    throw new ConsultError('BAD_REGISTRY', `${REGISTRY_PATH} is not valid JSON: ${e.message}`);
  }
  if (!Array.isArray(data.models)) throw new ConsultError('BAD_REGISTRY', '"models" must be an array');
  return data;
}

function getModel(registry, modelId) {
  const m = registry.models.find(x => x && x.id === modelId);
  if (!m) {
    const ids = registry.models.map(x => x.id).join(', ');
    throw new ConsultError('UNKNOWN_MODEL', `Unknown model id "${modelId}". Known: ${ids}`, { modelId });
  }
  return m;
}

/** Redacted roster — booleans for whether env config resolves, never the values. */
function listModels() {
  const registry = loadRegistry();
  return registry.models.map(m => {
    const entry = {
      id: m.id,
      provider: m.provider,
      model: m.model,
      seatAffinity: m.seatAffinity || [],
    };
    if (m.provider === 'anthropic') {
      entry.native = true; // runs in-session, no endpoint needed
      entry.ready = true;
    } else {
      const endpointSet = m.baseUrlEnv ? Boolean(process.env[m.baseUrlEnv]) : m.provider === 'gemini';
      const keySet = m.apiKeyEnv ? Boolean(process.env[m.apiKeyEnv]) : false;
      entry.endpointConfigured = endpointSet;
      entry.keyConfigured = keySet;
      // vLLM may be keyless; gemini requires a key.
      entry.ready = m.provider === 'gemini' ? keySet : endpointSet;
    }
    return entry;
  });
}

function mergeParams(registry, model, overrides) {
  return Object.assign(
    {},
    (registry.defaults && registry.defaults.params) || {},
    model.params || {},
    overrides || {}
  );
}

async function postJson(url, headers, body, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: Object.assign({ 'Content-Type': 'application/json' }, headers),
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (e) {
    const network = e && e.name === 'AbortError'
      ? new ConsultError('NETWORK_ERROR', `Request timed out after ${timeoutMs}ms`, { url })
      : new ConsultError('NETWORK_ERROR', `Could not reach ${url}: ${e.message}`, { url });
    throw network;
  } finally {
    clearTimeout(timer);
  }
  const textBody = await res.text();
  if (!res.ok) {
    throw new ConsultError('HTTP_ERROR', `Endpoint returned ${res.status}`, { status: res.status, body: textBody.slice(0, 500) });
  }
  try {
    return JSON.parse(textBody);
  } catch (e) {
    throw new ConsultError('BAD_RESPONSE', `Non-JSON response from ${url}: ${e.message}`, { body: textBody.slice(0, 200) });
  }
}

/** OpenAI-compatible adapter: self-hosted vLLM + OpenAI-compatible clouds. */
async function consultOpenAICompatible(model, { system, prompt, params, timeoutMs }) {
  const baseUrl = model.baseUrlEnv ? process.env[model.baseUrlEnv] : undefined;
  if (!baseUrl) {
    throw new ConsultError('NOT_CONFIGURED',
      `Endpoint not configured for "${model.id}". Set ${model.baseUrlEnv} in .env (e.g. http://localhost:8000/v1).`,
      { modelId: model.id });
  }
  const apiKey = model.apiKeyEnv ? process.env[model.apiKeyEnv] : undefined;
  const headers = apiKey ? { Authorization: `Bearer ${apiKey}` } : {};
  const messages = [];
  if (system) messages.push({ role: 'system', content: system });
  messages.push({ role: 'user', content: prompt });

  const url = `${baseUrl.replace(/\/$/, '')}/chat/completions`;
  const body = Object.assign({ model: model.model, messages }, params || {});
  const json = await postJson(url, headers, body, timeoutMs || DEFAULT_TIMEOUT_MS);

  const text = json && json.choices && json.choices[0] && json.choices[0].message && json.choices[0].message.content;
  if (typeof text !== 'string') {
    throw new ConsultError('BAD_RESPONSE', `No choices[0].message.content in response from "${model.id}"`, { modelId: model.id });
  }
  return { text, usage: json.usage || null, model: model.model, provider: model.provider };
}

/**
 * Consult a rostered model. Returns { text, usage, model, provider }.
 * Throws ConsultError on any failure (never returns a faked completion).
 */
async function consult({ modelId, seat, system, prompt, params, timeoutMs }) {
  if (!modelId) throw new ConsultError('BAD_ARGS', 'modelId is required');
  if (!prompt) throw new ConsultError('BAD_ARGS', 'prompt is required');

  const registry = loadRegistry();
  const model = getModel(registry, modelId);
  const merged = mergeParams(registry, model, params);

  if (model.provider === 'anthropic') {
    throw new ConsultError('PROVIDER_UNSUPPORTED',
      `"${modelId}" is an anthropic model — it runs natively in the Claude Code session as a subagent, not via the connector.`,
      { modelId, seat });
  }
  if (model.provider === 'openai-compatible') {
    return consultOpenAICompatible(model, { system, prompt, params: merged, timeoutMs });
  }
  // gemini adapter is added when a gemini model is actually rostered/used (ADR 0001).
  throw new ConsultError('PROVIDER_UNSUPPORTED',
    `Provider "${model.provider}" is not yet implemented by the connector (v1 ships OpenAI-compatible).`,
    { modelId, provider: model.provider });
}

// --------------------------------------------------------------------------- CLI

function parseFlags(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].slice(2);
      const val = (i + 1 < argv.length && !argv[i + 1].startsWith('--')) ? argv[++i] : true;
      out[key] = val;
    }
  }
  return out;
}

async function cli() {
  const [sub, ...rest] = process.argv.slice(2);

  if (sub === 'list') {
    console.log(JSON.stringify(listModels(), null, 2));
    return 0;
  }

  if (sub === 'consult') {
    const modelId = rest[0] && !rest[0].startsWith('--') ? rest[0] : undefined;
    const flags = parseFlags(rest);
    if (!modelId || !flags.prompt) {
      console.error('Usage: model-consult.js consult <model_id> --seat <seat> --prompt <text> [--system <text>]');
      return 2;
    }
    const { text } = await consult({
      modelId,
      seat: flags.seat,
      system: flags.system,
      prompt: flags.prompt,
    });
    process.stdout.write(text + '\n');
    return 0;
  }

  console.error('Usage: model-consult.js <list | consult> ...');
  return 2;
}

if (require.main === module) {
  cli()
    .then(code => process.exit(code))
    .catch(e => {
      if (e instanceof ConsultError) {
        console.error(JSON.stringify({ error: e.code, message: e.message, meta: e.meta }));
      } else {
        console.error(JSON.stringify({ error: 'UNEXPECTED', message: e.message }));
      }
      process.exit(1);
    });
}

module.exports = { listModels, consult, loadRegistry, getModel, ConsultError };
