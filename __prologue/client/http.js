/* */

console.log('Loading..... ./client/https.js');

import { config as c } from "./_config.js";
import { g } from "./game.js";
//import * as render from "./render_ascii.js";

const ask = {
  nick: async function () {
    const path = c.API.NICK;
    const data = await fetchData(path, {});
    return data.name;
  },
  ping: async function () {
    const start = performance.now();
    const path = c.API.URL[c.API.HOST] + c.API.PING;
    const data = await fetchData(path, {});
    const lag = Math.trunc(performance.now() - start);
    return lag;
  },
  run: async function () {
    const [path, options] = backend.askData("run", undefined);
    g.is_server_turn = true;
    //const run = await fetchData(path, {});
    const run = undefined;
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
    //render.ascii();
    document.getElementById("action").innerHTML = g.turn + " " + "BEGIN";
  },
  turn: async function (action) {
    const [path, options] = backend.askData("turn", action);
    g.is_server_turn = true;
    //const turn = await fetchData(path, options);
    const turn = undefined;
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

const backend = {
  askData: function (requestType, action) {
    let path = "";
    let options = {};
    switch (c.BACKEND) {
      case true:
        if (requestType === "run") {
          path = c.API.URL[c.API.HOST] + c.API.RUN;
          path = path
            + "?nick=" + g.info.NICK
            + "&cols=" + c.VIEW.COLS
            + "&rows=" + c.VIEW.ROWS;
        }
        if (requestType === "turn") {
          path = c.API.URL[c.API.HOST] + c.API.TURN + "?action=" + action;
          options = {
            method: "GET",
            headers: {
              Authorization: g.info.ID,
            }
          };
        }
        break;
      case false:
        console.log('New Game/Turn');
    }
    return [path, options];
  }
};
async function fetchData(path, options) {
  try {
    const response = await fetch(path, options);
    if (response.status === 204) {
      return undefined;
    }
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
