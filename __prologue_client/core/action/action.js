/* */

const action = {
  isValid: function (action) {
    return validActions.has(action.toUpperCase());
  }
};

const validActions = new Set([
  "UP",
  "DOWN",
  "LEFT",
  "RIGHT",
  "UPRIGHT",
  "UPLEFT",
  "DOWNRIGHT",
  "DOWNLEFT",
  "INVENTORY",
  "MELEE",
  "FIRE",
  "SKIP",
  "LOOT",
  "HEAL",
  "EAT",
  "SELECT",
  "SAVE",
]);

export {
  action
};
