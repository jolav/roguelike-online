/* */

console.log('Loading...../server/api.js');

import { K } from "./_config.js";

const api = {
  version: function () {
    const version = { version: dataGame.version };
    return version;
  },
};

const dataGame = {
  version: K.VERSION
};

export {
  api,
};
