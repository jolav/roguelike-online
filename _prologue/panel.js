/* */

console.log('Loading.....panel.js');

import { C, lib } from "./_config.js";
import { t } from "./ask.js";

function update() {
  pj = t.pj;
  panel.version();
  panel.currentTime();
  panel.stats();
  panel.inventory();
  panel.loot();
  panel.history();
  panel.selected();
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
  inventory: function () {
    const i = pj.inventory;
    const e = pj.equipment;
    document.getElementById("i-food").innerHTML = i.food;
    document.getElementById("i-supply").innerHTML = i.supply;
    document.getElementById("i-medical").innerHTML = i.medical;
    let text = "unarmed";
    if (e.melee !== undefined) {
      text = e.melee.data.name;
    }
    document.getElementById("i-melee").innerHTML = text;
    text = "-";
    if (e.range !== undefined) {
      text = e.range.data.name + "(F)";
    }
    document.getElementById("i-range").innerHTML = text;
    text = "-";
    if (e.body !== undefined) {
      text = e.body.data.name;
    }
    document.getElementById("i-body").innerHTML = text;
    document.getElementById("i-head").innerHTML = "-";
  },
  loot: function () {
    for (let i = 0; i < 9; i++) {  //clean panel
      document.getElementById("l" + i).innerHTML = "";
    }
    const corpses = lib.atPoint(pj.pos, t.npcs);
    let line = 0;
    for (let i = 0; i < corpses.length; i++) {
      let text = corpses[i].type;
      document.getElementById("l" + line).innerHTML = text;
      line++;
    }
    const items = lib.atPoint(pj.pos, t.items);
    if (items.length < 1) { // clean panel
      return;
    }
    for (let i = 0; i < items.length; i++) {
      let text = "(q)" + items[i].type;
      if (items[i].is.consumable) {
        text += " " + items[i].data.qty;
      } else if (items[i].is.equippable) {
        if (items[i].type === "melee") {
          text += " " + items[i].data.melee;
        } else if (items[i].type === "firearm") {
          text += " " + items[i].data.range;
        } else if (items[i].type === "body") {
          text += " " + items[i].data.defence;
        }
      }
      if (items[i].is.equipped) {
        text = "";
      }
      document.getElementById("l" + line).innerHTML = text;
      line++;
    }
  },
  selected: function () {
    let text = "(F)ire: ";
    if (C.INDEX_SELECTED !== undefined) {
      text += C.NPC_SELECTED.type;
    }
    document.getElementById("target").innerHTML = text;
  },
};

export {
  update,
};

