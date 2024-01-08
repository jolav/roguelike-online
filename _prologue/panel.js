/* */

console.log('Loading.....panel.js');

import { C, lib } from "./_config.js";
import { t } from "./ask.js";

function update() {
  pj = t.pj;
  panel.version();
  panel.currentTime();
  panel.stats();
  //panel.inventory();
  //panel.loot();
  panel.history();
}

let pj;

const panel = {
  version: function () {
    document.getElementById("versionPanel").innerHTML = C.VERSION;
    document.getElementById("versionPanel").style.color = "#2cc0b4";
  },
  currentTime: function () {
    let aa = lib.currentDate(t.turn).toDateString().slice(4);
    let bb = lib.currentDate(t.turn).toTimeString().split(" ")[0];
    document.getElementById("date").innerHTML = aa;
    document.getElementById("time").innerHTML = bb;
  },
  stats: function () {
    const coords = pj.pos.x + "," + pj.pos.y;
    document.getElementById("coords").innerHTML = coords;
    document.getElementById("hp").innerHTML = pj.combat.hp;
    document.getElementById("maxHp").innerHTML = pj.combat.maxHp;
    if (pj.combat.hp < pj.combat.maxHp) {
      document.getElementById("hp").style.color = "#c02c38";
    } else {
      document.getElementById("hp").style.color = "#38c02c";
    }
    document.getElementById("melee").innerHTML = pj.combat.melee;
    document.getElementById("range").innerHTML = pj.combat.range;
    document.getElementById("defence").innerHTML = pj.combat.defence;
  },
  history: function () {
    let index = 1;
    let last = t.history.length - 1;
    for (let line = last; line > last - 9; line--) {
      const begin = t.history[line].slice(0, 1);
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
      text.innerHTML = t.history[line];
      index++;
    }
  },
};

export {
  update,
};

