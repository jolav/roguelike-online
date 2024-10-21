/* */

console.log('Loading..... config.js');

const config = {
  MODE: "production",
  VERSION: "x",
  LAG: 0,
  API: {
    used: 1,// 0 real API, 1 local dev API
    url: [
      "https://m.d100.top/p",
      "http://localhost:3000"
    ],
    version: "/version/v1",
    ping: "/ping",
    run: "/run",
    turn: "/turn",
  },
  NICK_API: "https://m.d100.top/a/random/name",
  PINGER_DELAY: 500,
  CANVAS: {
    NAME: "myCanvas",
    FONTS: ["sans-serif", "arial", "IBM"],
    FONT_SELECTED: 2,
  },
  VIEW: {
    PANEL_WIDTH: 300,
    PPP_X: 16,
    PPP_Y: 24,
    COLS: 0,
    ROWS: 0,
    DELTA_X: 0,
    DELTA_Y: 0,
  }
};

(function calculatePlayingArea() {
  const c = config.VIEW;
  const w = window.innerWidth - c.PANEL_WIDTH;
  const h = window.innerHeight;
  c.COLS = Math.floor(w / c.PPP_X) - 1;
  c.ROWS = Math.floor(h / c.PPP_Y) - 1;
  c.DELTA_X = Math.floor((w - (c.COLS * c.PPP_X)) / 2);
  c.DELTA_Y = Math.floor((h - (c.ROWS * c.PPP_Y)) / 2);
  console.log(c.COLS, c.ROWS, c.DELTA_X, c.DELTA_Y);
}());

export {
  config,
};
