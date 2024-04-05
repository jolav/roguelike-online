/* */

console.log('Loading...../core/run.js');

import { utils as u } from "./utils.js";
import * as map from "./map.js";
import { K } from "./_konfig.js";
import * as fov from "./fov.js";
import { populateMap } from "./entities.js";
import { npcs } from "./classNpc.js";

const r = {
  nick: "",
  token: u.randomString(K.TOKEN_LENGTH),
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
    fov.get();
    console.log('POPULATION=> ', r.counter, r.entities.length);
    console.log(r.entities[0].constructor.name);
    console.log(r.entities[1].constructor.name);
  },
  oneMoreTurn: function (action) {
    const pj = r.entities[0];
    pj.actionDone = false;
    pj.takeAction(action);
    if (!pj.actionDone) {
      return;
    }
    npcs.turn();
    r.cam = aux.updateCam(pj.pos);
    fov.get();
    r.turn++;
  },
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
};

export {
  r
};
