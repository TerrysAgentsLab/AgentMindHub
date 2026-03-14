# AgentMindHub

A modular MCP server for multi-agent coordination.

## Status

MVP in development: memory module.

## What Is It?

An [Model Context Protocol](https://modelcontextprotocol.io/) server that gives AI agents (Claude Code, Kilocode, Codex) shared access to a knowledge graph. It is built in a modular way so additional modules such as tasks, mail, and filesystem access can be added later.

## MVP: Memory Module

Based on `@modelcontextprotocol/server-memory` with a compatible JSONL format and 9 tools:

- `create_entities` / `delete_entities`
- `create_relations` / `delete_relations`
- `add_observations` / `delete_observations`
- `read_graph` / `search_nodes` / `open_nodes`

## Installation

```bash
npm install -g agentmindhub
```

## Usage

### Claude Code (`~/.claude/settings.json`)

```json
{
  "mcpServers": {
    "agentmindhub": {
      "command": "npx",
      "args": ["-y", "agentmindhub"],
      "env": {
        "AGENTMINDHUB_MEMORY_PATH": "/pfad/zur/memory.jsonl"
      }
    }
  }
}
```

### Configuration

| Variable | Required? | Default | Description |
|----------|-----------|---------|-------------|
| `AGENTMINDHUB_MEMORY_PATH` | No | `./memory.jsonl` | Path to the memory file |
| `MEMORY_FILE_PATH` | No | – | Compatibility fallback |

## License

MIT
