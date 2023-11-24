/* */

console.log('Loadina.....game.js');

import * as render from "./render.js";
import * as map from "./map.js";
import { K, lib } from "./_config.js";

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

const pj = {
  x: Math.floor(K.COLS / 2),
  y: Math.floor(K.ROWS / 2),
  canMove: function (action) {
    const destination = {
      x: pj.x,
      y: pj.y,
      terrain: "",
    };
    switch (action) {
      case "up":
        destination.y--;
        break;
      case "down":
        destination.y++;
        break;
      case "left":
        destination.x--;
        break;
      case "right":
        destination.x++;
        break;
      default:
        break;
    }
    destination.terrain = a.map[destination.x][destination.y].terrain;
    if (destination.terrain === "floor") {
      return true;
    }
    return false;
  }
};

export {
  pj,
  start,
  newTurn,
  a,
};

