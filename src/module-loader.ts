import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AgentMindHubModule } from "./types.js";

export class ModuleLoader {
  private modules: AgentMindHubModule[] = [];

  register(module: AgentMindHubModule): void {
    this.modules.push(module);
    console.error(`[AgentMindHub] Module registered: ${module.name}`);
  }

  registerAll(server: McpServer): void {
    for (const module of this.modules) {
      module.registerTools(server);
      console.error(`[AgentMindHub] Tools registered for: ${module.name}`);
    }
  }

  getModuleNames(): string[] {
    return this.modules.map((m) => m.name);
  }
}
