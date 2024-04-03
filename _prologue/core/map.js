/* */

console.log('Loading...../core/map.js');

import { K } from "./_konfig.js";
import { utils as u } from "./utils.js";

function create(option) {
  switch (option) {
    case 0:
      return testRoom.create();
    case 1:
      return shelter.create();
  }
}

class Room {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

class Wall {
  constructor(x, y, nei, dir) {
    this.x = x;
    this.y = y;
    this.nei = nei;
    this.dir = dir;
  }
}

class Feature {
  constructor(width, height, type) {
    this.width = width;
    this.height = height;
    this.type = type;
  }
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

const shelter = {};

///////////////////////////////
////////// TEST ROOM //////////
///////////////////////////////

const testRoom = {
  map: [],
  create: function name() {
    K.MAP_COLS = K.CAM_COLS;
    K.MAP_ROWS = K.CAM_ROWS;
    this.fillMapWithWalls();
    this.cleanRoom();
    this.putColumns(20);
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
  },
  putColumns: function (many) {
    for (let c = 0; c < many; c++) {
      const a = u.randomInt(1, K.MAP_COLS - 1);
      const b = u.randomInt(1, K.MAP_ROWS - 1);
      if (this.map[a][b].walkable) {
        this.map[a][b] = new Tile("wall");
      }
    }
  }
};

export {
  create,
};
