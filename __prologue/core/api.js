/* */

console.log('Loading..... /core/api.js');

import { K } from "./_konfig.js";
import { Run } from "./run.js";

const api = {
  version: function () {
    return K.VERSION;
  },
  run: function (params) {
    const r = new Run(params);
    return r.prepareDataNew();
  },
  turn: function (params) {
    return undefined;
    //console.log('TURN PARAMS => ', params);
    /*if (params.action === "new") {
      await r.start();
    } else {
      r.turnLoop(params);
    }
    return clientData.prepare(r);*/
  },

};

export {
  api
};
