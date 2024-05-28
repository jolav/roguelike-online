/* */

console.log('Loading..... /core/entities.js');

import { Entity } from "./ecs_entity.js";
import { components } from "./ecs_components.js";

function populateMap(counter, pos) {
  populate.player(counter, pos);
  populate.dummy();
  return populate.entities();
}

const populate = {
  result: [],
  counter: 0,
  player: function (counter, pos) {
    this.counter = counter;
    const e = new Entity(this.counter);
    e.addComponent(new components.Player);
    e.addComponent(new components.Renderable);
    e.addComponent(new components.Movable);
    e.addComponent(new components.Position(pos.x, pos.y));
    e.addComponent(new components.Health);
    e.addComponent(new components.Inventory);
    e.addComponent(new components.Tags("player"));
    this.counter++;
    this.result.push(e);
  },
  dummy: function () {
    const x = 10;
    const y = 10;
    const e = new Entity(this.counter);
    //e.addComponent(new components.Player);
    //e.addComponent(new components.Renderable);
    e.addComponent(new components.Movable);
    e.addComponent(new components.Position(x, y));
    e.addComponent(new components.Health);
    e.addComponent(new components.Inventory);
    e.addComponent(new components.Tags("rat"));
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

