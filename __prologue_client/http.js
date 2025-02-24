/* */

console.log('Loading..... http.js');

import { config as c } from "./_config.js";
import { g } from "./game.js";
import * as render from "./render_ascii.js";

const ask = {
  nick: async function () {
    const data = await fetchData(c.API.NICK, {});
    return data.name;
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
      + "?nick=" + g.info.NICK
      + "&cols=" + c.VIEW.COLS
      + "&rows=" + c.VIEW.ROWS;
    g.is_server_turn = true;
    const aux = await fetchData(path, {});
    //onsole.log('AUX=>', aux);
    g.is_server_turn = false;
    if (aux === undefined) {
      return;
    }
    g.info.ID = aux.ID;
    g.info.SEED = aux.SEED;
    g.map = aux.map;
    g.turn = 0;
    console.log('##### NEW GAME #####');
    //console.log(g);//, run);
    render.ascii();
    document.getElementById("action").innerHTML = g.turn + " " + "BEGIN";
  },
  turn: async function (action) {
    const path = c.API.URL[c.API.HOST] + c.API.TURN + "?action=" + action;
    //console.log(g.info.ID);
    const options = {
      method: "GET",
      headers: {
        "Authorization": g.info.ID,
      }
    };
    g.is_server_turn = true;
    const turn = await fetchData(path, options);
    g.is_server_turn = false;
    if (turn === undefined) {
      return;
    }
    g.turn = turn.turn;
    console.log(g);
    document.getElementById("action").innerHTML = g.turn + " " + action;
  }
};

export {
  ask,
};

async function fetchData(path, options) {
  try {
    const response = await fetch(path, options);
    // console.log('=>', response);
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
