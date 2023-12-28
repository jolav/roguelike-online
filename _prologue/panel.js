/* */

console.log('Loading.....panel.js');

import { C, lib } from "./_config.js";
import { t } from "./ask.js";

function update() {
  panel.version();
  panel.currentTime();
  panel.pjPos();
}

const panel = {
  version: function () {
    document.getElementById("versionPanel").innerHTML = C.VERSION;
  },
  currentTime: function () {
    let aa = lib.currentDate(t.turn).toDateString().slice(4);
    let bb = lib.currentDate(t.turn).toTimeString().split(" ")[0];
    document.getElementById("date").innerHTML = aa;
    document.getElementById("time").innerHTML = bb;
  },
  pjPos: function () {
    document.getElementById("pjX").innerHTML = t.pj.pos.x;
    document.getElementById("pjY").innerHTML = t.pj.pos.y;
  },
};

export {
  update,
};

