/* */

console.log('Loading..... /core/sys_movement.js');

const movement = function (entities, action) {
  entities.forEach(function (e) {
    if (e.components.player && validMoves.includes(action)) {
      playerMove(action, e.components.position);
    }
  });
};

export {
  movement,
};

function playerMove(action, pos) {
  switch (action) {
    case "UPLEFT":
      pos.x--;
      pos.y--;
      break;
    case "UP":
      pos.y--;
      break;
    case "UPRIGHT":
      pos.x++;
      pos.y--;
      break;
    case "RIGHT":
      pos.x++;
      break;
    case "DOWNRIGHT":
      pos.x++;
      pos.y++;
      break;
    case "DOWN":
      pos.y++;
      break;
    case "DOWNLEFT":
      pos.x--;
      pos.y++;
      break;
    case "LEFT":
      pos.x--;
  }
}

const validMoves = [
  "UP",
  "DOWN",
  "LEFT",
  "RIGHT",
  "UPRIGHT",
  "UPLEFT",
  "DOWNRIGHT",
  "DOWNLEFT",
];

const validActions = [
  "UP",
  "DOWN",
  "LEFT",
  "RIGHT",
  "UPRIGHT",
  "UPLEFT",
  "DOWNRIGHT",
  "DOWNLEFT",
  "MELEE",
  "SKIP",
  "LOOT",
  "HEAL",
  "EAT",
  "FIRE",
];
