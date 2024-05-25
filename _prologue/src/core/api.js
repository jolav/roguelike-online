/* */

console.log('Loading..... /core/api.js');

import { K } from "./_konfig.js";
import { r } from "./run.js";

const api = {
  version: function () {
    return K.VERSION;
  },
  turn: function (params) {
    console.log('CORE => ', params);
    if (params.action === "new") {
      r.start(params);
    } else {
      r.manageTurn(params);
    }
    return clientData.prepare(r);
  }
};

export {
  api
};

const clientData = {
  prepare: function (r) {
    const cd = {
      entities: r.entities,
    };
    return cd;
  },
};
