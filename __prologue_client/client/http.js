/* */

console.log('Loading..... client/http.js');

import { config as c } from "./_config.js";
import { g, game } from "./game.js";
import * as render from "./render_ascii.js";

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
  run: async function () {
    let path = c.API.URL[c.API.HOST] + c.API.RUN;
    path = path
      + "?nick=" + g.info.nick
      + "&cols=" + c.VIEW.COLS
      + "&rows=" + c.VIEW.ROWS;
    g.is_server_turn = true;
    const aux = await fetchData(path, {});
    g.is_server_turn = false;
    if (aux === undefined) {
      return;
    }
    game.create(aux);
    console.log('##### NEW GAME #####');
    //console.log(g.actions);
    //console.log(g.entities);
    //console.log(`Entities=${g.actions.length}, Actions=${g.actions.length}`);
    render.ascii();
    document.getElementById("action").innerHTML = g.turn + " " + "BEGIN";
  },
  turn: async function (action) {
    const start = performance.now();
    const path = c.API.URL[c.API.HOST] + c.API.TURN + "?action=" + action;
    //console.log(g.info.ID);
    const options = {
      method: "GET",
      headers: {
        "Authorization": g.info.id,
      }
    };
    g.is_server_turn = true;
    const turn = await fetchData(path, options);
    g.is_server_turn = false;
    if (turn === undefined) {
      return;
    }
    game.update(turn);
    const lag = Math.trunc(performance.now() - start);
    c.LAG = lag;
    //console.log(g.actions);
    //console.log(g.entities);
    //console.log(`Entities=${g.actions.length}, Actions=${g.actions.length}`);
    render.ascii();
    document.getElementById("action").innerHTML = g.turn + " " + action + " ping: " + lag;

  }
};

export {
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
