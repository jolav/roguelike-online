
const c = {
  VERSION: 0,
  LAG: 0,
  // Api
  API_URL: "https://p.roguelike.online",
  PING_ENDPOINT: "/ping",
  ACTION_ENDPOINT: "/action",
  NEW_GAME_ENDPOINT: "/new",
  PROTOTYPE_URL: "https://jolav.github.io/betazone/roguelike/index.html",
  // Render
  RENDER_TYPE: 0, // 0 = ASCII
  CANVAS_NAME: "canvas",
  PPP: 16,
  FONT: ["sans-serif", "IBM"],
  // Camera dimensions
  CAM_PIXELS_X: window.innerWidth - 300,
  CAM_PIXELS_Y: window.innerHeight - 15,
  CAM_COLS: undefined,
  CAM_ROWS: undefined,
  CAM_DELTA_X: undefined,
  CAM_DELTA_Y: undefined,
  // Game
  INIT_DATE: undefined,
};

(function autoUpdateC() {
  c.CAM_COLS = Math.floor(c.CAM_PIXELS_X / c.PPP);
  c.CAM_ROWS = Math.floor(c.CAM_PIXELS_Y / c.PPP);
  c.CAM_DELTA_X = Math.floor((c.CAM_PIXELS_X - (c.CAM_COLS * c.PPP)) / 2);
  c.CAM_DELTA_Y = Math.floor((c.CAM_PIXELS_Y - (c.CAM_ROWS * c.PPP)) / 2);
})();

const lib = {
  prettyPrint: function (d) {
    console.log(JSON.stringify(d, null, 2));
  },
};

export {
  c,
  lib,
};
