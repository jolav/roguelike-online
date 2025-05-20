/* */

console.log('Loading..... panel.js');

import { config as c } from "./_config.js";
import { g } from "./game.js";
import { dawnBringer as col } from "./render_ascii.js";
import { aux } from "./aux.js";

function update() {
  panel.currentTime();
  //panel.pjStats();
  //panel.history();
}

function lags() {
  panel.version();
}

const panel = {
  version: function () {
    document.getElementById("versionPanel").innerHTML = c.VERSION;
    document.getElementById("versionPanel").style.color = col.get("Tahiti Gold");
    document.getElementById("cpuTime").innerHTML = g.cpuTime;
    document.getElementById("cpuTime").style.color = col.get("Tahiti Gold");
    document.getElementById("renderTime").innerHTML = g.renderTime;
    document.getElementById("renderTime").style.color = col.get("Tahiti Gold");

  },
  currentTime: function () {
    let aa = aux.currentDate(g.turn).toDateString().slice(4);
    let bb = aux.currentDate(g.turn).toTimeString().split(" ")[0];
    document.getElementById("date").innerHTML = aa;
    document.getElementById("time").innerHTML = bb;
  },

};

export {
  update,
  lags,
};
