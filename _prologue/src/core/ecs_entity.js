/* */

console.log('Loading..... /core/ecs_entity.js');

import { queue } from "./queue.js";

class Entity {
  constructor(id) {
    this.id = id;
    this.components = {};
  }
  addComponent(component) {
    this.components[component.name] = component;
  }
  removeComponent(componentName) {
    delete this.components[componentName];
  }
  log() {
    console.log(JSON.stringify(this, null, 2));
  }
  die() {
    this.removeComponent("queueable");
    this.removeComponent("movable");
    this.removeComponent("blocksMov");
    this.removeComponent("stats");
    this.removeComponent("melee");
    this.removeComponent("health");
    this.components.tags.type = "corpse of " + this.components.tags.type;
    queue.remove(this.id);
    //this.removeComponent();
  }
}

export {
  Entity,
};
