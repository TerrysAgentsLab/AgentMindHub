# AgentMindHub

Modularer MCP Server für Multi-Agent-Koordination.

## Status

MVP in Entwicklung – Memory-Modul.

## Was ist das?

Ein [Model Context Protocol](https://modelcontextprotocol.io/) Server, der AI-Agents (Claude Code, Kilocode, Codex) gemeinsamen Zugriff auf einen Knowledge Graph gibt. Modular aufgebaut, damit später weitere Module (Tasks, Mail, Filesystem) dazukommen können.

## MVP: Memory-Modul

Basierend auf `@modelcontextprotocol/server-memory` – kompatibles JSONL-Format, 9 Tools:

- `create_entities` / `delete_entities`
- `create_relations` / `delete_relations`
- `add_observations` / `delete_observations`
- `read_graph` / `search_nodes` / `open_nodes`

## Installation

```bash
npm install -g agentmindhub
```

## Nutzung

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

### Konfiguration

| Variable | Pflicht? | Default | Beschreibung |
|----------|----------|---------|--------------|
| `AGENTMINDHUB_MEMORY_PATH` | Nein | `./memory.jsonl` | Pfad zur Memory-Datei |
| `MEMORY_FILE_PATH` | Nein | – | Fallback (Kompatibilität) |

## Lizenz

MIT
