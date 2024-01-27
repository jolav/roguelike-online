/* */

console.log('Loading.....controls.js');

function actionKey(e) {
  let action = undefined;
  switch (e.key.toUpperCase()) {
    case '8':
      action = "UP";
      break;
    case '6':
      action = "RIGHT";
      break;
    case '2':
      action = "DOWN";
      break;
    case '4':
      action = "LEFT";
      break;
    case '7':
      action = "UPLEFT";
      break;
    case '9':
      action = "UPRIGHT";
      break;
    case '1':
      action = "DOWNLEFT";
      break;
    case '3':
      action = "DOWNRIGHT";
      break;
    case 'T':
      action = "SKIP";
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

