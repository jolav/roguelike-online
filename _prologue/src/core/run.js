/* */

console.log('Loading..... /core/run.js');

import { K } from "./_konfig.js";
import { populateMap } from "./entities.js";
import { actions } from "./actions.js";
import * as map from "./mapGen.js";
import { queue } from "./queue.js";
import { aux } from "./aux.js";

const r = {
  turn: 0,
  counter: 0,
  cam: aux.newPoint(0, 0),
  map: [],
  entities: [],
  start: async function () {
    r.map = map.generate();
    const x = Math.floor(r.map.length / 2);
    const y = Math.floor(r.map[0].length / 2);
    const pos = aux.newPoint(x, y);
    [r.entities, r.counter] = populateMap(r.counter, pos);
    r.cam = updateCam(r.entities[0].components.position.current);
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
    queue.update(cost, 0); // change this 0 for entityPlayer.id

    // computer turn
    let sec = 0;
    while (sec < K.TRIES) {
      const active = queue.list[0];
      if (active.id >= 0) {
        const e = r.entities[active.id];
        if (e.components.player) {
          r.cam = updateCam(r.entities[0].components.position.current);
          //console.log('end turn', r.cam);
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

function updateCam(pos) {
  if (K.TYPE_OF_MAP === 0) {
    return aux.newPoint(0, 0); //{ x: 0, y: 0 };
  }
  let x = pos.x - Math.floor(K.VIEW_COLS / 2);
  let y = pos.y - Math.floor(K.VIEW_ROWS / 2);
  if (x < 0) {
    x = 0;
  } else if (x > K.MAP_COLS - K.VIEW_COLS) {
    x = K.MAP_COLS - K.VIEW_COLS;
  }
  if (y < 0) {
    y = 0;
  } else if (y > K.MAP_ROWS - K.VIEW_ROWS) {
    y = K.MAP_ROWS - K.VIEW_ROWS;
  }
  return aux.newPoint(x, y); //{ x, y };
}
