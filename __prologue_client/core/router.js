/* */

console.log('Loading..... core/router.js');

import { Run } from "./run.js";
import { K } from "./_konfig.js";

const router = {
  run: function (nick, cols, rows) {
    const r = new Run(nick, cols, rows);
    return r.prepareDataNew();
    //console.log(r);
    //send.jsonResult(res, 200, r.prepareDataNew(), false);
  },
  turn: function () {
    const r = {};//Runs.get(req.headers.authorization);
    if (r === undefined) {
      //send.jsonResult(res, 401, { msg: "Unauthorizated" }, false);
      return;
    }
    const now = Date.now();
    if (now - r.lastTurn < K.tick) {
      //send.jsonResult(res, 425, { msg: "Too early" }, false);
      return;
    }
    // do action
    r.lastTurn = now;
    r.turn++;
    //send.jsonResult(res, 200, r.prepareDataTurn(), false);
  }

};

export {
  router
};
