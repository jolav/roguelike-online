/* */

console.log('Loading.....controls.js');

function actionKey(e) {
  let action = undefined;
  switch (e.key) {
    case 'ArrowUp':
    case 'W':
    case 'w':
      action = "up";
      break;
    case "ArrowRight":
    case 'D':
    case 'd':
      action = "right";
      break;
    case 'ArrowDown':
    case 'S':
    case 's':
      action = "down";
      break;
    case 'ArrowLeft':
    case 'A':
    case 'a':
      action = "left";
      break;
    case 'T':
    case 't':
      action = "skip";
      break;
    case 'Q':
    case 'q':
      action = "loot";
      break;
    case '1':
      action = "eat";
      break;
    case '3':
      action = "heal";
      break;
    case 'F':
    case 'f':
      action = "fire";
      break;
    case 'R':
    case 'r':
      action = "selectFoe";
      break;
    case "F":
    case "f":
      action = "fire";
      break;
    //case 'E':
    //case 'e':
    //  action = "erase"; // remove item, loot, corpse from map
    // break;
    default:
    //console.log(e.target.id, ' -- Not recognized event');
  }
  //console.log('ACTION = ', action);
  return action;
}

export {
  actionKey,
};
