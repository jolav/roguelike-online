/* */

console.log('Loading..... http.js');

import { config as c } from "./_config.js";
import { g } from "./game.js";
import * as render from "./render_ascii.js";
import { router } from "../core/server.js";

const ask = {
  nick: async function () {
    const path = c.API.NICK;
    const data = await fetchData(path, {});
    return data.name;
  },
  version: async function () {
    const start = performance.now();
    const signal = AbortSignal.timeout(c.API.TIMEOUT);
    await fetchData(c.API.PING, { signal });
    const data = router.version();
    const lag = Math.trunc(performance.now() - start);
    return [data.version, lag];
  },
  run: async function () {
    const params = {
      nick: g.info.NICK,
      cols: c.VIEW.COLS,
      rows: c.VIEW.ROWS,
      mode: c.MODE,
    };
    g.is_server_turn = true;
    const signal = AbortSignal.timeout(c.API.TIMEOUT);
    await fetchData(c.API.PING, { signal });
    const run = router.run(params);
    g.is_server_turn = false;
    if (run === undefined) {
      return;
    }
    g.info.ID = run.id;
    g.info.SEED = run.seed;
    g.map = run.map;
    g.turn = 0;
    //console.log('##### NEW GAME #####');
    //console.log(g, run);
    render.ascii();
    document.getElementById("action").innerHTML = g.turn + " " + "BEGIN";
  },
  turn: async function (action) {
    const params = {
      action: action
    };
    g.is_server_turn = true;
    const signal = AbortSignal.timeout(c.API.TIMEOUT);
    await fetchData(c.API.PING, { signal });
    const turn = router.turn(params);
    g.is_server_turn = false;
    if (turn === undefined) {
      return;
    }
    g.turn = turn.turn;
    document.getElementById("action").innerHTML = g.turn + " " + action;
  }
};

export {
  ask,
};

async function fetchData(path, options) {
  try {
    const response = await fetch(path, options);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const msg = response.status + " " + response.statusText;
      console.log('ERROR 1 fetchData => ', msg);
      return undefined;
    }
  } catch (err) {
    const msg = "The operation timed out.";
    if (err instanceof DOMException && err.message === msg) {
      return undefined;
    }
    console.log('ERROR 2 fetchData => ', err);
    return undefined;
  }
}
