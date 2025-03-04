/* */

console.log('Loading..... core/router.js');

import { Run } from "./run.js";
import { K } from "./_konfig.js";
import { action } from "./action/action.js";

let run = {};

const router = {
  run: function (nick, cols, rows) {
    run = new Run(nick, cols, rows);
    return run.prepareDataNew();
  },
  turn: function (command) {
    if (!action.isValid(command)) {
      return;
    }
    const now = Date.now();
    if (now - run.lastTurn < K.TICK) { // Too Early
      console.log('TOO EARLY');
      return;
    }
    // do action
    run.doAction(command);
    run.lastTurn = now;
    run.turn++;
    return run.prepareDataTurn();
  }

};

export {
  router,
  run,
};
