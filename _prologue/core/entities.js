/* */

console.log('Loading..... core/entities.js');

import { Entity } from "./ecs_entity.js";
import { components } from "./ecs_components.js";
import { point } from "./point.js";

function populateRun(map) {
  //console.log( map.length, map[0].length);
  populate.dummie(map);
  populate.player(map);
  return populate.population;
}

const populate = {
  counter: 0,
  population: new Map(),
  dummie: function (map) {
    // empty Entity for test queries
    const e = new Entity();
    this.population.set(e.id, e);
  },
  player: function (map) {
    const e = new Entity();
    this.counter++;
    const p = point.new(0, 0);
    e.addComponent(new components.Position(p.x, p.y));
    /*e.components.Position.current.x = 5;
    const p2 = point.new(1, 1);
    e.components.Position.current = p2;
    e.removeComponent(components.Position);*/
    e.addTag("player");
    e.addTag("visible");
    e.addTag("movable");
    //e.log();
    this.population.set(e.id, e);
  }
};

export {
  populateRun
};
