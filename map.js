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
        setTile(terrain)
      );
    }
  }
  //console.log(a.map);
}

export {
  create,
};

// TILES

function setTile(terrain) {
  switch (terrain) {
    case "floor":
      return createTile(terrain, false, false, false, false);
    case "wall":
      return createTile(terrain, true, true, false, false);
    case "unknown":
      return createTile(terrain, true, true, false, false);
    default:
      return createTile();
  }
}

function createTile(terrain, blocks, blockLOS, explored, visible) {
  const tile = {
    terrain: terrain,
    blocks: blocks,
    blockLOS: blockLOS,
    explored: explored,
    visible: visible,
  };
  return tile;
}

