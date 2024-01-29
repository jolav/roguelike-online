/* */

console.log('Loading.....render_ascii.js');

import { c } from "./_config.js";
import * as panel from "./panel.js";
import { t } from "./http.js";

const canvas = document.getElementById(c.CANVAS_NAME);
canvas.width = (c.CAM_COLS * c.PPP) + (2 * c.CAM_DELTA_X);
canvas.height = (c.CAM_ROWS * c.PPP) + (2 * c.CAM_DELTA_Y);
const pH = c.CAM_DELTA_X;
const pV = c.CAM_DELTA_Y;
const ctx = canvas.getContext("2d");
ctx.textBaseline = "top";
ctx.textAlign = "center";
ctx.font = c.PPP + "px " + c.FONT[1];

function ascii() {
  draw.clearAll();
  draw.grid();
  draw.player();
  panel.update();
}

const draw = {
  clearAll: function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
  },
  clearTile: function (x, y) {
    ctx.clearRect(x * c.PPP, y * c.PPP + pV, c.PPP, c.PPP);
    ctx.beginPath();
  },
  player: function () {
    const x = t.pj.pos.now.x; //- t.cam.x;
    const y = t.pj.pos.now.y; //- t.cam.y;
    //this.clearTile(x, y);
    ctx.fillStyle = "orange";
    ctx.fillText("@", (x * c.PPP) + (c.PPP / 2) + pH, (y * c.PPP) + pV,
      c.PPP); // Fourth Argument max width to render the string.
  },
  grid: function () {
    const pH = c.CAM_DELTA_X; // padding vertical
    const pV = c.CAM_DELTA_Y; // padding horizontal
    for (var x = pH; x <= canvas.width - pH; x += c.PPP) {
      ctx.moveTo(x, pV);
      ctx.lineTo(x, canvas.height - pV);
    }
    for (var y = pV; y <= canvas.height - pV; y += c.PPP) {
      ctx.moveTo(pH, y);
      ctx.lineTo(canvas.width - pH, y);
    }
    ctx.strokeStyle = "#3e4547";
    ctx.stroke();
  },
};

export {
  ascii
};
