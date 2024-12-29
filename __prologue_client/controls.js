/* */

console.log('Loading..... controls.js');

function listenKeyboard() {
  window.addEventListener('keydown', function (e) {
    const playerAction = controls.actionKey(e);
    if (playerAction === undefined) {
      return;
    }
    /*if (e.repeat) {
      return;
    }*/
    /*if (!is_server_turn) {
      doAction(playerAction);
    }*/
  });
}

const controls = {
  actionKey: function (e) {
    let playerAction = undefined;
    //console.log(e.key, e.code, e.location, e.metaKey);
    if (e.location === 3) { // numpad
      playerAction = numPad.get(e.key);
    }
    if (e.location === 0) { // standard
      if (e.ctrlKey === true) { // CTRL is pressed
        e.preventDefault();
        playerAction = leftLoc.get(e.key);
      } else {
        playerAction = standard.get(e.key);
      }
    }
    if (playerAction === "") playerAction = undefined;
    //console.log('ACTION = ', playerAction);
    return playerAction;
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
