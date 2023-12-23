/* */

console.log('Loading....../server/run.js');

import { lib } from "./_conf.js";
import { Player } from "./player.js";

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
  //map: map.create(),
  //history: ["8", "7", "6", "5", "4", "3", "2", "1", "Adventure begins..."],
  start: function () {
    this.pj = new Player(this.counter);
    this.counter++;
  },
  oneMoreTurn: function (action) {
    this.pj.takeAction(action);
    this.turn++;
  },
};

export {
  r,
};

