/* */

console.log('Loading...../core/run.js');

import { utils as u } from "./utils.js";
import { createEntity } from "./entity.js";

const r = {
  nick: "",
  token: u.randomString(50),
  gameOver: {
    status: false,
    win: false,
  },
  counter: 0,
  turn: 0,
  pj: {},
  start: async function () {
    this.nick = await u.randomNick();
    this.pj = createEntity(this.counter);
    this.counter++;
    //console.log(JSON.stringify(r, null, 2));
  },
  oneMoreTurn: function (action) {
    this.pj.move(action);
    this.pj.pos.current = this.pj.pos.target;
    this.turn++;
  },
};

export {
  r
};
