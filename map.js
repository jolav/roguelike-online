/* */

console.log('Loading.....map.js');

import { K } from "./_config.js";
import { a } from "./game.js";

function create() {
  for (let x = 0; x < K.COLS; x++) {
    a.map[x] = [];
    for (let y = 0; y < K.ROWS; y++) {
      let terrain = "floor";
      if (x === 0 || y === 0
        || x === K.COLS - 1 || y === K.ROWS - 1) {
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
