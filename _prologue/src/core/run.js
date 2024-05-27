/* */

console.log('Loading..... /core/run.js');

import { K } from "./_konfig.js";
import { populateMap } from "./entities.js";
import { actions } from "./actions.js";
import * as map from "./mapGen.js";
import { queue } from "./queue.js";

const r = {
  turn: 0,
  counter: 0,
  map: [],
  entities: [],
  start: function (params) {
    r.map = map.generate(params.cols, params.rows);
    [r.entities, r.counter] = populateMap(r.counter, params);
    queue.create(r.entities);
  },
  turnLoop: function (params) {
    const actionType = actions.getType(params.action);
    if (actionType === "none") return;
    //actions[actionType](r.entities[0], r.map, params.action);
    //queue.update(100, 0);
    let stop = false;
    let sec = 0;
    while (!stop && sec < K.TRIES) {
      const active = queue.list[0];
      if (active.id === 0) {
        actions[actionType](r.entities[0], r.map, params.action);
        queue.update(100, 0);
        stop = true;
      }
      if (active.id === -1) { // new turn
        r.turn++;
        queue.newTurn(active.wait);
      }
      if (active.id > 0) {
        //console.log('turn => ', r.entities[active.id]);
        queue.update(100, active.id);
      }
      sec++;
    }
    // end computer turn
  },
};

export {
  r
};

