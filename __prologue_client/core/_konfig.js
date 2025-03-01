/* */

console.log('Loading..... core/_konfig.js');

const K = {
  "mode": "prod",
  "TICK": 250,
  "TRIES": 5000,
  // Level
  "MAX_ROOMS": 500,
  "MIN_SIZE_ROOM": 4,
  "MAX_SIZE_ROOM": 16,
  "MIN_LENGTH_CORRIDOR": 5,
  "MAX_LENGTH_CORRIDOR": 20,
  "CORRIDOR_ODDS": 0,
  "MAP_COLS": 96,//39, 48
  "MAP_ROWS": 54,//24, 32
  "TESTROOM_COLUMNS": 0,
};

(function autoUpdate() {
  const where = window.location.hostname;
  if (where === "localhost" || where === "127.0.0.1") {
    K.mode = "dev";
  }
})();

export {
  K
};
