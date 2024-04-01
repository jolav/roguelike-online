/* */

console.log('Loading.....http.js');

import { c, lib } from "./_config.js";
import { api } from "./core/api.js";

const ask = {
  ping: function () {
    return fetchAPI.ping();
  }
};

const fetchAPI = {
  ping: async function () {
    const start = Date.now();
    let data = {};
    try {
      switch (c.NETWORK) {
        case 0: { // {} for declare vars inside case blocks
          const delay = lib.randomInt(0, 100) + 150;
          await aux.sleep(delay);
          break;
        }
        case 1:
          await fetch(c.API_BASE_URL + c.TEST_ENDPOINT);
      }
      data = api.version();
      //
    } catch (err) {
      console.log('ERROR fetchAPI Ping => ', err);
    }
    data.lag = Date.now() - start;
    return [data.version, data.lag];
  },
};

export {
  ask,
};

const aux = {
  sleep: function (ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  },
};
