/* */

console.log('Loading..... /core/run.js');

import { K } from "./_konfig.js";
import { populateMap } from "./entities.js";
import { actions } from "./actions.js";
import * as map from "./mapGen.js";
import { queue } from "./queue.js";
import * as fov from "./fov.js";
import { point } from "./point.js";
import { aux } from "./aux.js";
import * as history from "./history.js";

const r = {
  turn: 0,
  counter: 0,
  pID: undefined,
  cam: point.new(0, 0),
  map: [],
  entities: [],
  actions: [],
  history: history.create(),
  start: async function () {
    r.map = map.generate();
    [r.entities, r.counter, r.pID] = populateMap(r.counter, r.map);
    r.cam = updateCam(r.entities[r.pID].components.position.current);
    queue.create(r.entities);
    fov.init();
    fov.get(r.entities[r.pID], r.map);
  },
  turnLoop: function (params) {
    r.actions = [];
    r.history = [];
    //console.log(params.action);
    // player action
    const done = actions[actions.getType(params.action)](
      r.entities[r.pID],
      r.entities,
      r.map,
      params.action
    );
    if (!done) {
      const pos = r.entities[r.pID].components.position;
      const target = aux.getTargetMove(params.action, pos);
      const es = point.getEntities(target, r.entities);
      if (es.length > 0) {
        for (let e of es) {
          if (e.components.queueable) {
            actions.melee(r.entities[r.pID], e);
            break;
          }
        }
      } else {
        history.history.cantMove();
        return;
      }
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
          r.cam = updateCam(e.components.position.current);
          fov.get(e, r.map);
          return;
        }
        // active entities turn
        const cost = actions.ai(e, r.entities, r.map, r.pID);
        queue.update(cost, active.id);
      }
      if (active.id === -1) { // new turn
        r.turn++;
        queue.newTurn(active.wait);
        //queue.show();
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
    return point.new(0, 0);
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
  return point.new(x, y);
}
