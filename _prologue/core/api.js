/* */

console.log('Loading...../core/api.js');

import { K } from "./_konfig.js";
import { r } from "./run.js";

const api = {
  version: function () {
    const version = { version: dataRun.version };
    return version;
  },
  turn: async function (params) {
    if (params.action === "new") {
      K.CAM_COLS = params.cam.split("_")[0];
      K.CAM_ROWS = params.cam.split("_")[1];
      await r.start();
    } else {
      r.oneMoreTurn(params.action);
    }
    prepareDataForClient();
    return dataRun;
  }
};

let dataRun = {
  version: K.VERSION,
  nick: r.nick,
  token: r.token,
};

function prepareDataForClient() {
  dataRun = {
    version: K.VERSION,
    nick: r.nick,
    token: r.token,
    counter: r.counter,
    turn: r.turn,
    pj: r.pj,
    view: r.map,
  };
}

export {
  api,
};
