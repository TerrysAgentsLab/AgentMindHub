#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ModuleLoader } from "./module-loader.js";
import { createMemoryModule } from "./modules/memory/index.js";

const memoryPath =
  process.env.AGENTMINDHUB_MEMORY_PATH ||
  process.env.MEMORY_FILE_PATH ||
  "./memory.jsonl";

const server = new McpServer({
  name: "agentmindhub",
  version: "0.1.0",
});

const loader = new ModuleLoader();

// Load the memory module
const memoryModule = createMemoryModule(memoryPath);
loader.register(memoryModule);

// Register all modules on the server
loader.registerAll(server);

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`[AgentMindHub] Server running. Memory: ${memoryPath}`);
}

main().catch((error) => {
  console.error("[AgentMindHub] Fatal error:", error);
  process.exit(1);
});
