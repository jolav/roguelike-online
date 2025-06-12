/* */

console.log('Loading..... client/http.js');

import { config as c } from "./_config.js";
import { g, game } from "./game.js";
import { api } from "../core/api.js";
import { aux } from "./aux.js";
import * as render from "./render_ascii.js";

const http = {
  nick: async function () {
    const path = c.API.NICK;
    let data = {};
    try {
      data = await fetchData(path, {});
    } catch (err) {
      return aux.simpleNick(6, 2);
    }
    return data.name;
  },
  version: function () {
    return api.version();
  },
  run: function () {
    g.is_server_turn = true;
    const start = performance.now();
    const params = {
      nick: g.info.NICK,
      cols: c.VIEW.COLS,
      rows: c.VIEW.ROWS,
    };
    const data = api.run(params);
    if (data === undefined) {
      g.is_server_turn = false;
      return;
    }
    game.create(data);
    g.lag.cpu = Math.trunc(performance.now() - start);
    console.log(`##### NEW GAME created in ${g.lag.cpu} ms #####`);
    g.is_server_turn = false;
    //console.log(g.actions);
    //console.log(g.entities);
    render.ascii();
  },
  turn: function (action) {
    g.is_server_turn = true;
    const start = performance.now();
    const params = {
      action: action,
      cols: c.VIEW.COLS,
      rows: c.VIEW.ROWS,
    };
    const cpuStart = performance.now();
    const data = api.turn(params);
    if (data === undefined) {
      g.is_server_turn = false;
      return;
    }
    g.lag.cpu = Math.trunc(performance.now() - cpuStart);
    console.log(`Turn done in ${g.lag.cpu} ms`);
    const timeElapsed = Math.trunc(performance.now() - start);
    if (timeElapsed < c.API.TIMEOUT) {
      aux.sleep(c.API.TIMEOUT - timeElapsed);
    }
    game.update(data);
    g.is_server_turn = false;
    //render.ascii();
    return data;
  }
};

export {
  http,
};

async function fetchData(path, options) {
  try {
    const response = await fetch(path, options);
    // console.log('=>', response);
    if (response.ok) {
      if (response.status === 204) { // for /ping endpoint
        return undefined;
      }
      const data = await response.json();
      return data;
    } else {
      const msg = response.status + " " + response.statusText;
      console.log('ERROR 1 fetchData => ', msg);
      throw new Error(msg);
    }
  } catch (err) {
    console.log('ERROR 2 fetchData => ', err);
    throw err;
  }
}
