/* */

console.log('Loading...../server/run.js');

import { lib, K } from "./_conf.js";
import { Player } from "./player.js";
import * as map from "./map.js";
import * as fov from "./fov.js";

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
  cam: { x: 0, y: 0 },
  //npc: [],
  //items: [],
  map: [],
  //history: ["8", "7", "6", "5", "4", "3", "2", "1", "Adventure begins..."],
  start: function () {
    this.map = map.create();
    this.pj = new Player(this.counter);
    this.cam = updateCam();
    fov.get();
    this.counter++;
  },
  oneMoreTurn: function () {
    this.pj.actionDone = false;
    this.pj.takeAction();
    if (!this.pj.actionDone) {
      return;
    }
    this.cam = updateCam();
    fov.get();
    this.turn++;
  },
};

function updateCam() {
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
}

export {
  r,
};

