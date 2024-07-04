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
  animations: [],
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
    r.animations = [];
    r.history = [];
    const pj = r.entities[r.pID];
    // player action
    const actionType = actions.getType(params.action);
    const pos = pj.components.position;
    const view = pj.components.view;
    const target = aux.getTargetMove(params.action, pos);
    switch (actionType) {
      case "skip": {
        actions[actionType](pj, params.action);
        view.update(pos.current, 0, 0, "skip");
        r.animations.push(r.pID);
        history.history.skip();
        break;
      }
      case "movement": {
        if (!r.map[target.x][target.y].walkable) {
          //console.log('CANT PASS');
          view.update(pos.current, 0, 0, "illegal move");
          r.animations.push(r.pID);
          history.history.cantMove();
          return;
        }
        if (point.canEnter(target, r.entities)) {
          //console.log('MOVING');
          actions[actionType](pj, params.action);
          const dx = target.x - pos.current.x;
          const dy = target.y - pos.current.y;
          view.update(pos.current, dx, dy, "movement");
          r.animations.push(r.pID);
        } else {
          //console.log('MELEE');
          const es = point.getEntities(target, r.entities);
          if (es.length > 0) {
            for (let e of es) {
              if (e.components.queueable) {
                actions.melee(pj, e);
                const dx = target.x - pos.current.x;
                const dy = target.y - pos.current.y;
                //console.log('MELEE', dx, dy, pos.current);
                view.update(pos.current, dx, dy, "melee");
                r.animations.push(r.pID);
                break;
              }
            }
          }
        }
      }
    }
    const cost = actions.cost(actionType.toUpperCase());
    queue.update(cost, r.pID); // change this 0 for entityPlayer.id

    // computer turn
    let sec = 0;
    while (sec < K.TRIES) {
      const active = queue.list[0];
      if (active.id >= 0) {
        const e = r.entities[active.id];
        const view = e.components.view;
        const pos = e.components.position;
        if (e.components.player) { // player turn
          r.cam = updateCam(e.components.position.current);
          fov.get(e, r.map);
          return;
        }
        // active entities turn
        const action = actions.ai(e, r.entities, r.map, r.pID);
        const cost = actions.cost(action);
        let p = pos.current;
        let dx = 0;
        let dy = 0;
        if (action === "MELEE") {
          const target = aux.getTargetMove(action, pos);
          dx = target.x - pos.current.x;
          dy = target.y - pos.current.y;
        }
        view.update(p, dx, dy, actions.getType(action));
        r.animations.push(active.id);
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
