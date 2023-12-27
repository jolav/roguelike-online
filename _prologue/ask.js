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
    const delay = lib.randomInt(100, 200) + 150;
    await lib.sleep(delay);
    const cam = {
      cols: C.CAM_COLS,
      rows: C.CAM_ROWS
    };
    t = api.turn(action, cam);
    render.ascii();
    panel.update();
    //console.log(JSON.stringify(t, null, 2));
  },
};

export {
  ask,
  t,
};

