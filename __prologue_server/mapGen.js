/* */

import { aux } from "./lib/aux.js";
import { K } from "./_konfig.js";

function generate(typeOfMap, cols, rows, rnd) {
  switch (typeOfMap) { // outdoors,indoors
    case "basicRoom":
      return basicRoom.create(cols, rows, rnd);
    case "shelter":
      return shelter.create();
  }
}

export {
  generate,
};

//////////

class Tile {
  constructor(terrain) {
    this.createTile(terrain);
  }
  createTile(terrain) {
    let p = [];
    switch (terrain) {
      case "floor":
        p = [terrain, true, false, false, false];
        break;
      case "wall":
        p = [terrain, false, true, false, false];
        break;
      case "unknown":
        p = [terrain, false, true, false, false];
        break;
      default:
        p = [];
    }
    this.terrain = terrain;
    this.walkable = p[1];
    this.blockLOS = p[2];
    this.explored = p[3];
    this.visible = p[4];
  }
}

///////////////////////////////
/////////// SHELTER ///////////
///////////////////////////////

const shelter = {
  create: function name(cols, rows) {
    return basicRoom.create(cols, rows);
  }
};

///////////////////////////////
///////// BASIC ROOM //////////
///////////////////////////////

const basicRoom = {
  map: [],
  create: function name(cols, rows, rnd) {
    const columns = Math.floor((cols * rows) / 30);
    this.map = aux.initializeMultiArray(cols, rows, {});
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
