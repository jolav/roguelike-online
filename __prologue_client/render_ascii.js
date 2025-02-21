/* */

console.log('Loading..... render_ascii.js');

import { config as c } from "./_config.js";
import { g } from "./game.js";

const canvas = document.getElementById(c.CANVAS.NAME);
canvas.width = c.VIEW.COLS * c.VIEW.PPP_X;
canvas.height = c.VIEW.ROWS * c.VIEW.PPP_Y;
canvas.style.position = 'absolute';
canvas.style.left = c.VIEW.DELTA_X + "px";
canvas.style.top = c.VIEW.DELTA_Y + "px";
const ctx = canvas.getContext("2d");
ctx.font = c.VIEW.PPP_Y + "px " + c.CANVAS.FONTS[c.CANVAS.FONT_SELECTED];
ctx.textBaseline = "middle";//"middle"; //"top";
ctx.textAlign = "center";

function ascii() {
  const start = performance.now();
  document.getElementById("panelVersion").innerHTML = "v" + c.VERSION;
  //draw.grid();
  draw.map();
  console.log("Time =>", performance.now() - start, "ms");
}

const draw = {
  clearAll: function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
  },
  grid: function () {
    for (let x = 0; x < canvas.width; x += c.VIEW.PPP_X) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height - 0);
    }
    for (let y = 0; y < canvas.height; y += c.VIEW.PPP_Y) {
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width - 0, y);
    }
    ctx.strokeStyle = dawnBringer.get("grid"); //"#555555";//"#323535";
    ctx.stroke();
  },
  map: function () {
    //console.log(g.map.length, g.map[0].length);
    //console.log(c.VIEW.COLS, c.VIEW.ROWS);
    for (let col = 0; col < g.map.length; col++) {
      for (let row = 0; row < g.map[0].length; row++) {
        const terrain = g.map[col][row].terrain;
        switch (terrain) {
          case "wall":
            this.tile(col, row, "#", "Heather");
            break;
          default:
            this.tile(col, row, /*'\u03D9'*/".", "Atlantis");
        }
      }
    }
  },
  tile: function (x, y, char, color) {
    //console.log(x, y, char, color);
    ctx.fillStyle = dawnBringer.get(color);
    ctx.fillText(
      char,
      (x * c.VIEW.PPP_X) + (c.VIEW.PPP_X / 2),
      (y * c.VIEW.PPP_Y) + (c.VIEW.PPP_Y / 2),
      //c.VIEW.PPP_X); // Fourth Argument max width to render the string.
    );
  },
};

export {
  ascii,
};

const dawnBringer = new Map([
  ["Black", "#000000"],
  ["Valhalla", "#222034"],
  ["Loulou", "#45283C"],
  ["Oiled Cedar", "#663931"],
  ["Rope", "#8F563B"],
  ["Tahiti Gold", "#DF7126"],
  ["Twine", "#D9A066"],
  ["Pancho", "#EEC39A"],
  ["Golden Fizz", "#FBF236"],
  ["Atlantis", "#99E550"],
  ["Christi", "#6ABE30"],
  ["Elf Green", "#37946E"],
  ["Dell", "#4B692F"],
  ["Verdigris", "#524B24"],
  ["Opal", "#323C39"],
  ["Deep Koamaru", "#3F3F74"],
  ["Venice Blue", "#306082"],
  ["Royal Blue", "#5B6EE1"],
  ["Cornflower", "#639BFF"],
  ["Viking", "#5FCDE4"],
  ["Light Steel Blue", "#CBDBFC"],
  ["White", "#FFFFFF"],
  ["Heather", "#9BADB7"],
  ["Topaz", "#847E87"],
  ["Dim Gray", "#696A6A"],
  ["Smokey Ash", "#595652"],
  ["Clairvoyant", "#76428A"],
  ["Brown", "#AC3232"],
  ["Mandy", "#D95763"],
  ["Plum", "#D77BBA"],
  ["Rainforest", "#8F974A"],
  ["Stinger", "#8A6F30"],
  ["grid", "#27292d"],
]);
