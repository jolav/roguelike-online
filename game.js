/* */

console.log('Loading.....game.js');

import * as render from "./render.js";
import { K } from "./_config.js";

const g = {
  currentDate: K.INIT_DATE,
  counter: 0,
};

function begin() {
  render.draw();
}

function newTurn(action) {
  g.counter++;
  g.currentDate = new Date(K.INIT_DATE.getTime() + 1000 * g.counter);
  move(action);
  render.draw();
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
  x: (K.WIDTH / 2) / K.PPP,
  y: (K.HEIGHT / 2) / K.PPP,
};

export {
  pj,
  begin,
  newTurn,
  g,
};

