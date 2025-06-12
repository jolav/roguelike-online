/* */

console.log('Loading..... client/panel.js');

import { config as c } from "./_config.js";
import { g } from "./game.js";
import { dawnBringer as col } from "./render_ascii.js";
import { aux } from "./aux.js";

function update() {
  panel.currentTime();
  panel.pjStats();
  //panel.history();
}

function lags() {
  panel.version();
}

const panel = {
  version: function () {
    document.getElementById("versionPanel").textContent = c.VERSION;
    document.getElementById("versionPanel").style.color = col.get("Tahiti Gold");
    document.getElementById("cpuTime").textContent = g.lag.cpu;
    document.getElementById("cpuTime").style.color = col.get("Tahiti Gold");
    document.getElementById("renderTime").textContent = g.lag.render;
    document.getElementById("renderTime").style.color = col.get("Tahiti Gold");

  },
  currentTime: function () {
    let aa = aux.currentDate(g.turn).toDateString().slice(4);
    let bb = aux.currentDate(g.turn).toTimeString().split(" ")[0];
    document.getElementById("date").textContent = aa;
    document.getElementById("time").textContent = bb;
  },
  pjStats: function () {
    document.getElementById("nick2").textContent = g.info.NICK;
    document.getElementById("nick2").style.color = col.get("Tahiti Gold");
  }

};

export {
  update,
  lags,
};
