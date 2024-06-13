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
    //console.log(pj);
    // name
    document.getElementById("nick2").style.color = col.get("Tahiti Gold");
    document.getElementById("nick2").innerHTML = c.NICK;
    // position
    const pos = pj.components.position.current;
    const coords = pos.x + "," + pos.y;
    document.getElementById("coords").innerHTML = coords;
    // stats
    const stats = pj.components.stats;
    document.getElementById("level").innerHTML = stats.xp.level;
    document.getElementById("xp").innerHTML = stats.xp.qty;
    document.getElementById("s-end").innerHTML = showSymbol(stats.end);
    document.getElementById("s-agi").innerHTML = showSymbol(stats.agi);
    document.getElementById("s-per").innerHTML = showSymbol(stats.per);
    document.getElementById("s-int").innerHTML = showSymbol(stats.int);
    document.getElementById("s-wil").innerHTML = showSymbol(stats.wil);
    // health
    const health = pj.components.health;
    document.getElementById("hp").innerHTML = health.real;
    document.getElementById("maxHp").style.color = col.get("Elf Green");
    document.getElementById("maxHp").innerHTML = health.max;
    document.getElementById("bar").innerHTML = lifeBar(health.real, health.max);
    document.getElementById("bar").style.color = col.get("Elf Green");
    // defense
    document.getElementById("ar").innerHTML = stats.combat.ar;
    document.getElementById("er").innerHTML = stats.combat.er;
    // weapons
    const base = pj.components.melee.base;
    const wp = pj.components.melee.slots[0];
    document.getElementById("m1-weapon").innerHTML = wp.type.toUpperCase();
    const totalToHit = base.toHit + wp.toHit; //+ stats.agi;
    document.getElementById("m1-toHit").innerHTML = showSymbol(totalToHit);
    document.getElementById("m1-ap").innerHTML = wp.ap + stats.end;
    document.getElementById("m1-dmg").innerHTML = wp.dmg;

  },
};

export {
  update,
};

function lifeBar(life, maxlife) {
  const maxSpaces = 25;
  let chars = Math.round(life / (maxlife / maxSpaces));
  if (chars === 0 && life > 0) chars = 1;
  let bar = "";
  for (let i = 0; i < maxSpaces; i++) {
    if (i < chars) {
      bar += "\u00bb"; //"\u2592";
    } else {
      bar += " ";
    }
  }
  return bar;
}

function showSymbol(value) {
  if (value > 0) {
    return "+" + value;
  }
  return value;
}
