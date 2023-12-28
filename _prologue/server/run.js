/* */

console.log('Loading...../server/run.js');

import { lib } from "./_conf.js";
import { Player } from "./player.js";
import * as map from "./map.js";

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
  //npc: [],
  //items: [],
  map: [],
  //history: ["8", "7", "6", "5", "4", "3", "2", "1", "Adventure begins..."],
  start: function () {
    this.map = map.create();
    this.pj = new Player(this.counter);
    this.counter++;
  },
  oneMoreTurn: function () {
    this.pj.actionDone = false;
    this.pj.takeAction();
    if (!this.pj.actionDone) {
      return;
    }
    this.turn++;
  },
};

export {
  r,
};

