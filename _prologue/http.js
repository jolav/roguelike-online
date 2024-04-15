/* */

console.log('Loading.....http.js');

import { c, lib } from "./_config.js";
import { api } from "./core/api.js";
import * as render from "./render_ascii.js";

let t;

const endpoints = [
  c.PING_ENDPOINT, c.TEST_ENDPOINT, c.OK_ENDPOINT,
];

const ask = {
  ping: function () {
    return fetchAPI.ping();
  },
  turn: async function (action) {
    c.IS_SERVER_TURN = true;
    if (action === "SELECT") {
      select.action();
      render.ascii();
      c.IS_SERVER_TURN = false;
      return;
    }
    if (action === "FIRE") {
      if (c.ID_SELECTED === undefined) {
        c.IS_SERVER_TURN = false;
        return;
      }
    }
    t = await fetchAPI.turn(action, c.CAM_COLS + "_" + c.CAM_ROWS);
    if (t.gameOver.status) {
      aux.gameOver();
    }
    c.NICK = t.nick;
    c.TOKEN = t.token;
    c.HISTORY = c.HISTORY.concat(t.history);
    //console.log(JSON.stringify(t, null, 2));
    //console.log(t);
    select.update();
    render.ascii();
    c.IS_SERVER_TURN = false;
  }
};

const fetchAPI = {
  ping: async function () {
    const start = Date.now();
    let data = {};
    try {
      switch (c.NETWORK) {
        case 0:
          await aux.sleep();
          break;
        case 1:
          await fetch(c.API_BASE_URL + endpoints[c.ENDPOINTS]);
      }
      data = api.version();
      //
    } catch (err) {
      console.log('ERROR fetchAPI Ping => ', err);
    }
    data.lag = Date.now() - start;
    return [data.version, data.lag];
  },
  turn: async function (action, cam) {
    const start = Date.now();
    let data = {};
    try {
      const params = {
        action: action,
        token: c.TOKEN,
        cam: cam,
        selected: c.ID_SELECTED,
      };
      switch (c.NETWORK) {
        case 0:
          await aux.sleep();
          break;
        case 1:
          await fetch(c.API_BASE_URL + endpoints[1]);
      }
      const startTurn = Date.now();
      data = api.turn(params);
      c.LAG2 = Date.now() - startTurn;
    } catch (err) {
      console.error("ERROR fetchAPI NewTurn => ", err);
    }
    c.LAG = Date.now() - start;
    return data;
  },
};

export {
  ask,
  t,
};

const select = {
  selectables: [],//this.getSelectables(),
  action: function () {
    this.getSelectables();
    if (this.selectables.length === 0) {
      c.INDEX_SELECTED = undefined;
    } else if (c.INDEX_SELECTED === undefined) {
      c.INDEX_SELECTED = 0;
    } else {
      if (c.INDEX_SELECTED >= this.selectables.length - 1) {
        c.INDEX_SELECTED = 0;
      } else {
        c.INDEX_SELECTED++;
      }
    }
    if (c.INDEX_SELECTED !== undefined) {
      c.ID_SELECTED = select.selectables[c.INDEX_SELECTED].id;
      c.NPC_SELECTED = select.selectables[c.INDEX_SELECTED];
    }
  },
  update: function () {
    this.getSelectables();
    if (c.INDEX_SELECTED === undefined) {
      return;
    }
    if (!this.isSelectedStillAlive()) {
      c.INDEX_SELECTED = undefined;
      c.ID_SELECTED = undefined;
    }
  },
  isSelectedStillAlive: function () {
    const indexTarget = this.selectables.findIndex(function (e) {
      return e.id === c.ID_SELECTED;
    });
    const target = this.selectables[indexTarget];
    return target;
  },
  getSelectables: function name() {
    this.selectables = [];
    for (let e of t.entities) {
      if (e.is.combatant && e.id !== 0) { // exclude player
        this.selectables.push(e);
      }
    }
  }
};

const aux = {
  sleep: function () {
    const delay = lib.randomInt(0, 100) + 150;
    return new Promise(function (resolve) {
      setTimeout(resolve, delay);
    });
  },
  gameOver: function () {
    if (t.gameOver.win) {
      //console.log('THIS IS A VICTORY');
      alert('YOU LEAVE THE VAULT');
    }
    if (!t.gameOver.win) {
      //console.log('THIS IS THE END');
      alert('YOU LOSE');
    }
    location.reload();
  }
};
