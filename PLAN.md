# AgentMindHub – MVP Plan

## Context
A modular MCP server for multi-agent coordination. MVP: memory module.

- **Repo:** P:/AgentMindHub
- **GitHub:** https://github.com/TerrysAgentsLab/AgentMindHub
- **NPM-Name:** agentmindhub
- **License:** MIT

## Project Structure
```
AgentMindHub/
├── package.json
├── tsconfig.json
├── README.md
├── LICENSE                → MIT
├── src/
│   ├── index.ts           → Entry point, loads modules
│   ├── module-loader.ts   → Module interface and registry
│   ├── types.ts           → Shared Types
│   └── modules/
│       └── memory/
│           ├── index.ts   → Memory module (self-registering)
│           ├── manager.ts → KnowledgeGraphManager
│           └── types.ts   → Entity, Relation, KnowledgeGraph
├── docker/
│   └── Dockerfile
└── .github/
    └── workflows/
        └── ci.yml
```

## Modular Architecture

### Module Interface
```typescript
interface AgentMindHubModule {
  name: string
  description: string
  registerTools(server: McpServer): void
}
```

### Entry Point (src/index.ts)
- Reads config to determine which modules are active
- Loads the enabled modules
- Each module registers its own tools on the server
- Starts the server over stdio

### Configuration via Environment Variables

| Variable | Required? | Default | Description |
|----------|-----------|---------|-------------|
| `AGENTMINDHUB_MEMORY_PATH` | No | `./memory.jsonl` | Path to the memory file |
| `MEMORY_FILE_PATH` | No | – | Fallback for compatibility with the original |

## Memory Module

Based on `@modelcontextprotocol/server-memory` (~300-400 lines of TypeScript):

### 9 Tools:
1. create_entities
2. create_relations
3. add_observations
4. delete_entities
5. delete_observations
6. delete_relations
7. read_graph
8. search_nodes
9. open_nodes

### Data Model:
```typescript
interface Entity { name: string; entityType: string; observations: string[] }
interface Relation { from: string; to: string; relationType: string }
interface KnowledgeGraph { entities: Entity[]; relations: Relation[] }
```

### Storage: JSONL (compatible with the original)

### Error Handling:
- **Missing memory file:** Create a new empty file (no error)
- **Corrupt JSONL line:** Skip it and warn on stderr (no crash)
- **All data in memory:** Load the full graph on startup and rewrite it fully on each change (same as the original)

## Dependencies
```
@modelcontextprotocol/sdk (^1.26.0)
zod
typescript (dev)
@types/node (dev)
```

## Implementation Order
1. `npm init` + Dependencies installieren
2. Configure `tsconfig.json`
3. `src/types.ts` – shared types and module interface
4. `src/modules/memory/types.ts` – memory-specific types
5. src/modules/memory/manager.ts – KnowledgeGraphManager
6. `src/modules/memory/index.ts` – tool registration
7. `src/module-loader.ts` – module registry
8. `src/index.ts` – entry point
9. Build and test
10. `README.md` and `LICENSE`

## Verification
1. `npm run build` compiles without errors
2. The server starts and lists the memory tools
3. Claude Code can create, read, search, and delete entities
4. Kilocode can read the same memory file (bridge test)
5. `npx agentmindhub` starts correctly

## Post-MVP
- **Tests:** Unit tests for `KnowledgeGraphManager`, integration test for server startup
- **Docker:** Dockerfile with a volume mount for the memory file
- **CI/CD:** GitHub Actions pipeline for build and test
- **Input validation:** Entity names and observation length
- **Data model migration:** If the format changes later

## Later Modules (Not Part of the MVP)
- Tasks: action items, assignments, status tracking
- Mail: stream protocol as MCP tools
- Filesystem: controlled file access
- Sequential Thinking: structured reasoning
