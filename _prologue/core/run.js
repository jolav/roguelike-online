/* */

console.log('Loading...../core/run.js');

import { utils as u } from "./utils.js";
import { createEntity } from "./entity.js";
import * as map from "./map.js";
import { K } from "./_konfig.js";

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
  map: [],
  start: async function () {
    r.nick = await u.randomNick();
    r.pj = createEntity(r.counter);
    r.counter++;
    r.map = map.create(K.TYPE_OF_MAP);
    //console.log(JSON.stringify(r, null, 2));
  },
  oneMoreTurn: function (action) {
    if (action === "SKIP") {
      r.turn++;
      return;
    }
    if (r.pj.move(action)) {
      r.turn++;
    }
  },
};

export {
  r
};
