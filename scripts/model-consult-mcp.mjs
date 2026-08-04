#!/usr/bin/env node
/**
 * model-consult-mcp.mjs — MCP stdio server exposing the connector to Claude Code (ADR 0001).
 *
 * Thin transport over scripts/model-consult.js (the tested, zero-dep core). It surfaces two
 * tools to the orchestrator (the writer's-room / Session Manager):
 *   - list_models()                                   → the redacted roster
 *   - consult_model({ model_id, seat, system, prompt, params }) → one seat's pitch (text + usage)
 *
 * The MCP SDK is an OPT-IN dependency so the base template carries no extra runtime weight.
 * To enable this server:
 *   1. npm i @modelcontextprotocol/sdk
 *   2. add to .mcp.json (project-scoped MCP config Claude Code reads):
 *        { "mcpServers": { "model-consult": { "command": "node",
 *          "args": ["scripts/model-consult-mcp.mjs"] } } }
 *   3. put your endpoints/keys in .env (see .env.example).
 *
 * Until the SDK is installed, running this prints a clear instruction and exits — it never
 * pretends to be up.
 */

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const core = require('./model-consult.js');

let McpServer, StdioServerTransport, z;
try {
  ({ McpServer } = await import('@modelcontextprotocol/sdk/server/mcp.js'));
  ({ StdioServerTransport } = await import('@modelcontextprotocol/sdk/server/stdio.js'));
  ({ z } = await import('zod'));
} catch {
  console.error(
    'model-consult MCP server needs the MCP SDK. Enable it with:\n' +
    '  npm i @modelcontextprotocol/sdk zod\n' +
    'then register it in .mcp.json (see the header of this file). ' +
    'The connector core (scripts/model-consult.js) works standalone without this.'
  );
  process.exit(1);
}

const server = new McpServer({ name: 'model-consult', version: '1.0.0' });

server.tool(
  'list_models',
  'List the configured multi-model roster (redacted — no secrets).',
  {},
  async () => ({ content: [{ type: 'text', text: JSON.stringify(core.listModels(), null, 2) }] })
);

server.tool(
  'consult_model',
  'Consult one rostered non-Claude model for a writer\'s-room seat. Returns its pitch. ' +
    'Anthropic models are refused here — they run natively as subagents.',
  {
    model_id: z.string().describe('registry model id, e.g. "vllm-local"'),
    seat: z.string().optional().describe('the writer\'s-room seat this pitch is for'),
    system: z.string().optional().describe('system prompt / role framing'),
    prompt: z.string().describe('the user prompt for this seat'),
    params: z.record(z.any()).optional().describe('per-call overrides (temperature, max_tokens, ...)'),
  },
  async ({ model_id, seat, system, prompt, params }) => {
    try {
      const { text, usage, model, provider } = await core.consult({ modelId: model_id, seat, system, prompt, params });
      return { content: [{ type: 'text', text }], _meta: { usage, model, provider } };
    } catch (e) {
      // Surface the structured failure to the orchestrator so it can skip this seat — never fake.
      const payload = e instanceof core.ConsultError
        ? { error: e.code, message: e.message, meta: e.meta }
        : { error: 'UNEXPECTED', message: e.message };
      return { isError: true, content: [{ type: 'text', text: JSON.stringify(payload) }] };
    }
  }
);

await server.connect(new StdioServerTransport());
