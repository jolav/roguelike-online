/* */

console.log('Loading.....panel.js');

import { c, lib } from "./_config.js";
import { t } from "./http.js";

function update() {
  panel.version();
  panel.stats();
  panel.currentTime();
}

const panel = {
  version: function () {
    document.getElementById("versionPanel").innerHTML = c.VERSION;
    document.getElementById("versionPanel").style.color = "#2cc0b4";
    document.getElementById("ping2").innerHTML = c.LAG + "_" + c.LAG2;
  },
  stats: function () {
    document.getElementById("nick").innerHTML = t.nick;
  },
  currentTime: function () {
    let aa = lib.currentDate(t.turn).toDateString().slice(4);
    let bb = lib.currentDate(t.turn).toTimeString().split(" ")[0];
    document.getElementById("date").innerHTML = aa;
    document.getElementById("time").innerHTML = bb;
  },
};

export {
  update
};
