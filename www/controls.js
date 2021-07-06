/* */
'use strict';

import { conf, game } from "./_config.js";
import { makeAsyncRequest } from "./lib.js";
import { drawGrid, redrawGrid } from "./render.js";

function actionKey(e) {
  let action = undefined;
  switch (e.key) {
    case 'ArrowUp':
    case '8':
    case 'W':
    case 'w':
      action = "up";
      // console.log('Up...')
      break;
    case "ArrowRight":
    case "6":
    case 'D':
    case 'd':
      action = "right";
      // console.log('Right...')
      break;
    case 'ArrowDown':
    case '2':
    case 'S':
    case 's':
      action = "down";
      // console.log('Down...')
      break;
    case 'ArrowLeft':
    case '4':
    case 'A':
    case 'a':
      action = "left";
      // console.log('Left...')
      break;
    default:
    //console.log(e.target.id, ' -- Not recognized event');
  }
  console.log('ACTION = ', action);
  if (action) {
    console.log('hacer request');
    turn(action);
  }
}

async function turn(action) {
  let data = {
    nick: "",
    token: "",
    cols: 0,
    rows: 0,
    grid: [],
    x: 0,
    y: 0

  };
  try {
    const param = "&action=" + action + "&token=" + game.token;
    data = await makeAsyncRequest(conf.apiUrlBase + "/action", 'POST', param);
  } catch (err) {
    console.error("ERROR FETCHING NEW GAME => ", err);
  }
  //console.log("1111", data);
  redrawGrid(data);
}

export {
  actionKey
};
