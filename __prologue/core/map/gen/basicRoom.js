/* */

console.log('Loading..... /map/gen/basicRoom.js');

import { aux } from "./../../lib/aux.js";
import { K } from "./../../_konfig.js";
import { Tile } from "./../tile.js";

const basicRoom = {
  map: [],
  create: function name(cols, rows, rnd) {
    const columns = Math.floor((cols * rows) / 30);
    this.map = aux.InitializeMultiArray(cols, rows, {});
    this.clean(cols, rows);
    this.putColumns(cols, rows, columns, rnd);
    return this.map;
  },
  clean: function (cols, rows) {
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        if (x !== 0 && x !== cols - 1 && y !== 0 && y !== rows - 1) {
          this.map[x][y] = new Tile("floor");
        } else {
          this.map[x][y] = new Tile("wall");
        }
      }
    }
  },
  putColumns: function (cols, rows, columns, rnd) {
    let tries = 0;
    while (columns > 0 && tries < K.tries) {
      const x = rnd.int(1, cols - 2);
      const y = rnd.int(1, rows - 2);
      if (this.map[x][y].terrain === "floor") {
        this.map[x][y] = new Tile("wall");
        columns--;
      }
      tries++;
    }
  },
};

export {
  basicRoom,
};
