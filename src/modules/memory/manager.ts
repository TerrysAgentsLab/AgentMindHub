import { promises as fs } from "node:fs";
import { Entity, Relation, KnowledgeGraph } from "./types.js";

export class KnowledgeGraphManager {
  private entities: Map<string, Entity> = new Map();
  private relations: Relation[] = [];

  constructor(private filePath: string) {}

  async load(): Promise<void> {
    try {
      const content = await fs.readFile(this.filePath, "utf-8");
      const lines = content.split("\n").filter((line) => line.trim());

      for (const line of lines) {
        try {
          const item = JSON.parse(line);
          if (item.type === "entity") {
            this.entities.set(item.name, {
              name: item.name,
              entityType: item.entityType,
              observations: item.observations || [],
            });
          } else if (item.type === "relation") {
            this.relations.push({
              from: item.from,
              to: item.to,
              relationType: item.relationType,
            });
          }
        } catch {
          console.error(`Skipping corrupt JSONL line: ${line.substring(0, 80)}`);
        }
      }
    } catch (err: unknown) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") {
        // Memory file does not exist yet, start with an empty graph
        return;
      }
      throw err;
    }
  }

  private async save(): Promise<void> {
    const lines: string[] = [];

    for (const entity of this.entities.values()) {
      lines.push(
        JSON.stringify({
          type: "entity",
          name: entity.name,
          entityType: entity.entityType,
          observations: entity.observations,
        })
      );
    }

    for (const relation of this.relations) {
      lines.push(
        JSON.stringify({
          type: "relation",
          from: relation.from,
          to: relation.to,
          relationType: relation.relationType,
        })
      );
    }

    await fs.writeFile(this.filePath, lines.join("\n") + "\n", "utf-8");
  }

  async createEntities(
    entities: { name: string; entityType: string; observations: string[] }[]
  ): Promise<Entity[]> {
    const created: Entity[] = [];

    for (const e of entities) {
      if (!this.entities.has(e.name)) {
        const entity: Entity = {
          name: e.name,
          entityType: e.entityType,
          observations: e.observations || [],
        };
        this.entities.set(e.name, entity);
        created.push(entity);
      }
    }

    await this.save();
    return created;
  }

  async deleteEntities(names: string[]): Promise<void> {
    for (const name of names) {
      this.entities.delete(name);
    }
    // Remove relations that point to deleted entities as well
    this.relations = this.relations.filter(
      (r) => !names.includes(r.from) && !names.includes(r.to)
    );
    await this.save();
  }

  async createRelations(
    relations: { from: string; to: string; relationType: string }[]
  ): Promise<Relation[]> {
    const created: Relation[] = [];

    for (const r of relations) {
      const exists = this.relations.some(
        (existing) =>
          existing.from === r.from &&
          existing.to === r.to &&
          existing.relationType === r.relationType
      );

      if (!exists) {
        const relation: Relation = {
          from: r.from,
          to: r.to,
          relationType: r.relationType,
        };
        this.relations.push(relation);
        created.push(relation);
      }
    }

    await this.save();
    return created;
  }

  async deleteRelations(
    relations: { from: string; to: string; relationType: string }[]
  ): Promise<void> {
    for (const r of relations) {
      this.relations = this.relations.filter(
        (existing) =>
          !(
            existing.from === r.from &&
            existing.to === r.to &&
            existing.relationType === r.relationType
          )
      );
    }
    await this.save();
  }

  async addObservations(
    observations: { entityName: string; contents: string[] }[]
  ): Promise<{ entityName: string; addedObservations: string[] }[]> {
    const results: { entityName: string; addedObservations: string[] }[] = [];

    for (const o of observations) {
      const entity = this.entities.get(o.entityName);
      if (!entity) {
        throw new Error(`Entity not found: ${o.entityName}`);
      }

      const added: string[] = [];
      for (const content of o.contents) {
        if (!entity.observations.includes(content)) {
          entity.observations.push(content);
          added.push(content);
        }
      }
      results.push({ entityName: o.entityName, addedObservations: added });
    }

    await this.save();
    return results;
  }

  async deleteObservations(
    deletions: { entityName: string; observations: string[] }[]
  ): Promise<void> {
    for (const d of deletions) {
      const entity = this.entities.get(d.entityName);
      if (!entity) continue;

      entity.observations = entity.observations.filter(
        (obs) => !d.observations.includes(obs)
      );
    }
    await this.save();
  }

  readGraph(): KnowledgeGraph {
    return {
      entities: Array.from(this.entities.values()),
      relations: [...this.relations],
    };
  }

  searchNodes(query: string): KnowledgeGraph {
    const q = query.toLowerCase();

    const matchingEntities = Array.from(this.entities.values()).filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.entityType.toLowerCase().includes(q) ||
        e.observations.some((o) => o.toLowerCase().includes(q))
    );

    const entityNames = new Set(matchingEntities.map((e) => e.name));
    const matchingRelations = this.relations.filter(
      (r) => entityNames.has(r.from) || entityNames.has(r.to)
    );

    return { entities: matchingEntities, relations: matchingRelations };
  }

  openNodes(names: string[]): KnowledgeGraph {
    const entities = names
      .map((name) => this.entities.get(name))
      .filter((e): e is Entity => e !== undefined);

    const entityNames = new Set(names);
    const relations = this.relations.filter(
      (r) => entityNames.has(r.from) || entityNames.has(r.to)
    );

    return { entities, relations };
  }
}
