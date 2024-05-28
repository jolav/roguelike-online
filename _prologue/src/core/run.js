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
    // player action
    const actionType = actions.getType(params.action);
    if (actionType === "none") {
      return;
    }
    const done = actions[actionType](r.entities[0], r.map, params.action);
    if (!done) {
      return;
    }
    const cost = actions.cost(params.action);
    queue.update(cost, 0);

    // computer turn
    let sec = 0;
    while (sec < K.TRIES) {
      const active = queue.list[0];
      if (active.id >= 0) {
        const e = r.entities[active.id];
        if (e.components.player) {
          return;
        }
        //console.log('turn => ', e.id);
        queue.update(100, active.id);
      }
      if (active.id === -1) { // new turn
        //console.log('New Turn');
        r.turn++;
        queue.newTurn(active.wait);
      }
      sec++;
    }
    // end computer turn
  },
};

export {
  r
};

