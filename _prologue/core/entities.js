/* */

console.log('Loading..... core/entities.js');

import { Entity } from "./ecs_entity.js";
import { components } from "./ecs_components.js";
import { point } from "./point.js";
import { run } from "./run.js";

function populateRun(r) {
  populate.dummie();
  populate.player(r.map, r.rnd);
  return populate.population;
}

const populate = {
  counter: 0,
  population: new Map(),
  dummie: function () {
    // empty Entity for test queries
    const e = new Entity();
    this.population.set(e.id, e);
  },
  player: function (map, rnd) {
    const e = new Entity();
    this.counter++;
    const p = point.randomEmptyWalkable(this.population, map, rnd);
    e.addComponent(new components.Position(p));
    e.addComponent(new components.Render("@", "White"));
    e.addComponent(new components.Info("player1"));
    e.addTag("player");
    e.addTag("movable");
    e.addTag("queueable");
    //e.log();
    this.population.set(e.id, e);
  }
};

const entities = {
  byId: function (id) {
    return run.entities.get(id);
  },
};

export {
  populateRun,
  entities,
};
