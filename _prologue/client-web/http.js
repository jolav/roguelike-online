/* */

console.log('Loading..... http.js');

import { c } from "./_config.js";

const ask = {
  ping: function () {
    return fetchAPI.ping();
  },
};

const fetchAPI = {
  ping: async function () {
    const start = Date.now();
    let data = {};
    try {
      data = await fetch(c.API_URL + c.PING_ENDPOINT);
      data = await data.json();
      data.lag = Date.now() - start;
    } catch (err) {
      console.log('ERROR fetchAPI Ping => ', err);
    }
    return data.lag;
  },
};

export {
  ask
};
