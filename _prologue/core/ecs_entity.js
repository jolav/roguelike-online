/* */
console.log('Loading..... core/ecs_entity.js');

class Entity {
  static currentId = 0;
  constructor() {
    this.id = Entity.generateId();
    this.components = {};
    this.tags = new Set();
  }
  addComponent(component) {
    this.components[component.constructor.name] = component;
  }
  removeComponent(componentClass) {
    delete this.components[componentClass.name];
  }
  hasComponent(componentClass) {
    return this.components[componentClass.name] !== undefined;
  }
  addTag(tag) {
    this.tags.add(tag);
  }
  removeTag(tag) {
    this.tags.delete(tag);
  }
  hasTag(tag) {
    return this.tags.has(tag);
  }
  static generateId() {
    if (!this.currentId) this.currentId = 0;
    return this.currentId++;
  }
  log() {
    console.log('##########################');
    console.log(this.id);
    console.log(this.components);
    console.log(this.tags);
    console.log('##########################');
  }
}

export {
  Entity,
};
