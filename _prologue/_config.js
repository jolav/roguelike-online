/* */

const c = {
  VERSION: "0",
  LAG: 0,
  NETWORK: 1,  // 0 => simulate, 1 => Real
  // API
  API_BASE_URL: "https://p.roguelike.online",
  PING_ENDPOINT: "/ping",
  TEST_ENDPOINT: "/test", // download webpage, slow
  OK_ENDPOINT: "/ok", // normal ping
  // Render
  RENDER_TYPE: 0, // 0 = ASCII
  CANVAS_NAME: "canvas",
  PPP: 8,
  FONT: ["sans-serif", "IBM"],
  // Camera dimensions
  CAM_PIXELS_X: window.innerWidth - 300,
  CAM_PIXELS_Y: window.innerHeight - 15,
  CAM_COLS: undefined,
  CAM_ROWS: undefined,
  CAM_DELTA_X: undefined,
  CAM_DELTA_Y: undefined,
  VIEW_COLS: undefined,
  VIEW_ROWS: undefined,
  // Game
  NICK: "",
  TOKEN: "",
  INIT_DATE: new Date("2097-08-29 02:14:00"),
  MS_PER_TURN: 1000 * 20,
};

(function autoUpdateC() {
  c.CAM_COLS = Math.floor(c.CAM_PIXELS_X / c.PPP);
  c.CAM_ROWS = Math.floor(c.CAM_PIXELS_Y / c.PPP);
  c.CAM_DELTA_X = Math.floor((c.CAM_PIXELS_X - (c.CAM_COLS * c.PPP)) / 2);
  c.CAM_DELTA_Y = Math.floor((c.CAM_PIXELS_Y - (c.CAM_ROWS * c.PPP)) / 2);
})();

const lib = {
  randomInt: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
  currentDate: function (turn) {
    return new Date(c.INIT_DATE.getTime() + c.MS_PER_TURN * turn);
  },
  realDate: function () {
    const d = new Date();
    let aa = d.toTimeString().split(" ")[0];
    let bb = d.toISOString().split("T")[0];
    return aa + "_" + bb;
  }
};

export {
  c,
  lib,
};
