import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Interface für alle AgentMindHub-Module.
 * Jedes Modul registriert seine eigenen Tools am Server.
 */
export interface AgentMindHubModule {
  name: string;
  description: string;
  registerTools(server: McpServer): void;
}
