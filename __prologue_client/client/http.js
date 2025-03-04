/* */

console.log('Loading..... client/http.js');

import { config as c } from "./_config.js";
import { router } from "../core/router.js";
import { g } from "./game.js";
import * as render from "./render_ascii.js";

const ask = {
  run: async function () {
    g.is_server_turn = true;
    const aux = router.run(g.info.NICK, c.VIEW.COLS, c.VIEW.ROWS);
    //console.log('AUX=>', aux.PJ.Current);
    g.is_server_turn = false;
    if (aux === undefined) {
      return;
    }
    g.create(aux);
    console.log('##### NEW GAME #####');
    render.ascii();
    document.getElementById("action").innerHTML = g.turn + " " + "BEGIN";
  },
  turn: async function (action) {
    g.is_server_turn = true;
    const turn = router.turn(action);
    g.is_server_turn = false;
    if (turn === undefined) {
      return;
    }
    g.update(turn);
    //console.log(g);
    render.ascii();
    document.getElementById("action").innerHTML = g.turn + " " + action;
  }
};

const httpServer = {
  nick: async function () {
    const data = await fetchData(c.API.NICK, {});
    return data.name;
  },
  ping: async function () {
    const start = performance.now();
    const path = c.API.URL[c.API.HOST] + c.API.PING;
    await fetchData(path, {});
    const lag = Math.trunc(performance.now() - start);
    return lag;
  },
  version: async function () {
    const start = performance.now();
    const path = c.API.URL[c.API.HOST] + c.API.VERSION;
    const data = await fetchData(path, {});
    const lag = Math.trunc(performance.now() - start);
    return [data.version, lag];
  },
};

export {
  ask,
  httpServer,
};

async function fetchData(path, options) {
  try {
    const response = await fetch(path, options);
    // console.log('=>', response);
    if (response.ok) {
      if (response.status === 204) { // for /ping endpoint
        return;
      }
      const data = await response.json();
      return data;
    } else {
      const msg = response.status + " " + response.statusText;
      console.log('ERROR 1 fetchData => ', msg);
      return undefined;
    }
  } catch (err) {
    console.log('ERROR 2 fetchData => ', err);
    return undefined;
  }
}
