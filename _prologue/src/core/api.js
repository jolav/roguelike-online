/* */

console.log('Loading..... /core/api.js');

import { K } from "./_konfig.js";
import { r } from "./run.js";
import { systems } from "./systems.js";

const api = {
  version: function () {
    return K.VERSION;
  },
  turn: function (params) {
    //console.log('TURN PARAMS => ', params);
    if (params.action === "new") {
      r.start(params);
    } else {
      r.turnLoop(params);
    }
    return clientData.prepare(r);
  }
};

export {
  api
};

const clientData = {
  prepare: function (r) {
    const entities = systems.renderable(r.entities);
    const cd = {
      turn: r.turn,
      entities: entities,
      view: r.map,
    };
    return cd;
  },
};
