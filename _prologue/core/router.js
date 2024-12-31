/* */

console.log('Loading..... core/router.js');

import { K } from "./_konfig.js";
import { run } from "./run.js";

const router = {
  version: function () {
    return ({ version: K.VERSION });
  },
  run: function (req) {
    K.MODE = req.mode;
    run.create(req);
    //console.log(run.info);
    return run.prepareDataNew();
  },
  doAction: function (req) {
    const now = Date.now();
    if (now - run.lastTurn < K.TICK) {
      return undefined;
    }
    const done = run.doAction(req);
    if (!done) {
      return undefined;
    }
    run.lastTurn = now;
    return run.prepareDataTurn();
  },
};

export {
  router
};
