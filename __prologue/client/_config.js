/* */

console.log('Loading..... client/_config.js');

const config = {
  API: {
    AUTOSTART: false,
    TIMEOUT: 150,
    NICK: "https://api.codetabs.com/v1/random/name",
    NICK_TIMEOUT: 2000,
  },
  CANVAS: {
    NAME: "myCanvas",
    FONTS: ["sans-serif", "arial", "IBM", "DejaVu"],
    FONT_SELECTED: 3,
  },
  RENDER: {
    TYPE: 0, // 0 = ASCII  1 = UNICODE 2 = UNICODE_GLYPHS
    ANIMATION: false,
    STEPS: 1,
  },
  VIEW: {
    PANEL_WIDTH: 300,
    PPP_X: 16,//16,
    PPP_Y: 24,//24,
    COLS: 0,
    ROWS: 0,
    DELTA_X: 0,
    DELTA_Y: 0,
    MAX_COLS: 52, // 52
    MAX_ROWS: 30  // 30
  },
  PANEL: {
    HISTORY_CHARS: 43,
    HISTORY_LINES: 18, //max 20
    INIT_DATE: new Date("2097-08-29 02:14:00"),
    MS_PER_TURN: 1000 * 20,
  }
};

(function calculatePlayingArea() {
  const c = config.VIEW;
  const w = window.innerWidth - c.PANEL_WIDTH;
  const h = window.innerHeight;
  c.COLS = Math.floor(w / c.PPP_X) - 1;
  c.ROWS = Math.floor(h / c.PPP_Y) - 1;
  if (c.COLS > c.MAX_COLS) {
    c.COLS = c.MAX_COLS;
  }
  if (c.ROWS > c.MAX_ROWS) {
    c.ROWS = c.MAX_ROWS;
  }
  c.DELTA_X = Math.floor((w - (c.COLS * c.PPP_X)) / 2);
  c.DELTA_Y = Math.floor((h - (c.ROWS * c.PPP_Y)) / 2);
  //console.log(c.COLS, c.ROWS, c.DELTA_X, c.DELTA_Y);
}());

export {
  config,
};
