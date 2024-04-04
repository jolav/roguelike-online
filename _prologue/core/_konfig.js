/* */

console.log('Loading...../core/_konfig.js');

const K = {
  VERSION: "0.0.6a",
  TRIES: 50000,
  SURNAME_TXT: "./../assets/surname.txt",
  TOKEN_LENGTH: 50,
  // Options
  TYPE_OF_MAP: 1, // 0 => TESTROOM , 1 => SHELTER
  // Render
  CAM_COLS: undefined,
  CAM_ROWS: undefined,
  // Map
  MAX_ROOMS: 500,
  MIN_SIZE_ROOM: 4,
  MAX_SIZE_ROOM: 16,
  MIN_LENGTH_CORRIDOR: 5,
  MAX_LENGTH_CORRIDOR: 20,
  CORRIDOR_ODDS: 0,
  MAP_COLS: 116,//39, 48
  MAP_ROWS: 72,//24, 32
  TESTROOM_COLUMNS: 50,
  // Fov
  FOV_PJ_RANGE: 15,
  FOV_TYPE: 2,// 0 = line, 1 = walkGrid, 2 = supercoverLine

};

export {
  K,
};
