/* */

console.log('Loading..... /core/entities.js');

import { Entity } from "./ecs_entity.js";
import { components } from "./ecs_components.js";
import { point } from "./point.js";
import { K } from "./_konfig.js";

function populateMap(counter, map) {
  populate.player(counter, map);
  populate.dummy(map);
  const creaturesQty = Math.floor(map.length * map[0].length / 100)
  populate.creatures(map, creaturesQty);
  return populate.entities();
}

const populate = {
  result: [],
  counter: 0,
  pID: undefined,
  player: function (counter, map) {
    this.counter = counter;
    const p = point.randomEmptyWalkable(this.result, map)
    const e = new Entity(this.counter);
    this.pID = this.counter;
    e.addComponent(new components.Player);
    e.addComponent(new components.Renderable);
    e.addComponent(new components.Movable);
    e.addComponent(new components.Active);
    e.addComponent(new components.BlocksMov)
    e.addComponent(new components.Position(p.x, p.y));
    e.addComponent(new components.Health);
    e.addComponent(new components.Inventory);
    e.addComponent(new components.Tags("player"));
    this.counter++;
    this.result.push(e);
  },
  dummy: function (map) {
    const p = point.randomEmptyWalkable(this.result, map)
    const e = new Entity(this.counter);
    //e.addComponent(new components.Player);
    e.addComponent(new components.Renderable);
    //e.addComponent(new components.Active);
    //e.addComponent(new components.Movable);
    //e.addComponent(new components.BlocksMov)
    e.addComponent(new components.Position(p.x, p.y));
    //e.addComponent(new components.Health);
    //e.addComponent(new components.Inventory);
    e.addComponent(new components.Tags("exit"));
    this.counter++;
    this.result.push(e);
  },
  creatures: function (map, qty) {
    let tries = 0
    while (qty > 0 && tries < K.TRIES) {
      const p = point.randomEmptyWalkable(this.result, map)
      if (p === undefined) {
        tries++
        continue
      }
      const e = new Entity(this.counter);
      e.addComponent(new components.Renderable);
      e.addComponent(new components.Active);
      e.addComponent(new components.Movable);
      e.addComponent(new components.BlocksMov)
      e.addComponent(new components.Position(p.x, p.y));
      e.addComponent(new components.Health);
      e.addComponent(new components.Tags("rat"));
      this.counter++;
      this.result.push(e);
      qty--
    }
  },
  entities: function () {
    return [this.result, this.counter, this.pID];
  },
};

export {
  populateMap,
};

