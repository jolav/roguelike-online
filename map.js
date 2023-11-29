/* */

console.log('Loading.....map.js');

import { K, lib } from "./_config.js";
import { a } from "./game.js";

function create() {
  //oneBigRoom();
  vault();
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
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.type = "";
  }
}

function vault() {
  fillMapWithWalls();
  const r = createRoomInCenter();
  fillRoom(r);
  let success = 0;
  for (let tries = 1; tries < K.ROOM_TRIES; tries++) {
    //console.log(tries);
    const w = pickRandomWallFromAnyRoom();
    const f = pickRandomFeature();
    const r = convertFeatureToRoom(w, f);
    if (checkIsRoomForFeature(r)) {
      //console.log(r);
      //console.log(w);
      //console.log(f);
      fillRoom(r);
      fillWall(w);
      if (f.type === "room") {
        success++;
      }
      if (success >= K.MAX_ROOMS) {
        tries = K.ROOM_TRIES;
      }
    }
  }
}

function createRoomInCenter() {
  const width = lib.randomInt(K.MIN_SIZE_ROOM, K.MAX_SIZE_ROOM);
  const height = lib.randomInt(K.MIN_SIZE_ROOM, K.MAX_SIZE_ROOM);
  const x = Math.floor((K.MAP_X - width) / 2);
  const y = Math.floor((K.MAP_Y - height) / 2);
  const r = new Room(x, y, width, height);
  return r;
}

function pickRandomWallFromAnyRoom() {
  let found = false;
  let limit = 0;
  const w = new Wall(0, 0, 0, "");
  while (!found && limit < K.ROOM_TRIES) {
    w.x = lib.randomInt(4, K.MAP_X - 5);
    w.y = lib.randomInt(4, K.MAP_Y - 5);
    if (a.map[w.x][w.y].blocks) {
      getClearNeighbours(w);
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
}

function getClearNeighbours(w) {
  w.nei = 0;
  w.dir = "Zero";
  if (!a.map[w.x][w.y - 1].blocks) {
    w.nei++;
    w.dir = "S";
  }
  if (!a.map[w.x][w.y + 1].blocks) {
    w.nei++;
    w.dir = "N";
  }
  if (!a.map[w.x + 1][w.y].blocks) {
    w.nei++;
    w.dir = "W";
  }
  if (!a.map[w.x - 1][w.y].blocks) {
    w.nei++;
    w.dir = "E";
  }
}

function pickRandomFeature() {
  const rnd = lib.randomInt(1, 100);
  const f = new Feature(0, 0, "");
  switch (rnd < K.CORRIDOR_ODDS) {
    case true:
      f.width = 1;
      f.height = lib.randomInt(K.MIN_LENGTH_CORRIDOR, K.MAX_LENGTH_CORRIDOR);
      f.type = "corridor";
      break;
    case false:
      f.width = lib.randomInt(K.MIN_SIZE_ROOM, K.MAX_SIZE_ROOM);
      f.height = lib.randomInt(K.MIN_SIZE_ROOM, K.MAX_SIZE_ROOM);
      f.type = "room";
  }
  return f;
}

function convertFeatureToRoom(w, f) {
  const r = new Room(0, 0, 0, 0);
  switch (w.dir) {
    case "N":
      r.x = w.x - Math.floor(f.width / 2);
      r.y = w.y - f.height;
      r.width = f.width;
      r.height = f.height;
      break;
    case "S":
      r.x = w.x - Math.floor(f.width / 2);
      r.y = w.y + 1;
      r.width = f.width;
      r.height = f.height;
      break;
    case "E":
      r.x = w.x + 1;
      r.y = w.y - Math.floor(f.width / 2);
      r.width = f.height;
      r.height = f.width;
      break;
    case "W":
      r.x = w.x - f.height;
      r.y = w.y - Math.floor(f.width / 2);
      r.width = f.height;
      r.height = f.width;
  }
  return r;
}

function checkIsRoomForFeature(r) {
  if (r.x + r.width > K.MAP_X - 1 || r.y + r.height > K.MAP_Y - 1) {
    return false;
  }
  if (r.x <= 0 || r.y <= 0) { // =0 avoid rooms just in the edge
    return false;
  }
  const originX = r.x;
  const originY = r.y;
  for (let x = 0; x < r.width; x++) {
    for (let y = 0; y < r.height; y++) {
      if (!a.map[originX + x][originY + y].blocks) {
        return false;
      }
    }
  }
  return true;
}

function fillRoom(r) {
  const originX = r.x;
  const originY = r.y;
  for (let x = 0; x < r.width; x++) {
    for (let y = 0; y < r.height; y++) {
      a.map[originX + x][originY + y] = new Tile("floor");
    }
  }
}

function fillWall(w) {
  a.map[w.x][w.y] = new Tile("floor");
}

function fillMapWithWalls() {
  for (let x = 0; x < K.MAP_X; x++) {
    a.map[x] = [];
    for (let y = 0; y < K.MAP_Y; y++) {
      const terrain = "wall";
      a.map[x].push(
        new Tile(terrain)
      );
    }
  }
}

function oneBigRoom() {
  for (let x = 0; x < K.MAP_X; x++) {
    a.map[x] = [];
    for (let y = 0; y < K.MAP_Y; y++) {
      let terrain = "floor";
      if (x === 0 || y === 0
        || x === K.MAP_X - 1 || y === K.MAP_Y - 1) {
        terrain = "wall";
      }
      //<!-- testing FOV
      if ((x === 8) && (y === 5 || y === 10 || y === 15 || y === 20 || y === 25 || y === 30 || y === 35)) {
        terrain = "wall";
      }
      if ((x === 16) && (y === 5 || y === 10 || y === 15 || y === 20 || y === 25 || y === 30 || y === 35)) {
        terrain = "wall";
      }
      if ((x === 24) && (y === 5 || y === 10 || y === 15 || y === 20 || y === 25 || y === 30 || y === 35)) {
        terrain = "wall";
      }
      if ((x === 32) && (y === 5 || y === 10 || y === 15 || y === 20 || y === 25 || y === 30 || y === 35)) {
        terrain = "wall";
      }
      if ((x === 40) && (y === 5 || y === 10 || y === 15 || y === 20 || y === 25 || y === 30 || y === 35)) {
        terrain = "wall";
      }
      if ((x === 48) && (y === 5 || y === 10 || y === 15 || y === 20 || y === 25 || y === 30 || y === 35)) {
        terrain = "wall";
      }
      if ((x === 56) && (y === 5 || y === 10 || y === 15 || y === 20 || y === 25 || y === 30 || y === 35)) {
        terrain = "wall";
      }
      if ((x === 64) && (y === 5 || y === 10 || y === 15 || y === 20 || y === 25 || y === 30 || y === 35)) {
        terrain = "wall";
      }
      //-->
      a.map[x].push(
        new Tile(terrain)
      );
    }
  }
  //console.log(a.map);
}

export {
  create,
};

// TILES

class Tile {
  constructor(terrain) {
    this.createTile(terrain);
  }
  createTile(terrain) {
    let p = [];
    switch (terrain) {
      case "floor":
        p = [terrain, false, false, false, false];
        break;
      case "wall":
        p = [terrain, true, true, false, false];
        break;
      case "unknown":
        p = [terrain, true, true, false, false];
        break;
      default:
        p = [];
    }
    this.terrain = terrain;
    this.blocks = p[1];
    this.blockLOS = p[2];
    this.explored = p[3];
    this.visible = p[4];
  }
}

