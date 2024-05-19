/* */

console.log('Loading..... http.js');

import { c } from "./_config.js";
import * as render from "./render_ascii.js";

let t;

const ask = {
  ping: function () {
    return fetchAPI.ping();
  },
  game: async function (nick) {
    t = await fetchAPI.game(nick);
    console.log('GAME ', t);
    render.ascii();
  }
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
  game: async function (nick) {
    const start = Date.now();
    let data = {};
    try {
      const params = {
        cam: c.VIEW_COLS + "__" + c.VIEW_ROWS,
        nick: nick,
      };
      data = await fetch(c.API_URL + c.NEW_GAME_ENDPOINT, {
        method: 'POST',
        body: new URLSearchParams(params),
      });
      data = await data.json();
      data.lag = Date.now() - start;
    } catch (err) {
      console.error("ERROR fetchAPI NewRun => ", err);
    }
    return data;
  },
};

export {
  ask,
  t,
};
