import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Interface for all AgentMindHub modules.
 * Each module registers its own tools on the server.
 */
export interface AgentMindHubModule {
  name: string;
  description: string;
  registerTools(server: McpServer): void;
}
