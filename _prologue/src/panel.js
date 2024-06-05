/* */

console.log('Loading..... panel.js');

import { c, aux } from "./_config.js";
import { t } from "./ask.js";
import { dawnBringer as col } from "./render_ascii.js";

function update() {
  panel.version();
  panel.currentTime();
  panel.pjStats();
}

const panel = {
  version: function () {
    document.getElementById("versionPanel").innerHTML = c.VERSION;
    document.getElementById("versionPanel").style.color = col.get("Tahiti Gold");

    document.getElementById("ping").innerHTML = c.LAG + "_" + c.TPT;
  },
  currentTime: function () {
    let aa = aux.currentDate(t.turn).toDateString().slice(4);
    let bb = aux.currentDate(t.turn).toTimeString().split(" ")[0];
    document.getElementById("date").innerHTML = " --- " + aa;// " turn-> " + t.turn;//aa;
    document.getElementById("time").innerHTML = bb;
  },
  pjStats: function () {
    const pj = t.entities[t.pID];
    document.getElementById("nick2").style.color = col.get("Tahiti Gold");
    document.getElementById("nick2").innerHTML = c.NICK;
    const pos = pj.components.position.current;
    const coords = pos.x + "," + pos.y;
    document.getElementById("coords").innerHTML = coords;
    document.getElementById("hp").innerHTML = 20;// pj.combat.hp;
    document.getElementById("maxHp").style.color = col.get("Elf Green");
    document.getElementById("maxHp").innerHTML = 20;// pj.combat.maxHp;
    document.getElementById("bar").innerHTML = lifeBar(20, 20);
    document.getElementById("bar").style.color = col.get("Elf Green");
    /*if (pj.combat.hp < pj.combat.maxHp) {
      //document.getElementById("hp").style.color = "#c02c38";
    } else {
      document.getElementById("hp").style.color = col.get("Christi");
    }*/
    //document.getElementById("melee").innerHTML = 0; //pj.combat.melee;
    //document.getElementById("range").innerHTML = 0; //pj.combat.range;
    //document.getElementById("defence").innerHTML = 0;// pj.combat.defence;
  },
};

export {
  update,
};

function lifeBar(life, maxlife) {
  let chars = Math.round(life / (maxlife / 20));
  if (chars === 0 && life > 0) chars = 1;
  let bar = "";
  for (let i = 0; i < chars; i++) {
    bar += "\u2550";
  }
  return bar;
}
