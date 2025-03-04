/* */

console.log('Loading..... core/mapa/tile.js');

class Tile {
  constructor(terrain) {
    switch (terrain) {
      case "floor":
        this.terrain = terrain;
        this.walkable = true;
        this.blockLOS = false;
        break;
      case "wall":
      case "unknown":
        this.terrain = terrain;
        this.walkable = false;
        this.blockLOS = true;
        break;
      default:
        this.terrain = "unknown";
        this.walkable = false;
        this.blockLOS = true;
    }
    this.explored = false;
    this.visible = false;
  }
}

export {
  Tile
};
