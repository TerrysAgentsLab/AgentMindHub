import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AgentMindHubModule } from "../../types.js";
import { KnowledgeGraphManager } from "./manager.js";

export function createMemoryModule(memoryPath: string): AgentMindHubModule {
  const manager = new KnowledgeGraphManager(memoryPath);

  return {
    name: "memory",
    description: "Knowledge Graph memory with entities, relations, and observations",

    registerTools(server: McpServer): void {
      // 1. create_entities
      server.tool(
        "create_entities",
        "Create multiple new entities in the knowledge graph",
        {
          entities: z.array(
            z.object({
              name: z.string().describe("Entity name"),
              entityType: z.string().describe("Entity type"),
              observations: z.array(z.string()).describe("Initial observations"),
            })
          ).describe("Array of entities to create"),
        },
        async ({ entities }) => {
          const created = await manager.createEntities(entities);
          return { content: [{ type: "text", text: JSON.stringify(created, null, 2) }] };
        }
      );

      // 2. delete_entities
      server.tool(
        "delete_entities",
        "Delete multiple entities and their associated relations",
        {
          entityNames: z.array(z.string()).describe("Entity names to delete"),
        },
        async ({ entityNames }) => {
          await manager.deleteEntities(entityNames);
          return { content: [{ type: "text", text: "Entities deleted successfully" }] };
        }
      );

      // 3. create_relations
      server.tool(
        "create_relations",
        "Create multiple new relations between entities",
        {
          relations: z.array(
            z.object({
              from: z.string().describe("Source entity name"),
              to: z.string().describe("Target entity name"),
              relationType: z.string().describe("Relation type"),
            })
          ).describe("Array of relations to create"),
        },
        async ({ relations }) => {
          const created = await manager.createRelations(relations);
          return { content: [{ type: "text", text: JSON.stringify(created, null, 2) }] };
        }
      );

      // 4. delete_relations
      server.tool(
        "delete_relations",
        "Delete multiple relations from the knowledge graph",
        {
          relations: z.array(
            z.object({
              from: z.string().describe("Source entity name"),
              to: z.string().describe("Target entity name"),
              relationType: z.string().describe("Relation type"),
            })
          ).describe("Array of relations to delete"),
        },
        async ({ relations }) => {
          await manager.deleteRelations(relations);
          return { content: [{ type: "text", text: "Relations deleted successfully" }] };
        }
      );

      // 5. add_observations
      server.tool(
        "add_observations",
        "Add new observations to existing entities",
        {
          observations: z.array(
            z.object({
              entityName: z.string().describe("Entity to add observations to"),
              contents: z.array(z.string()).describe("Observations to add"),
            })
          ).describe("Array of observations to add"),
        },
        async ({ observations }) => {
          const results = await manager.addObservations(observations);
          return { content: [{ type: "text", text: JSON.stringify(results, null, 2) }] };
        }
      );

      // 6. delete_observations
      server.tool(
        "delete_observations",
        "Delete specific observations from entities",
        {
          deletions: z.array(
            z.object({
              entityName: z.string().describe("Entity name"),
              observations: z.array(z.string()).describe("Observations to delete"),
            })
          ).describe("Array of observation deletions"),
        },
        async ({ deletions }) => {
          await manager.deleteObservations(deletions);
          return { content: [{ type: "text", text: "Observations deleted successfully" }] };
        }
      );

      // 7. read_graph
      server.tool(
        "read_graph",
        "Read the entire knowledge graph",
        {},
        async () => {
          const graph = manager.readGraph();
          return { content: [{ type: "text", text: JSON.stringify(graph, null, 2) }] };
        }
      );

      // 8. search_nodes
      server.tool(
        "search_nodes",
        "Search for nodes in the knowledge graph by query string",
        {
          query: z.string().describe("Search query"),
        },
        async ({ query }) => {
          const results = manager.searchNodes(query);
          return { content: [{ type: "text", text: JSON.stringify(results, null, 2) }] };
        }
      );

      // 9. open_nodes
      server.tool(
        "open_nodes",
        "Open specific nodes by name and retrieve their details and relations",
        {
          names: z.array(z.string()).describe("Node names to open"),
        },
        async ({ names }) => {
          const results = manager.openNodes(names);
          return { content: [{ type: "text", text: JSON.stringify(results, null, 2) }] };
        }
      );
    },
  };
}
