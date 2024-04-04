/* */

console.log('Loading.....http.js');

import { c, lib } from "./_config.js";
import { api } from "./core/api.js";
import * as render from "./render_ascii.js";

let t;

const ask = {
  ping: function () {
    return fetchAPI.ping();
  },
  turn: async function (action) {
    t = await fetchAPI.turn(action, c.CAM_COLS + "_" + c.CAM_ROWS);
    c.NICK = t.nick;
    c.TOKEN = t.token;
    //console.log(JSON.stringify(t, null, 2));
    //console.log(t.token);
    render.ascii();
  }
};

const fetchAPI = {
  ping: async function () {
    const start = Date.now();
    let data = {};
    try {
      switch (c.NETWORK) {
        case 0:
          await aux.sleep();
          break;
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
  turn: async function (action, cam) {
    const start = Date.now();
    let data = {};
    try {
      const params = {
        action: action,
        token: c.TOKEN,
        cam: cam,
      };
      switch (c.NETWORK) {
        case 0:
          await aux.sleep();
          break;
        case 1:
          await fetch(c.API_BASE_URL + c.TEST_ENDPOINT);
      }
      const startTurn = Date.now();
      data = api.turn(params);
      c.LAG2 = Date.now() - startTurn;
    } catch (err) {
      console.error("ERROR fetchAPI NewTurn => ", err);
    }
    c.LAG = Date.now() - start;
    return data;
  },
};

export {
  ask,
  t,
};

const aux = {
  sleep: function () {
    const delay = lib.randomInt(0, 100) + 150;
    return new Promise(function (resolve) {
      setTimeout(resolve, delay);
    });
  },
};
