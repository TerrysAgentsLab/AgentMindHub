# AgentMindHub – MVP Plan

## Context
Modularer MCP Server für Multi-Agent-Koordination. MVP: Memory-Modul.

- **Repo:** P:/AgentMindHub
- **GitHub:** https://github.com/TerrysAgentsLab/AgentMindHub
- **NPM-Name:** agentmindhub
- **Lizenz:** MIT

## Projektstruktur
```
AgentMindHub/
├── package.json
├── tsconfig.json
├── README.md
├── LICENSE                → MIT
├── src/
│   ├── index.ts           → Entry Point, lädt Module
│   ├── module-loader.ts   → Interface für Module, Registry
│   ├── types.ts           → Shared Types
│   └── modules/
│       └── memory/
│           ├── index.ts   → Memory-Modul (registriert sich selbst)
│           ├── manager.ts → KnowledgeGraphManager
│           └── types.ts   → Entity, Relation, KnowledgeGraph
├── docker/
│   └── Dockerfile
└── .github/
    └── workflows/
        └── ci.yml
```

## Modulare Architektur

### Module Interface
```typescript
interface AgentMindHubModule {
  name: string
  description: string
  registerTools(server: McpServer): void
}
```

### Entry Point (src/index.ts)
- Liest Config (welche Module aktiv)
- Lädt aktivierte Module
- Jedes Modul registriert seine eigenen Tools am Server
- Server startet über stdio

### Config über Env-Vars:

| Variable | Pflicht? | Default | Beschreibung |
|----------|----------|---------|--------------|
| `AGENTMINDHUB_MEMORY_PATH` | Nein | `./memory.jsonl` | Pfad zur Memory-Datei |
| `MEMORY_FILE_PATH` | Nein | – | Fallback (Kompatibilität zum Original) |

## Memory-Modul

Basierend auf @modelcontextprotocol/server-memory (~300-400 Zeilen TypeScript):

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

### Datenmodell:
```typescript
interface Entity { name: string; entityType: string; observations: string[] }
interface Relation { from: string; to: string; relationType: string }
interface KnowledgeGraph { entities: Entity[]; relations: Relation[] }
```

### Storage: JSONL (kompatibel zum Original)

### Fehlerverhalten:
- **Memory-Datei fehlt:** Neue leere Datei anlegen (kein Fehler)
- **Korrupte JSONL-Zeile:** Überspringen + Warnung auf stderr (kein Crash)
- **Alle Daten im RAM:** Graph wird beim Start komplett geladen, bei jeder Änderung komplett geschrieben (wie Original)

## Dependencies
```
@modelcontextprotocol/sdk (^1.26.0)
zod
typescript (dev)
@types/node (dev)
```

## Implementierungsreihenfolge
1. `npm init` + Dependencies installieren
2. tsconfig.json konfigurieren
3. src/types.ts – Shared Types + Module Interface
4. src/modules/memory/types.ts – Memory-spezifische Types
5. src/modules/memory/manager.ts – KnowledgeGraphManager
6. src/modules/memory/index.ts – Tool-Registrierung
7. src/module-loader.ts – Modul-Registry
8. src/index.ts – Entry Point
9. Build + Test
10. README.md + LICENSE

## Verifizierung
1. `npm run build` kompiliert fehlerfrei
2. Server startet und listet Memory-Tools
3. Claude Code: Entity erstellen, lesen, suchen, löschen
4. Kilocode: Gleiche Memory-Datei lesen (Bridge-Test)
5. `npx agentmindhub` startet korrekt

## Post-MVP
- **Tests:** Unit-Tests für KnowledgeGraphManager, Integrationstest Server-Start
- **Docker:** Dockerfile mit Volume-Mount für Memory-Datei
- **CI/CD:** GitHub Actions Pipeline (Build + Test)
- **Input-Validierung:** Entity-Namen, Observation-Länge
- **Datenmodell-Migration:** Falls Format sich ändert

## Spätere Module (nicht MVP)
- Tasks: Action Items, Zuweisungen, Status-Tracking
- Mail: Stream-Protokoll als MCP-Tools
- Filesystem: Kontrollierter Dateizugriff
- Sequential Thinking: Strukturiertes Denken
