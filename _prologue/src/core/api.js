/* */

console.log('Loading..... /core/api.js');

import { K } from "./_konfig.js";

const api = {
  version: function () {
    return K.VERSION;
  }
};

export {
  api
};
