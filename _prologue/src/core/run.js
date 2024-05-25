/* */

console.log('Loading..... /core/run.js');

import { populateMap } from "./entities.js";
import { systems } from "./systems.js";

const r = {
  turn: 0,
  counter: 0,
  entities: [],
  start: function (params) {
    [r.entities, r.counter] = populateMap(r.counter, params);
  },
  turnLoop: function (params) {
    systems.movement(r.entities, params.action);
  },
};

export {
  r
};

