#!/usr/bin/env node
/**
 * validate-plugin.js
 *
 * Structural gate for the Claude Code plugin packaging (STO-14). Zero dependencies.
 *
 * Verifies what CAN be verified without a live install:
 *   - .claude-plugin/plugin.json is well-formed (kebab name; declared component paths resolve
 *     to real directories that actually contain components);
 *   - .claude-plugin/marketplace.json is well-formed and lists the local plugin by name.
 *
 * It does NOT run `/plugin install` — that live check is the publisher's final step.
 *
 * Usage: node scripts/validate-plugin.js
 * Exit: 0 ok (or no manifest present), 1 on errors.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const PLUGIN = path.join('.claude-plugin', 'plugin.json');
const MARKET = path.join('.claude-plugin', 'marketplace.json');
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const errors = [];
const err = m => errors.push(m);

function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8').replace(/^﻿/, ''));
  } catch (e) {
    err(`${p} is not valid JSON: ${e.message}`);
    return null;
  }
}

/** A declared component path must start with ./ and resolve inside the repo to a real dir. */
function checkComponentDir(rel, kind, mustContain) {
  if (rel === undefined) return; // optional
  if (typeof rel !== 'string' || !rel.startsWith('./')) {
    err(`plugin.json: ${kind} must be a relative path starting with "./", got "${rel}"`);
    return;
  }
  const dir = path.normalize(rel);
  if (dir.startsWith('..')) { err(`plugin.json: ${kind} path escapes the plugin root ("${rel}")`); return; }
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    err(`plugin.json: ${kind} directory does not exist: ${rel}`);
    return;
  }
  const found = mustContain(dir);
  if (!found) err(`plugin.json: ${kind} directory ${rel} contains no ${kind} components`);
}

function hasFileMatching(dir, predicate) {
  return fs.readdirSync(dir, { withFileTypes: true }).some(predicate);
}

function main() {
  if (!fs.existsSync(PLUGIN)) {
    console.log(`No ${PLUGIN} — repo is not packaged as a plugin. Nothing to validate.`);
    process.exit(0);
  }

  const plugin = readJson(PLUGIN);
  if (plugin) {
    if (typeof plugin.name !== 'string' || !KEBAB.test(plugin.name)) {
      err('plugin.json: "name" is required and must be kebab-case');
    }
    if (plugin.version !== undefined && typeof plugin.version !== 'string') {
      err('plugin.json: "version" must be a string');
    }
    // skills dir: at least one <name>/SKILL.md
    checkComponentDir(plugin.skills, 'skills', dir =>
      fs.readdirSync(dir, { withFileTypes: true })
        .some(d => d.isDirectory() && fs.existsSync(path.join(dir, d.name, 'SKILL.md'))));
    // agents dir: at least one non-README .md
    checkComponentDir(plugin.agents, 'agents', dir =>
      hasFileMatching(dir, d => d.isFile() && d.name.endsWith('.md') && d.name.toLowerCase() !== 'readme.md'));
    // commands dir: at least one non-README .md
    checkComponentDir(plugin.commands, 'commands', dir =>
      hasFileMatching(dir, d => d.isFile() && d.name.endsWith('.md') && d.name.toLowerCase() !== 'readme.md'));
    // hooks (optional): must be an existing file if a string path
    if (typeof plugin.hooks === 'string') {
      const hp = path.normalize(plugin.hooks);
      if (!fs.existsSync(hp)) err(`plugin.json: hooks file does not exist: ${plugin.hooks}`);
    }
  }

  if (fs.existsSync(MARKET)) {
    const market = readJson(MARKET);
    if (market) {
      if (typeof market.name !== 'string' || !market.name) err('marketplace.json: "name" is required');
      if (!market.owner || typeof market.owner.name !== 'string') err('marketplace.json: "owner.name" is required');
      if (!Array.isArray(market.plugins) || market.plugins.length === 0) {
        err('marketplace.json: "plugins" must be a non-empty array');
      } else {
        market.plugins.forEach((p, i) => {
          if (!p || typeof p.name !== 'string') err(`marketplace.json: plugins[${i}].name is required`);
          if (!p || p.source === undefined) err(`marketplace.json: plugins[${i}].source is required`);
        });
        // The local plugin should be listed by name.
        if (plugin && plugin.name && !market.plugins.some(p => p && p.name === plugin.name)) {
          err(`marketplace.json does not list the local plugin "${plugin.name}"`);
        }
      }
    }
  }

  if (errors.length) {
    for (const e of errors) console.error(`ERROR ${e}`);
    console.error(`\nplugin packaging: ${errors.length} error(s)`);
    process.exit(1);
  }
  console.log('plugin packaging: manifests valid; component paths resolve.');
  process.exit(0);
}

main();
