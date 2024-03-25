/* */

import { c } from "./_config.js";
import * as render from "./render_ascii.js";

let t;

const ask = {
  ping: function () {
    return fetchAPI.ping();
  },
  game: async function (token) {
    t = await fetchAPI.game(token, c.CAM_COLS + "_" + c.CAM_ROWS);
    if (t.error !== undefined) {
      alert(t.error);
      window.location.reload();
      return;
    }
    c.NICK = t.nick;
    c.TOKEN = t.token;
    c.VIEW_COLS = t.view.length;
    c.VIEW_ROWS = t.view[0].length;
    console.log('GAME,', t);
    render.ascii();
  },
  turn: async function (action) {
    t = await fetchAPI.turn(action, c.CAM_COLS + "_" + c.CAM_ROWS);
    t.nick = c.NICK;
    t.token = c.TOKEN;
    c.VIEW_COLS = t.view.length;
    c.VIEW_ROWS = t.view[0].length;
    //console.log('TURN,', t);
    render.ascii();
  },
  save: async function () {
    saveGame();
    const resp = await fetchAPI.save();
    console.log(resp);
    if (resp.status === "saved") {
      alert("GAME SAVED");
    } else {
      alert("ERROR SAVING");
    }
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
  game: async function (token, cam) {
    const start = Date.now();
    let data = {};
    try {
      const params = {
        token: token,
        cam: cam,
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
      console.error("ERROR fetchAPI NewTurn => ", err);
    }
    return data;
  },
  save: async function () {
    const start = Date.now();
    let data = {};
    try {
      const params = {
        token: t.token,
      };
      data = await fetch(c.API_URL + c.SAVE_ENDPOINT, {
        method: 'POST',
        body: new URLSearchParams(params),
      }); data = await data.json();
      data.lag = Date.now() - start;
    } catch (err) {
      console.error("ERROR fetchAPI Save => ", err);
    }
    return data;
  }
};

function saveGame() {
  console.log('SAVING GAME');
  const filename = c.NICK.split("_")[1] + "_" + t.turn + ".txt";
  const file = new Blob(
    [c.TOKEN],
    { type: "text/plain" }
  );
  const a = document.createElement("a");
  const url = URL.createObjectURL(file);
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

export {
  ask,
  t,
};
