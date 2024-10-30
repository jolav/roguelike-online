/* */

console.log('Loading..... http.js');

import { config as c } from "./_config.js";
import { g } from "./game.js";
import * as render from "./render_ascii.js";
import { router } from "../core/router.js";
import { aux } from "../aux/aux.js";

const ask = {
  nick: async function () {
    const path = c.API.NICK;
    const signal = AbortSignal.timeout(c.API.NICK_TIMEOUT);
    const data = await fetchData(path, { signal });
    if (data === undefined) {
      return "guest-" + aux.RandomInt(1, 10000);
    }
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
    const start = performance.now();
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
    g.info.ID = run.info.ID;
    g.info.SEED = run.info.SEED;
    g.map = run.map;
    g.entities = run.entities;
    g.actions = run.actions;
    //console.log('Entities =>', g.entities.size);
    g.turn = 0;
    //console.log('##### NEW GAME #####');
    //console.log(g, run);
    c.LAG = Math.trunc(performance.now() - start);
    render.ascii();
    document.getElementById("action").innerHTML = g.turn + " " + "BEGIN";
  },
  doAction: async function (playerAction) {
    const start = performance.now();
    const params = {
      playerAction: playerAction
    };
    g.is_server_turn = true;
    const signal = AbortSignal.timeout(c.API.TIMEOUT);
    await fetchData(c.API.PING, { signal });
    const t = router.doAction(params);
    g.is_server_turn = false;
    if (t === undefined) {
      return; // too early pressed key or invalid playerAction
    }
    g.turn = t.turn;
    g.entities = t.entities;
    g.actions = t.actions;
    //console.log(g.actions);
    c.LAG = Math.trunc(performance.now() - start);
    render.ascii();
    document.getElementById("action").innerHTML = g.turn + " " + playerAction;
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
