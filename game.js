/* */

console.log('Loading.....game.js');

import * as render from "./render.js";
import * as map from "./map.js";
import { lib } from "./_config.js";
import { pj } from "./entity.js";

const a = {
  nick: "",
  token: "",
  gameOver: false,
  turn: 0,
  date: lib.getCurrentDate(0),
  entities: [],
  map: [],//{},
  history: [],
};

function start() {
  map.create();
  render.redraw();
}

function newTurn(action) {
  if (!pj.canMove(action)) {
    return;
  }
  a.turn++;
  a.date = lib.getCurrentDate(a.turn);
  move(action);
  render.redraw();
}

function move(action) {
  switch (action) {
    case "up":
      pj.y--;
      break;
    case "down":
      pj.y++;
      break;
    case "left":
      pj.x--;
      break;
    case "right":
      pj.x++;
      break;
    default:
      break;
  }
}

export {
  start,
  newTurn,
  a,
};

