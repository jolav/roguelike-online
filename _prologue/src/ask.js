/* */

console.log('Loading..... ask.js');

import { api } from "./core/api.js";

const ask = {
  version: function () {
    return api.version();

  }
};

export {
  ask,
};
