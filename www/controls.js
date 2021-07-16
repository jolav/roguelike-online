/* */
'use strict';

function actionKey(e) {
  let action = undefined;
  switch (e.key) {
    case 'ArrowUp':
    case '8':
    case 'W':
    case 'w':
      action = "up";
      break;
    case "ArrowRight":
    case "6":
    case 'D':
    case 'd':
      action = "right";
      break;
    case 'ArrowDown':
    case '2':
    case 'S':
    case 's':
      action = "down";
      break;
    case 'ArrowLeft':
    case '4':
    case 'A':
    case 'a':
      action = "left";
      break;
    case 't':
    case 'T':
      action = "skip";
      break;
    default:
    //console.log(e.target.id, ' -- Not recognized event');
  }
  //console.log('ACTION = ', action);
  return action;
}

export {
  actionKey
};
