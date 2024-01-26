/* */

import { c, lib } from "./_config.js";
import * as render from "./render_ascii.js";

let t;

const ask = {
  ping: function name() {
    return fetchAPI.ping();
  },
  newGame: async function () {
    t = await fetchAPI.newGame();
    render.ascii();
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
    return [data.version, data.lag];
  },
  newGame: async function () {
    let data;
    try {
      data = await fetch(c.API_URL + c.NEW_GAME_ENDPOINT);
      data = data.json();
    } catch (err) {
      console.error("ERROR fetchAPI NewRun => ", err);
    }
    return data;
  },
  newTurn: async function (action) {
    let data = {};
    try {
      const param = "&action=" + action + "&token=" + c.TOKEN;
      data = await fetch(c.API_URL + c.ACTION_ENDPOINT, 'POST', param);
    } catch (err) {
      console.error("ERROR FETCHING NEW TURN => ", err);
    }
    return data;
  },
};

export {
  ask,
  t,
};
