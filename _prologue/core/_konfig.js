/* */

console.log('Loading...../core/_konfig.js');

const K = {
  VERSION: "0.0.4",
  // Options
  TYPE_OF_MAP: 0, // 0 => TESTROOM , 1 => SHELTER
  // Render
  CAM_COLS: undefined,
  CAM_ROWS: undefined,
  MAP_COLS: 8,//48,
  MAP_ROWS: 42//32,

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
};

export {
  K,
  lib,
};
