/* */

console.log('Loading.....entity.js');

import { K } from "./_config.js";
import { a } from "./game.js";

const pj = {
  x: Math.floor(K.MAP_X / 2),
  y: Math.floor(K.MAP_Y / 2),
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
};
