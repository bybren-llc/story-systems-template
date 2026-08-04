#!/usr/bin/env node
/**
 * validate-models.js
 *
 * Structural gate for the multi-model registry (.wtfb/ai-harness/model-registry.json), per
 * ADR 0001. Zero external dependencies.
 *
 * Guarantees:
 *   - the registry is well-formed (version, non-empty unique models, known providers);
 *   - each provider carries the config the connector (STO-17) needs (openai-compatible → a
 *     base-URL env NAME; gemini → an API-key env NAME);
 *   - NO SECRETS are committed — endpoint/key fields must be env-var NAMES, never values, and
 *     no string may look like a URL or an API key.
 *
 * Usage: node scripts/validate-models.js [--strict]
 * Exit: 0 = ok (warnings allowed), 1 = errors (or warnings under --strict).
 */

'use strict';

const fs = require('fs');
const path = require('path');

const REGISTRY = path.join('.wtfb', 'ai-harness', 'model-registry.json');
const PROVIDERS = ['anthropic', 'openai-compatible', 'gemini'];
const ENV_NAME = /^[A-Z][A-Z0-9_]*$/;               // WTFB_VLLM_BASE_URL, not a value
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const URL_LIKE = /:\/\//;                            // http://, https://
const SECRET_LIKE = /(sk-[A-Za-z0-9]{16,}|AIza[0-9A-Za-z_-]{10,}|[A-Za-z0-9_-]{32,})/; // common key shapes
const RAW_SECRET_KEYS = ['apikey', 'apikeys', 'baseurl', 'endpoint', 'token', 'secret', 'key', 'password'];

const strict = process.argv.slice(2).includes('--strict');
const errors = [];
const warnings = [];

function err(m) { errors.push(m); }
function warn(m) { warnings.push(m); }

function checkParams(params, where) {
  if (params === undefined) return;
  if (typeof params !== 'object' || params === null || Array.isArray(params)) {
    err(`${where}: params must be an object`);
    return;
  }
  for (const [k, v] of Object.entries(params)) {
    if (typeof v === 'number' && !Number.isFinite(v)) {
      err(`${where}: params.${k} must be a finite number`);
    }
  }
}

// Reject any field that would hold a raw secret/URL instead of an env-var name.
function checkNoRawSecrets(obj, where) {
  for (const [k, v] of Object.entries(obj)) {
    const kl = k.toLowerCase();
    if (RAW_SECRET_KEYS.includes(kl)) {
      err(`${where}: field "${k}" would embed a secret/endpoint. Use "${k}Env" with an env-var NAME instead.`);
    }
    if (typeof v === 'string') {
      if (URL_LIKE.test(v)) err(`${where}.${k}: looks like a URL ("${v}"). Endpoints belong in .env, referenced by an env-var name.`);
      else if (SECRET_LIKE.test(v) && !ENV_NAME.test(v)) err(`${where}.${k}: looks like a secret. Never commit keys; reference an env-var name.`);
    }
  }
}

function checkEnvName(model, field, where, required) {
  const val = model[field];
  if (val === undefined) {
    if (required) err(`${where}: ${field} is required for provider "${model.provider}"`);
    return;
  }
  if (typeof val !== 'string' || !ENV_NAME.test(val)) {
    err(`${where}: ${field} must be an env-var NAME (e.g. WTFB_VLLM_BASE_URL), got "${val}"`);
  }
}

function main() {
  if (!fs.existsSync(REGISTRY)) {
    // No registry is valid: the writer's room runs in solo (Claude-only) mode.
    console.log(`No ${REGISTRY} — solo mode (Claude only). Nothing to validate.`);
    process.exit(0);
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(REGISTRY, 'utf8').replace(/^﻿/, ''));
  } catch (e) {
    console.error(`ERROR: ${REGISTRY} is not valid JSON: ${e.message}`);
    process.exit(1);
  }

  if (typeof data.version !== 'string') err('top-level "version" must be a string');
  if (data.description !== undefined && typeof data.description !== 'string') err('"description" must be a string');
  if (data.defaults !== undefined) checkParams(data.defaults.params, 'defaults');

  if (!Array.isArray(data.models) || data.models.length === 0) {
    err('"models" must be a non-empty array');
    return report();
  }

  const seen = new Set();
  data.models.forEach((m, i) => {
    const where = `models[${i}]${m && m.id ? ` (${m.id})` : ''}`;
    if (typeof m !== 'object' || m === null) { err(`${where}: must be an object`); return; }

    if (typeof m.id !== 'string' || !KEBAB.test(m.id)) err(`${where}: id must be kebab-case`);
    else if (seen.has(m.id)) err(`${where}: duplicate id "${m.id}"`);
    else seen.add(m.id);

    if (!PROVIDERS.includes(m.provider)) err(`${where}: provider must be one of ${PROVIDERS.join(', ')}`);
    if (typeof m.model !== 'string' || m.model.trim() === '') err(`${where}: model (served name) must be a non-empty string`);

    if (m.provider === 'openai-compatible') {
      checkEnvName(m, 'baseUrlEnv', where, true);
      checkEnvName(m, 'apiKeyEnv', where, false); // local vLLM may be keyless
    } else if (m.provider === 'gemini') {
      checkEnvName(m, 'apiKeyEnv', where, true);
    } else if (m.provider === 'anthropic') {
      if (m.baseUrlEnv || m.apiKeyEnv) warn(`${where}: anthropic models run natively in-session; baseUrlEnv/apiKeyEnv are ignored`);
    }

    if (m.seatAffinity !== undefined) {
      if (!Array.isArray(m.seatAffinity) || m.seatAffinity.some(s => typeof s !== 'string')) {
        err(`${where}: seatAffinity must be an array of strings`);
      }
    }
    checkParams(m.params, where);
    checkNoRawSecrets(m, where);
  });

  report();
}

function report() {
  for (const w of warnings) console.log(`WARN  ${w}`);
  for (const e of errors) console.error(`ERROR ${e}`);
  const failed = errors.length > 0 || (strict && warnings.length > 0);
  console.log(`\nmodel-registry: ${errors.length} error(s), ${warnings.length} warning(s)${strict ? ' [strict]' : ''}`);
  process.exit(failed ? 1 : 0);
}

main();
