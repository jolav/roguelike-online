/* */

import { c } from "./_config.js";
import * as render from "./render_ascii.js";

let t;

const ask = {
  ping: function name() {
    return fetchAPI.ping();
  },
  game: async function () {
    t = await fetchAPI.game(c.CAM_COLS + "_" + c.CAM_ROWS);
    c.NICK = t.nick;
    c.TOKEN = t.token;
    //console.log('GAME,', t);
    render.ascii();
  },
  turn: async function (action) {
    t = await fetchAPI.turn(action, c.CAM_COLS + "_" + c.CAM_ROWS);
    t.nick = c.NICK;
    t.token = c.TOKEN;
    //console.log('TURN,', t);
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
  game: async function (cam) {
    const start = Date.now();
    let data = {};
    try {
      data = await fetch(c.API_URL + c.NEW_GAME_ENDPOINT + "?" +
        new URLSearchParams({
          cam: cam,
        }));
      data = await data.json();
      data.lag = Date.now() - start;
    } catch (err) {
      console.error("ERROR fetchAPI NewRun => ", err);
    }
    return data;
  },
  turn: async function (action, cam) {
    const start = Date.now();
    let data = {};
    try {
      const params = {
        action: action,
        token: t.token,
        cam: cam,
      };
      data = await fetch(c.API_URL + c.ACTION_ENDPOINT, {
        method: 'POST',
        body: new URLSearchParams(params),
      });
      data = await data.json();
      data.lag = Date.now() - start;
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
