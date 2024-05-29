/* */

console.log('Loading..... /core/fov.js');

function get(e, map) {
  return fov.rayCast(e, map);
}

function init() {
  fov.initTables();
}

export {
  init,
  get,
};

const fov = {
  sin: {},
  cos: {},
  losRadius: 20,

  initTables() {
    for (let i = 0; i < 360; i++) {
      const ax = Math.sin(i / (180 / Math.PI));
      const ay = Math.cos(i / (180 / Math.PI));
      this.sin[i] = ax;
      this.cos[i] = ay;
    }
  },
  rayCast(e, map) {
    // Clean map
    for (let x = 0; x < map.length; x++) {
      for (let y = 0; y < map[0].length; y++) {
        map[x][y].visible = false;
      }
    }
    // Mark player
    const pX = e.components.position.current.x;
    const pY = e.components.position.current.y;
    const rX = pX + 0.5;
    const rY = pY + 0.5;
    map[pX][pY].explored = true;
    map[pX][pY].visible = true;
    console.log("0", map[45][31].visible);

    for (let i = 0; i < 360; i += 1) {
      let x = rX; //pX;
      let y = rY; //pY;

      for (let r = 0; r < this.losRadius; r++) {
        x += this.sin[i];
        y += this.cos[i];
        //console.log(x);
        if (x < 0 || x >= map.length || y < 0 || y >= map[0].length) {
          //if (map[Math.floor(x)][Math.floor(y)].terrain === "wall") {
          //console.log(Math.floor(x), Math.floor(y));
          //map[Math.floor(x)][Math.floor(y)].visible === false;
          //}
          break;
        }
        const roundedX = Math.floor(x); // vs Math.round ?
        const roundedY = Math.floor(y); // vs Math.round ?
        map[roundedX][roundedY].explored = true;
        map[roundedX][roundedY].visible = true;
        if (map[roundedX][roundedY].blockLOS) {
          // COMMENT THIS FOR WATCH ALL THE MAP       
          //break;
        }
      }
    }
    console.log("1", map[45][31].visible);
    return map;
  }
};

