/* */

console.log('Loading..... /core/ecs_entity.js');

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
}

export {
  Entity,
};
