/* */

console.log('Loading..... /core/api.js');

import { K } from "./_konfig.js";

const api = {
  version: function () {
    return K.VERSION;
  },
  turn: function (params) {
    //console.log('CORE => ', params);
    return { turn: "HI" };
  }
};

export {
  api
};

