/**/

class ECS {
  constructor() {
    this.counterID = 1;
    this.entities = new Map();   // id -> Set(componentTypes)
    this.components = new Map(); // compType -> Map(id, data)
    this.tags = new Map();       // id -> Set(tags)
  }

  newEntity() {
    const id = this.counterID++;
    this.entities.set(id, new Set());
    this.tags.set(id, new Set());
    return id;
  }

  list() {
    for (const [id, components] of this.entities.entries()) {
      console.log(id, [...components], [...(this.tags.get(id) || [])]);
    }
  }

  addTag(id, tag) {
    if (!this.tags.has(id)) {
      return;
    }
    this.tags.get(id).add(tag);
  }

  removeTag(id, tag) {
    if (!this.tags.has(id)) {
      return;
    }
    this.tags.get(id).delete(tag);
  }

  hasTag(id, tag) {
    return this.tags.has(id) && this.tags.get(id).has(tag);
  }

  getEntitiesWithTag(tag) {
    const result = [];
    for (const [id, tags] of this.tags) {
      if (tags.has(tag)) result.push(id);
    }
    return result;
  }

  getEntitiesWithComp(compType) {
    const result = [];
    for (const [id, components] of this.entities) {
      if (components.has(compType)) result.push(id);
    }
    return result;
  }

  addComponent(id, compType, comp) {
    if (!this.entities.has(id)) {
      return;
    }
    this.entities.get(id).add(compType);
    if (!this.components.has(compType)) {
      this.components.set(compType, new Map());
    }
    this.components.get(compType).set(id, comp);
  }

  removeComponent(id, compType) {
    if (!this.entities.has(id) || !this.components.has(compType)) {
      return;
    }
    this.entities.get(id).delete(compType);
    this.components.get(compType).delete(id);
  }

  printEntity(id) {
    if (!this.entities.has(id)) {
      console.log(`Entity ${id} does not exist.`);
      return;
    }

    console.log(`Entity ${id}:`);
    console.log("  Components:", [...this.entities.get(id)]);
    console.log("  Tags:", [...(this.tags.get(id) || [])]);

    for (const comp of this.entities.get(id)) {
      const data = this.components.get(comp)?.get(id);
      console.log(`  ${comp}:`, data);
    }
  }
}

export {
  ECS
};
