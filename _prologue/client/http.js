/* */

console.log('Loading..... http.js');

import { config as c } from "./_config.js";
import { g } from "./game.js";
import * as render from "./render_ascii.js";

const ask = {
  nick: async function () {
    const path = c.NICK_API;
    const data = await fetchData(path, {});
    return data.name;
  },
  version: async function () {
    const start = performance.now();
    const path = c.API.url[c.API.used] + c.API.version;
    const data = await fetchData(path, {});
    const lag = (performance.now() - start);
    return [data.version, lag];
  },
  run: async function () {
    let path = c.API.url[c.API.used] + c.API.run;
    path += "?nick=" + g.NICK + "&cols=" + c.VIEW.COLS + "&rows=" + c.VIEW.ROWS;
    const run = await fetchData(path, {});
    if (run === undefined) {
      return;
    }
    g.ID = run.id;
    g.map = run.map;
    g.turn = 0;
    console.log(g);
    render.ascii();
    document.getElementById("action").innerHTML = g.turn + " " + "BEGIN";
  },
  turn: async function (action) {
    const path = c.API.url[c.API.used] + c.API.turn + "?action=" + action;
    const options = {
      method: "GET",
      headers: {
        Authorization: g.ID,
      }
    };
    g.IS_SERVER_TURN = true;
    const turn = await fetchData(path, options);
    g.IS_SERVER_TURN = false;
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
    console.log('ERROR 2 fetchData => ', err);
    return undefined;
  }
}
