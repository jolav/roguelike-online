/* */

console.log('Loading...../core/_konfig.js');

const K = {
  VERSION: "0.0.5",
  // Options
  TYPE_OF_MAP: 0, // 0 => TESTROOM , 1 => SHELTER
  // Render
  CAM_COLS: undefined,
  CAM_ROWS: undefined,
  MAP_COLS: 8,//48,
  MAP_ROWS: 42,//32,
  // Player
  LOS_RANGE: 15,

};

const lib = {
  initializeMultiArray: function (cols, rows, value) {
    let array = [];
    for (let i = 0; i < cols; i++) {
      array[i] = [];
      for (let j = 0; j < rows; j++) {
        array[i][j] = value;
      }
    }
    return array;
  },
  euclideanDistance: function (p1, p2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
  },
  diagonalDistance: function (p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.max(Math.abs(dx), Math.abs(dy));
  },
};

export {
  K,
  lib,
};
