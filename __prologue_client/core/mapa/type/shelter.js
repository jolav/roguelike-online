/* */

console.log('Loading..... core/map/shelter.js');

import { K } from "../../_konfig.js";
import { Tile } from "../tile.js";

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

///////////////////////////////
/////////// SHELTER ///////////
///////////////////////////////

const shelter = {
  map: [],
  create: function (cols, rows, rnd) {
    K.MAP_COLS = cols;
    K.MAP_ROWS = rows;
    this.fillMapWithWalls();
    const rm = this.createRoomInCenter(rnd);
    this.fillRoom(rm);
    let success = 0;
    for (let tries = 1; tries < K.TRIES; tries++) {
      const w = this.pickRandomWallFromAnyRoom(rnd);
      const f = this.pickRandomFeature(rnd);
      const rm = this.convertFeatureToRoom(w, f);
      if (this.checkIsRoomForFeature(rm)) {
        this.fillRoom(rm);
        this.fillWall(w);
        if (f.type === "room") {
          success++;
        }
        if (success >= K.MAX_ROOMS) {
          tries = K.TRIES;
        }
      }
    }
    return this.map;
  },
  createRoomInCenter: function (rnd) {
    const width = rnd.int(K.MIN_SIZE_ROOM, K.MAX_SIZE_ROOM);
    const height = rnd.int(K.MIN_SIZE_ROOM, K.MAX_SIZE_ROOM);
    const x = Math.floor((K.MAP_COLS - width) / 2);
    const y = Math.floor((K.MAP_ROWS - height) / 2);
    const rm = new Room(x, y, width, height);
    return rm;
  },
  pickRandomWallFromAnyRoom: function (rnd) {
    let found = false;
    let limit = 0;
    const w = new Wall(0, 0, 0, "");
    while (!found && limit < K.TRIES) {
      w.x = rnd.int(4, K.MAP_COLS - 5);
      w.y = rnd.int(4, K.MAP_ROWS - 5);
      if (!this.map[w.x][w.y].walkable) {
        this.getClearNeighbours(w);
        if (w.nei === 1) {
          found = true;
        }
      }
      limit++;
    }
    if (found) {
      return w;
    }
    return [0, 0, 0, ""];
  },
  getClearNeighbours: function (w) {
    w.nei = 0;
    w.dir = "Zero";
    if (this.map[w.x][w.y - 1].walkable) {
      w.nei++;
      w.dir = "S";
    }
    if (this.map[w.x][w.y + 1].walkable) {
      w.nei++;
      w.dir = "N";
    }
    if (this.map[w.x + 1][w.y].walkable) {
      w.nei++;
      w.dir = "W";
    }
    if (this.map[w.x - 1][w.y].walkable) {
      w.nei++;
      w.dir = "E";
    }
  },
  pickRandomFeature: function (rnd) {
    const odd = rnd.int(1, 100);
    const f = new Feature(0, 0, "");
    switch (odd < K.CORRIDOR_ODDS) {
      case true:
        f.width = 1;
        f.height = rnd.int(K.MIN_LENGTH_CORRIDOR, K.MAX_LENGTH_CORRIDOR);
        f.type = "corridor";
        break;
      case false:
        f.width = rnd.int(K.MIN_SIZE_ROOM, K.MAX_SIZE_ROOM);
        f.height = rnd.int(K.MIN_SIZE_ROOM, K.MAX_SIZE_ROOM);
        f.type = "room";
    }
    return f;
  },
  convertFeatureToRoom: function (w, f) {
    const rm = new Room(0, 0, 0, 0);
    switch (w.dir) {
      case "N":
        rm.x = w.x - Math.floor(f.width / 2);
        rm.y = w.y - f.height;
        rm.width = f.width;
        rm.height = f.height;
        break;
      case "S":
        rm.x = w.x - Math.floor(f.width / 2);
        rm.y = w.y + 1;
        rm.width = f.width;
        rm.height = f.height;
        break;
      case "E":
        rm.x = w.x + 1;
        rm.y = w.y - Math.floor(f.width / 2);
        rm.width = f.height;
        rm.height = f.width;
        break;
      case "W":
        rm.x = w.x - f.height;
        rm.y = w.y - Math.floor(f.width / 2);
        rm.width = f.height;
        rm.height = f.width;
    }
    return rm;
  },
  checkIsRoomForFeature: function (rm) {
    if (rm.x + rm.width > K.MAP_COLS - 1 || rm.y + rm.height > K.MAP_ROWS - 1) {
      return false;
    }
    if (rm.x <= 0 || rm.y <= 0) { // =0 avoid rooms just in the edge
      return false;
    }
    const originX = rm.x;
    const originY = rm.y;
    for (let x = 0; x < rm.width; x++) {
      for (let y = 0; y < rm.height; y++) {
        if (this.map[originX + x][originY + y].walkable) {
          return false;
        }
      }
    }
    return true;
  },
  fillRoom: function (rm) {
    const originX = rm.x;
    const originY = rm.y;
    for (let x = 0; x < rm.width; x++) {
      for (let y = 0; y < rm.height; y++) {
        this.map[originX + x][originY + y] = new Tile("floor");
      }
    }
  },
  fillWall: function (w) {
    this.map[w.x][w.y] = new Tile("floor");
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
  }
};

export {
  shelter
};
