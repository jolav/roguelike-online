/* */

console.log('Loading...../core/run.js');

import { utils as u } from "./utils.js";
import { createEntity } from "./entity.js";
import * as map from "./map.js";
import { K } from "./_konfig.js";
import * as fov from "./fov.js";

const r = {
  nick: "",
  token: u.randomString(K.TOKEN_LENGTH),
  counter: 0,
  turn: 0,
  cam: new u.Point(0, 0),
  pj: {},
  map: [],
  start: async function () {
    r.nick = await u.randomNick();
    r.map = map.create(K.TYPE_OF_MAP);
    r.pj = createEntity(r.counter);
    r.cam = aux.updateCam(r.pj.pos);
    r.counter++;
    fov.get();
    //console.log(JSON.stringify(r, null, 2));
  },
  oneMoreTurn: function (action) {
    if (!r.pj.move(action)) {
      return;
    }
    r.cam = aux.updateCam(r.pj.pos);
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
