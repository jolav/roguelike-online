/* */

console.log('Loading...../server/run.js');

import { lib, K } from "./_conf.js";
import * as  player from "./player.js";
import * as map from "./map.js";
import * as fov from "./fov.js";
import { npcs } from "./npcs.js";
import { items } from "./items.js";

const r = {
  nick: lib.randomNick(5, 2),
  token: lib.randomString(50),
  gameOver: {
    status: false,
    win: false,
  },
  counter: 0,
  turn: 0,
  pj: {},
  map: [],
  cam: { x: 0, y: 0 },
  npcs: [],
  items: [],
  history: ["8", "7", "6", "5", "4", "3", "2", "1", "Adventure begins..."],
  start: function () {
    this.map = map.create();
    this.pj = player.create(this.counter);
    this.counter++;
    this.npcs = npcs.create(r.counter);
    this.counter += this.npcs.length;
    this.items = items.create(r.counter);
    this.counter += this.items.length;
    this.cam = aux.updateCam();
    fov.get();
  },
  oneMoreTurn: function () {
    this.pj.actionDone = false;
    this.pj.takeAction();
    if (!this.pj.actionDone) {
      return;
    }
    npcs.turn(this.pj.pos, this.map);
    if (this.gameOver.status) {
      aux.gameOver();
    }
    this.cam = aux.updateCam();
    fov.get();
    this.turn++;
  },
};

const aux = {
  updateCam: function () {
    let x = r.pj.pos.x - Math.floor(K.CAM_COLS / 2);
    let y = r.pj.pos.y - Math.floor(K.CAM_ROWS / 2);
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
    }
    if (!r.gameOver.win) {
      console.log('THIS IS THE END');
    }
  }

};

export {
  r,
  aux,
};

