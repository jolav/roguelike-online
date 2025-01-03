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

async function ascii() {
  const start = performance.now();
  document.getElementById("panelVersion").innerHTML = "v" + c.VERSION;
  draw.clearAll();
  draw.grid();
  draw.map();
  draw.entities();
  await draw.actions();
  const perf = performance.now() - start;
  console.log(`${g.info.NICK}, LAG__ ${c.LAG}   Render__ ${perf}`);
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
        //console.log(g.map[col][row].terrain);
        if (g.map[col][row].terrain === "wall") {
          this.tile(col, row, "#", "Heather");
        } else { // this kills performance
          //const char = String.fromCharCode(legend.get("floor"));
          //this.tile(col, row, char, "Smokey Ash");
        }
      }
    }
  },
  entities: function (id) {
    //console.log(g.entities.size + " Entities");
    for (const [_, e] of g.entities) {
      if (e.id === id) {
        continue; //avoid drawing yourself while animating 
      }
      const x = e.components.Position.onMap.x;//current.x;
      const y = e.components.Position.onMap.y;//current.y;
      //const x = e.components.Position.current.x;
      //const y = e.components.Position.current.y;
      const char = e.components.Render.char;
      const color = e.components.Render.color;
      this.tile(x, y, char, color);
    }
  },
  actions: async function () {
    for (const a of g.actions) {
      const e = g.entities.get(a.id);
      const start = e.components.Position.onMap;
      const end = e.components.Position.current;
      //const char = e.components.Render.char;
      //const color = e.components.Render.color;
      //this.tile(x, y, char, color);
      await this.animate(e, start, end, c.RENDER.STEPS);
      e.components.Position.onMap = end;
    }
  },
  animate: function (e, start, end, steps) {
    return new Promise(function (resolve) {
      let step = 0;
      function animateStep() {
        this.clearAll();
        this.grid();
        this.map();
        this.entities(e.id);

        const currentX = start.x + (end.x - start.x) * (step / steps);
        const currentY = start.y + (end.y - start.y) * (step / steps);
        const char = e.components.Render.char;
        const color = e.components.Render.color;
        this.tile(currentX, currentY, char, color);

        step++;
        if (step <= steps) {
          requestAnimationFrame(animateStep.bind(this));
        } else {
          resolve();
        }
      }
      animateStep.call(this);
    }.bind(this));
  },
  tile: function (x, y, char, color) {
    //console.log(x, y, char, color);
    ctx.fillStyle = dawnBringer.get(color);
    ctx.fillText(
      char,
      (x * c.VIEW.PPP_X) + (c.VIEW.PPP_X / 2),
      (y * c.VIEW.PPP_Y) + (c.VIEW.PPP_Y / 2),
      c.VIEW.PPP_X); // Fourth Argument max width to render string.
    //);
  },
};

export {
  ascii,
};

const legend = new Map([
  ["floor", 183],   // middleDot 183 or normal point 46
  ["wall", 35],     // #35
  ["-", 0],
  ["player", 64],   // @64
  ["rat", 114],     // r 114
  ["mole rat", 82], // R 82
  ["corpse of", 37],    // %
  ["item", 63],    // ?
  ["exit", 60], // <
]);

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
