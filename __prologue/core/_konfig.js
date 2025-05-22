/* */

console.log('Loading..... /core/_konfig.js');

const K = {
  MODE: "prod",
  VERSION: "0.3b",
  TRIES: 100,
  // Options
  TYPE_OF_MAP: 0, // 0 => BASICROOM , 1 => SHELTER
  // Render
  VIEW_COLS: undefined,
  VIEW_ROWS: undefined,
  // Map
  MAP_COLS: undefined,//96,46
  MAP_ROWS: undefined,//54,32
  // NPC
  MAX_NPCS: undefined,
  MAX_ITEMS: undefined,
};

(function autoAdjustConf() {
  const where = window.location.hostname;
  if (where === "localhost" || where === "127.0.0.1") {
    K.MODE = "dev";
  }
  console.log('KONFIG');
})();

export {
  K
};
