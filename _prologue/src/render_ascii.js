/* */

console.log('Loading..... render_ascii.js');

import { c } from "./_config.js";
import { t } from "./ask.js";

const canvas = document.getElementById(c.CANVAS_NAME);
canvas.width = c.VIEW_COLS * c.PPP_X;
canvas.height = c.VIEW_ROWS * c.PPP_Y;
const ctx = canvas.getContext("2d");
ctx.font = c.PPP_X + "px " + c.FONTS[c.FONT_SELECTED];
ctx.textBaseline = "middle"; //"top";
ctx.textAlign = "center";

function ascii() {
  draw.clearAll();
  draw.grid();
  draw.info();
  draw.player();
}

const draw = {
  clearAll: function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
  },
  grid: function () {
    for (var x = 0; x < canvas.width; x += c.PPP_X) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
    }
    for (var y = 0; y < canvas.height; y += c.PPP_Y) {
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
    }
    ctx.strokeStyle = "#323535";
    ctx.stroke();
  },
  info: function () {
    ctx.fillStyle = "darkolivegreen";
    ctx.font = "bold 1em " + c.FONTS[c.FONT_SELECTED];
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    ctx.fillText(c.NICK, c.PPP_X, c.PPP_Y);
    ctx.textAlign = "right";
    let text = "v." + c.VERSION + "   ";
    text += "ping_" + c.LAG + "(process_" + c.TPT + ")";
    ctx.fillText(text, canvas.width - c.PPP_X, c.PPP_Y);
    // recover default values 
    ctx.textBaseline = "middle"; //"top";
    ctx.textAlign = "center";
  },
  player: function () {
    const x = t.entities[0].components.position.x;
    const y = t.entities[0].components.position.y;
    ctx.font = c.PPP_X + "px " + c.FONTS[c.FONT_SELECTED];
    ctx.fillStyle = "darkorange";
    ctx.fillText("@",
      (x * c.PPP_X) + (c.PPP_X / 2),
      (y * c.PPP_Y) + (c.PPP_Y / 2)
      //c.PPP_X); // Fourth Argument max width to render the string.
    );
  },
};

export {
  ascii,
};

