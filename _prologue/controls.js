/* */

console.log('Loading.....controls.js');

function actionKey(e) {
  let action = undefined;
  switch (e.key.toUpperCase()) {
    case 'ARROWUP':
    case 'W':
      action = "UP";
      break;
    case "ARROWRIGHT":
    case 'D':
      action = "RIGHT";
      break;
    case 'ARROWDOWN':
    case 'S':
      action = "DOWN";
      break;
    case 'ARROWLEFT':
    case 'A':
      action = "LEFT";
      break;
    case 'T':
      action = "SKIP";
      break;
    case 'Q':
      action = "LOOT";
      break;
    case '1':
      action = "EAT";
      break;
    case '3':
      action = "HEAL";
      break;
    case 'F':
      action = "FIRE";
      break;
    case 'R':
      action = "SELECT";
      break;
    default:
    //console.log(e.key.toUpperCase(), ' -- Not recognized event');
  }
  //console.log('ACTION = ', action);
  return action;
}

export {
  actionKey,
};

