/* */

console.log('Loading..... /core/run.js');

import { K } from "./_konfig.js";
import { populateMap } from "./entities.js";
import { systems } from "./systems.js";
import * as map from "./mapGen.js";

const r = {
  turn: 0,
  counter: 0,
  map: [],
  entities: [],
  start: function (params) {
    r.map = map.generate(params.cols, params.rows);
    [r.entities, r.counter] = populateMap(r.counter, params);
  },
  turnLoop: function (params) {
    systems.movement(r, params.action);
  },
};

export {
  r
};

