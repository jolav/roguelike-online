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
    //c.VIEW_COLS = c.CAM_COLS;
    //c.VIEW_ROWS = c.CAM_ROWS;
    //console.log(t.view.length, t.view[0].length);
    //t.view.length = c.CAM_COLS;
    //t.view[0].length = c.CAM_ROWS;
    //console.log(JSON.stringify(t, null, 2));
    //console.log(t.view);
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
      //await aux.sleep();
      data = api.turn(params);
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
