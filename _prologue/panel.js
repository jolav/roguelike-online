/* */

console.log('Loading.....panel.js');

import { c, lib } from "./_config.js";
import { t } from "./http.js";

function update() {
  panel.version();
  panel.stats();
  panel.currentTime();
  panel.history();
}

const panel = {
  version: function () {
    document.getElementById("versionPanel").innerHTML = c.VERSION;
    document.getElementById("versionPanel").style.color = "#2cc0b4";
    document.getElementById("ping2").innerHTML = c.LAG + "_" + c.LAG2;
  },
  stats: function () {
    document.getElementById("nick").innerHTML = t.nick;
    const pj = t.entities[0];
    const coords = pj.pos.x + "," + pj.pos.y;
    document.getElementById("coords").innerHTML = coords;
    document.getElementById("hp").innerHTML = pj.combat.hp;
    document.getElementById("maxHp").style.color = "#38c02c";
    document.getElementById("maxHp").innerHTML = pj.combat.maxHp;
    if (pj.combat.hp < pj.combat.maxHp) {
      //document.getElementById("hp").style.color = "#c02c38";
    } else {
      document.getElementById("hp").style.color = "#38c02c";
    }
    document.getElementById("melee").innerHTML = pj.combat.melee;
    document.getElementById("range").innerHTML = pj.combat.range;
    document.getElementById("defence").innerHTML = pj.combat.defence;
  },
  currentTime: function () {
    let aa = lib.currentDate(t.turn).toDateString().slice(4);
    let bb = lib.currentDate(t.turn).toTimeString().split(" ")[0];
    document.getElementById("date").innerHTML = aa;
    document.getElementById("time").innerHTML = bb;
  },
  history: function () {
    let index = 1;
    let last = c.HISTORY.length - 1;
    for (let line = last; line > last - c.HISTORY_LINES; line--) {
      const begin = c.HISTORY[line].slice(0, 1);
      const text = document.getElementById("h" + index);
      switch (begin) {
        case "+":
          text.style.color = "#38c02c"; // green
          break;
        case "-":
          text.style.color = "#c02c38"; // red
          break;
        default:
          text.style.color = "#fff";
      }
      text.innerHTML = c.HISTORY[line];
      index++;
    }
  },
};

export {
  update
};
