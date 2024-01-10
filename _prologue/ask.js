/* */

console.log('Loading.....ask.js');

import { C, lib } from "./_config.js";
import { api } from "./server/api.js";
import { actionKey } from "./controls.js";
import * as render from "./render_ascii.js";
import * as panel from "./panel.js";

let t;

const ask = {
  version: async function (cb) {
    const delay = lib.randomInt(100, 200) + 150;
    await lib.sleep(delay);
    C.VERSION = api.version();
    cb();
  },
  run: async function () {
    const delay = lib.randomInt(100, 200) + 150;
    await lib.sleep(delay);
    const cam = {
      cols: C.CAM_COLS,
      rows: C.CAM_ROWS
    };
    t = api.run(cam);
    C.MS_PER_TURN = t.msPerTurn;
    render.ascii();
    panel.update();
    window.addEventListener('keydown', function (e) {
      if (e.repeat) {
        //return;
      }
      const action = actionKey(e);
      if (action !== undefined) {
        ask.turn(action);
      }
    });
    //console.log(JSON.stringify(t, null, 2));
  },
  turn: async function (action) {
    if (action === "SELECT") {
      select.action();
      render.ascii();
      panel.update();
      return;
    }
    const delay = lib.randomInt(100, 200) + 150;
    await lib.sleep(delay);
    const cam = {
      cols: C.CAM_COLS,
      rows: C.CAM_ROWS
    };
    t = api.turn(action, cam, C.ID_SELECTED);
    if (t.gameOver.status) {
      aux.gameOver();
    }
    select.update();
    render.ascii();
    panel.update();
    //console.log(JSON.stringify(t, null, 2));
  },
};

const select = {
  selectables: [],//this.getSelectables(),
  action: function () {
    this.getSelectables();
    if (this.selectables.length === 0) {
      C.INDEX_SELECTED = undefined;
    } else if (C.INDEX_SELECTED === undefined) {
      C.INDEX_SELECTED = 0;
    } else {
      if (C.INDEX_SELECTED >= this.selectables.length - 1) {
        C.INDEX_SELECTED = 0;
      } else {
        C.INDEX_SELECTED++;
      }
    }
    if (C.INDEX_SELECTED !== undefined) {
      C.ID_SELECTED = select.selectables[C.INDEX_SELECTED].id;
      C.NPC_SELECTED = select.selectables[C.INDEX_SELECTED];
    }
  },
  update: function () {
    this.getSelectables();
    if (C.INDEX_SELECTED === undefined) {
      return;
    }
    if (!this.isSelectedStillAlive()) {
      C.INDEX_SELECTED = undefined;
      C.ID_SELECTED = undefined;
    }
  },
  isSelectedStillAlive: function () {
    const indexTarget = this.selectables.findIndex(function (e) {
      return e.id === C.ID_SELECTED;
    });
    const target = this.selectables[indexTarget];
    return target;
  },
  getSelectables: function name() {
    this.selectables = [];
    for (let e of t.npcs) {
      if (e.is.combatant) {
        this.selectables.push(e);
      }
    }
  }
};

const aux = {
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

export {
  ask,
  t,
};

