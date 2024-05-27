/* */

console.log('Loading..... /core/entities.js');

import { Entity } from "./ecs_entity.js";
import { components } from "./ecs_components.js";

function populateMap(counter, params) {
  populate.player(counter, params);
  populate.dummy();
  return populate.entities();
}

const populate = {
  result: [],
  counter: 0,
  player: function (counter, params) {
    this.counter = counter;
    const x = Math.floor(params.cols / 2);
    const y = Math.floor(params.rows / 2);
    const e = new Entity(this.counter);
    e.addComponent(new components.Player);
    e.addComponent(new components.Renderable);
    e.addComponent(new components.Movable);
    e.addComponent(new components.Position(x, y));
    e.addComponent(new components.Health);
    e.addComponent(new components.Inventory);
    this.counter++;
    this.result.push(e);
  },
  dummy: function () {
    const x = 10;
    const y = 10;
    const e = new Entity(this.counter);
    //e.addComponent(new components.Player);
    e.addComponent(new components.Renderable);
    e.addComponent(new components.Movable);
    e.addComponent(new components.Position(x, y));
    e.addComponent(new components.Health);
    e.addComponent(new components.Inventory);
    this.counter++;
    this.result.push(e);
  },
  entities: function () {
    return [this.result, this.counter];
  },
};

export {
  populateMap,
};
