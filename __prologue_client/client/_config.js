/* */

console.log('Loading..... client/_config.js');

const config = {
  MODE: "prod",
  VERSION: "x",
  LAG: 0,
  AUTHORITATIVE_SERVER: false,
  API: {
    AUTOSTART: true,
    HOST: 1,// 0 local dev API, 1 real API
    URL: [
      "http://localhost:3000",
      "https://m.d100.top/p"
    ],
    VERSION: "/version",
    PING: "/ping",
    RUN: "/run",
    TURN: "/turn",
    TIMEOUT: 250,
    PINGER_DELAY: 1000,
    NICK: "https://api.codetabs.com/v1/random/name",
    NICK_TIMEOUT: 2000,
  },
  CANVAS: {
    NAME: "myCanvas",
    FONTS: ["sans-serif", "arial", "IBM", "DejaVu"],
    FONT_SELECTED: 3,
  },
  RENDER: {
    STEPS: 10,
  },
  VIEW: {
    PANEL_WIDTH: 300,
    PPP_X: 8,//16,
    PPP_Y: 12,//24,
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
  //console.log(c.COLS, c.ROWS, c.DELTA_X, c.DELTA_Y);
}());

export {
  config,
};
