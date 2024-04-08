/* */

console.log('Loading...../core/run.js');

import { utils as u } from "./utils.js";
import * as map from "./map.js";
import { K } from "./_konfig.js";
import * as fov from "./fov.js";
import { populateMap } from "./entities.js";
//import { npcs } from "./classNpc.js";
import { queue } from "./queue.js";

const r = {
  nick: "",
  token: u.randomString(K.TOKEN_LENGTH),
  gameOver: {
    status: false,
    win: false,
  },
  counter: 0,
  turn: 0,
  cam: new u.Point(0, 0),
  entities: [],
  map: [],
  start: async function () {
    r.nick = await u.randomNick();
    r.map = map.create(K.TYPE_OF_MAP);
    r.entities = populateMap(0);
    r.counter += this.entities.length;
    r.cam = aux.updateCam(r.entities[0].pos);
    console.log('POPULATION CREATED => ', r.counter, r.entities.length);
    queue.create();
    //console.log(queue.list);
    fov.get();
    console.log(r.entities);
  },
  manageQueue: function (action) {
    //console.log('###### TURN ', r.turn, ' #######');
    //console.log(JSON.stringify(queue.list));
    // pj action
    const pj = r.entities[0];
    pj.actionDone = false;
    pj.realAction = "";
    pj.takeAction(action);
    if (!pj.actionDone) {
      return;
    }
    //console.log('PJ=', actionCost.get(pj.realAction));
    queue.update(actionCost.get(pj.realAction), 0); // add player
    //queue.update(50, 0);
    // end pj action
    //console.log(JSON.stringify(queue.list));
    let stop = false;
    let sec = 0;
    while (!stop && sec < 10) {//K.TRIES}
      const w = queue.list[0];
      if (w.id === 0) { // control returns to client
        stop = true;
      }
      if (w.id === -1) { // new turn
        r.turn++;
        queue.newTurn(w.wait);
      }
      if (w.id > 0) {
        //console.log("Moves =>", w.id);
        const npc = r.entities[w.id];
        if (npc.is.mobile) {
          npc.turn();
          //console.log(npc.name, '=', actionCost.get(npc.realAction));
          queue.update(actionCost.get(npc.realAction), w.id);
          //queue.update(100, w.id);
        }
      }
      sec++;
    }
    if (this.gameOver.status) {
      aux.gameOver();
    }
    r.cam = aux.updateCam(pj.pos);
    fov.get();
  }
};

const aux = {
  updateCam: function (pos) {
    if (K.TYPE_OF_MAP === 0) {
      return { x: 0, y: 0 };
    }
    let x = pos.x - Math.floor(K.CAM_COLS / 2);
    let y = pos.y - Math.floor(K.CAM_ROWS / 2);
    if (x < 0) {
      x = 0;
    } else if (x > K.MAP_COLS - K.CAM_COLS) {
      x = K.MAP_COLS - K.CAM_COLS;
    }
    if (y < 0) {
      y = 0;
    } else if (y > K.MAP_ROWS - K.CAM_ROWS) {
      y = K.MAP_ROWS - K.CAM_ROWS;
    }
    return { x, y };
  },
  gameOver: function () {
    if (r.gameOver.win) {
      console.log('THIS IS A VICTORY');
      alert('YOU LEAVE THE VAULT');
    }
    if (!r.gameOver.win) {
      console.log('THIS IS THE END');
      alert('YOU LOSE');
    }
    location.reload();
  }
};

const actionCost = new Map([
  ["UP", 100],
  ["DOWN", 100],
  ["LEFT", 100],
  ["RIGHT", 100],
  ["UPRIGHT", 100],
  ["UPLEFT", 100],
  ["DOWNRIGHT", 100],
  ["DOWNLEFT", 100],
  ["MELEE", 100],
  ["SKIP", 100],
]);

export {
  r
};
