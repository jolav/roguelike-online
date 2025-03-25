/* */

console.log('Loading..... panel.js');

import { config as c } from "./_config.js";
import { g } from "./game.js";
import { dawnBringer as col } from "./render_ascii.js";

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
    document.getElementById("versionPanel").innerHTML = c.VERSION;
    document.getElementById("versionPanel").style.color = col.get("Tahiti Gold");
    const lagsData = g.info.lag + "_" + g.info.tpt + "-(" + c.RENDER.TIME + ")";
    document.getElementById("ping2").innerHTML = lagsData;

  },
  currentTime: function () {
    let aa = currentDate(g.turn).toDateString().slice(4);
    let bb = currentDate(g.turn).toTimeString().split(" ")[0];
    document.getElementById("date").innerHTML = aa;
    document.getElementById("time").innerHTML = bb;
  },
  pjStats: function () {
    let pj = {};
    for (let e of g.entities) {
      if (e[1].info.Type === "player") {
        pj = e[1];
      }
    }
    //console.log(pj.pos);
    // name
    document.getElementById("nick2").style.color = col.get("Tahiti Gold");
    document.getElementById("nick2").innerHTML = g.info.nick;
    // position
    const pos = pj.pos.Current;
    const coords = pos.X + "," + pos.Y;
    document.getElementById("coords").innerHTML = coords;
    // stats
    /*const stats = pj.components.stats;
    document.getElementById("level").innerHTML = stats.xp.level;
    document.getElementById("xp").innerHTML = stats.xp.qty + "/1000";
    document.getElementById("s-end").innerHTML = showSymbol(stats.end);
    document.getElementById("s-agi").innerHTML = showSymbol(stats.agi);
    document.getElementById("s-per").innerHTML = showSymbol(stats.per);
    document.getElementById("s-int").innerHTML = showSymbol(stats.int);
    document.getElementById("s-wil").innerHTML = showSymbol(stats.wil);*/
    // health
    const health = pj.health;
    document.getElementById("hp").innerHTML = health.HP;
    document.getElementById("maxHp").style.color = col.get("Elf Green");
    document.getElementById("maxHp").innerHTML = health.Max;
    document.getElementById("bar").innerHTML = lifeBar(health.HP, health.Max);
    document.getElementById("bar").style.color = col.get("Elf Green");
    //document.getElementById("bar").style.backgroundColor = "lightcoral";
    // defense
    /*document.getElementById("ar").innerHTML = stats.combat.ar;
    document.getElementById("er").innerHTML = stats.combat.er;*/
    // weapons
    /*const base = pj.components.melee.base;
    const wp = pj.components.melee.slots[0];
    document.getElementById("m1-weapon").innerHTML = wp.type.toUpperCase();
    const totalToHit = base.toHit + wp.toHit; //+ stats.agi;
    document.getElementById("m1-toHit").innerHTML = showSymbol(totalToHit);
    document.getElementById("m1-ap").innerHTML = wp.ap + stats.end;
    document.getElementById("m1-dmg").innerHTML = wp.dmg;*/
  },
  history: function () {
    let total = 0;
    let index = 1;
    let last = g.history.length - 1;
    for (let line = last; line > last - c.PANEL.HISTORY_LINES; line--) {
      const begin = g.history[line].slice(0, 1);
      const text = document.getElementById("h" + index);
      switch (begin) {
        case "+":
          text.style.color = col.get("Christi"); // green
          break;
        case "-":
          text.style.color = col.get("Mandy"); // red
          break;
        default:
          text.style.color = col.get("Light Steel Blue");
      }
      const solution = g.history[line].replace("player", c.NICK);
      const candidate = insertNewLine(solution, c.PANEL.HISTORY_CHARS);
      if (total + candidate.split("\n").length - 1 > c.PANEL.HISTORY_LINES) {
        break;
      }
      index++;
      text.innerText = candidate;
      total += text.innerText.split("\n").length - 1;
    }
  },
};

export {
  update,
  lags,
};

function lifeBar(life, maxlife) {
  const maxSpaces = 25;
  let chars = Math.round(life / (maxlife / maxSpaces));
  if (chars === 0 && life > 0) chars = 1;
  let bar = "";
  for (let i = 0; i < maxSpaces; i++) {
    if (i < chars) {
      bar += `<span>${"\u00bb"}</span>`;
    } else {
      bar += `<span style="color: red;">${"\u00bb"}</span>`; // "\u2592"
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

function insertNewLine(str, maxLength) {
  let result = '';
  let start = 0;
  while (start < str.length) {
    let end = Math.min(start + maxLength, str.length);

    if (end < str.length && str[end] !== ' ') {
      let lastSpace = str.lastIndexOf(' ', end);
      if (lastSpace > start) {
        end = lastSpace;
      }
    }
    result += str.substring(start, end) + '\n';
    start = end + 1;
  }
  return result;
}

function currentDate(turn) {
  return new Date(c.PANEL.INIT_DATE.getTime() + c.PANEL.MS_PER_TURN * turn);
}
