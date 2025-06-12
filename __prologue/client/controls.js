/* */

console.log('Loading..... client/controls.js');

import { http } from "./http.js";
import { g } from "./game.js";
import { config as c } from "./_config.js";

function listenKeyboard() {
  window.addEventListener('keydown', function (e) {
    const action = controls.actionKey(e);
    if (action === undefined) {
      return;
    }
    /*if (e.repeat) {
      return;
    }*/
    if (!g.is_server_turn) {
      const now = Date.now();
      if (now - g.lastTurn < c.API.TIMEOUT) {
        return;
      }
      console.log(action);
      http.turn(action);
      g.lastTurn = now;
    }
  });
}

const controls = {
  actionKey: function (e) {
    let action = undefined;
    //console.log(e.key, e.code, e.location, e.metaKey);
    if (e.location === 3) { // numpad
      action = numPad.get(e.key);
    }
    if (e.location === 0) { // standard
      if (e.ctrlKey === true) { // CTRL is pressed
        e.preventDefault();
        action = leftLoc.get(e.key);
      } else {
        action = standard.get(e.key);
      }
    }
    if (action === "") action = undefined;
    //console.log('ACTION = ', action);
    return action;
  },
};

const numPad = new Map([
  ["0", ""],
  ["1", "DOWNLEFT"],
  ["2", "DOWN"],
  ["3", "DOWNRIGHT"],
  ["4", "LEFT"],
  ["5", "SKIP"],
  ["6", "RIGHT"],
  ["7", "UPLEFT"],
  ["8", "UP"],
  ["9", "UPRIGHT"],
  ["NumLock", ""],
  ["/", ""],
  ["*", ""],
  ["-", ""],
  ["+", ""],
  ["Enter", ""],
  [".", ""],
]);

const standard = new Map([
  ["b", "DOWNLEFT"],
  ["j", "DOWN"],
  ["n", "DOWNRIGHT"],
  ["h", "LEFT"],
  ["t", "SKIP"],
  ["l", "RIGHT"],
  ["y", "UPLEFT"],
  ["k", "UP"],
  ["u", "UPRIGHT"],
  ["i", "INVENTORY"],
  ["q", "LOOT"],
  ["1", "EAT"],
  ["3", "HEAL"],
  ["f", "FIRE"],
  ["r", "SELECT"],
]);

const leftLoc = new Map([
  ["s", "SAVE"],
]);

export {
  listenKeyboard,
};
