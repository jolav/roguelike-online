/* */

console.log('Loading...../server/map.js');

import { K } from "./_conf.js";

function create() {
  return vault.create();
}

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

const vault = {
  map: [],
  create: function name() {
    this.fillMapWithWalls();
    this.cleanRoom();
    return this.map;
  },
  fillMapWithWalls: function () {
    for (let x = 0; x < K.MAP_COLS; x++) {
      this.map[x] = [];
      for (let y = 0; y < K.MAP_ROWS; y++) {
        const terrain = "wall";
        this.map[x].push(
          new Tile(terrain)
        );
      }
    }
  },
  cleanRoom: function () {
    for (let x = 0; x < K.MAP_COLS; x++) {
      for (let y = 0; y < K.MAP_ROWS; y++) {
        if (x !== 0 && y !== 0 && x !== K.MAP_COLS - 1 && y !== K.MAP_ROWS - 1) {
          this.map[x][y] = new Tile("floor");
        }
      }
    }
  }
};

export {
  create,
};

