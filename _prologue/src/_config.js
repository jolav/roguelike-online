/* */

console.log('Loading..... config.js');

const c = {
  NICK: undefined,
  LAG: undefined,
  TPT: undefined, // turn processing time
  VERSION: undefined,
  SURNAME_TXT: "./assets/surname.txt",
  // Render
  RENDER_TYPE: 0, // 0 = ASCII  1 = UNICODE
  // canvas
  CANVAS_NAME: "canvas",
  FONTS: ["sans-serif", "arial", "IBM"],
  FONT_SELECTED: 2,
  PPP_X: 20,
  PPP_Y: 20,
  FPS: 60,
  // view
  VIEW_COLS: undefined,
  VIEW_ROWS: undefined,
  VIEW_DELTA_X: undefined,
  VIEW_DELTA_Y: undefined,
  PANEL_WIDTH: 300,
  VERTICAL_SAFETY_DISTANCE: 10,
  // Game
  IS_SERVER_TURN: false,
  INIT_DATE: new Date("2097-08-29 02:14:00"),
  MS_PER_TURN: 1000 * 20,
};

(function autoUpdateView() {
  const view_pixels_X = window.innerWidth - c.PANEL_WIDTH;
  const view_pixels_Y = window.innerHeight - c.VERTICAL_SAFETY_DISTANCE;
  c.VIEW_COLS = Math.floor(view_pixels_X / c.PPP_X);
  c.VIEW_ROWS = Math.floor(view_pixels_Y / c.PPP_Y);
  c.VIEW_DELTA_X = Math.floor((view_pixels_X - (c.VIEW_COLS * c.PPP_X)) / 2);
  c.VIEW_DELTA_Y = Math.floor((view_pixels_Y - (c.VIEW_ROWS * c.PPP_Y)) / 2);
})();

const aux = {
  randomNick: async function () {
    let nick = this.simpleNick(5, 2);
    const resp = await fetch(c.SURNAME_TXT);
    if (!resp.ok) {
      return nick;
    }
    const txt = await resp.text();
    const lines = txt.split("\n");
    nick = lines[this.randomInt(0, lines.length - 1)];
    return nick;
  },
  simpleNick: function (nameLength, numbersLength) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const nums = "0123456789";
    let nick = "";
    for (let i = 0; i < nameLength; i++) {
      nick += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    nick += "-";
    for (let i = 0; i < numbersLength; i++) {
      nick += nums.charAt(Math.floor(Math.random() * nums.length));
    }
    return nick;
  },
  randomInt: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
  newPoint: function (x, y) {
    return {
      x: x,
      y: y,
    };
  },
  currentDate: function (turn) {
    return new Date(c.INIT_DATE.getTime() + c.MS_PER_TURN * turn);
  },
};

export {
  c,
  aux,
};
