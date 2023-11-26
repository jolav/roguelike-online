/* */

console.log('Loading.....map.js');

import { K } from "./_config.js";
import { a } from "./game.js";

function create() {
  for (let x = 0; x < K.MAP_X; x++) {
    a.map[x] = [];
    for (let y = 0; y < K.MAP_Y; y++) {
      let terrain = "floor";
      if (x === 0 || y === 0
        || x === K.MAP_X - 1 || y === K.MAP_Y - 1) {
        terrain = "wall";
      }
      a.map[x].push({
        terrain: terrain,
      },);
    }
  }
  //console.log(a.map);
}

export {
  create,
};
