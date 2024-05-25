/* */

console.log('Loading..... /core/entities.js');

import { Entity } from "./ecs_entity.js";
import { components } from "./ecs_components.js";

function populateMap(counter, params) {
  return populate.player(counter, params);
}

const populate = {
  player: function (counter, params) {
    let result = [];
    const x = Math.floor(params.cols / 2);
    const y = Math.floor(params.rows / 2);
    const e = new Entity(counter);
    e.addComponent(new components.Player);
    e.addComponent(new components.Renderable);
    e.addComponent(new components.Movable);
    e.addComponent(new components.Position(x, y));
    e.addComponent(new components.Health);
    e.addComponent(new components.Inventory);
    counter++;
    result.push(e);
    return [result, counter];
  }

};

export {
  populateMap,
};

