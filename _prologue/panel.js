/* */

console.log('Loading.....panel.js');

import { c, lib } from "./_config.js";
import { t } from "./http.js";
import { dawnBringer as col } from "./render_ascii.js";

function update() {
  panel.version();
  panel.stats();
  panel.currentTime();
  panel.inventory();
  panel.loot();
  panel.history();
  panel.selected();
}

const panel = {
  version: function () {
    document.getElementById("versionPanel").innerHTML = c.VERSION;
    document.getElementById("versionPanel").style.color = col.get("Christi");
    document.getElementById("ping2").innerHTML = c.LAG + "_" + c.LAG2;
  },
  stats: function () {
    document.getElementById("nick").style.color = col.get("Tahiti Gold");
    document.getElementById("nick").innerHTML = t.nick;
    const pj = t.entities[0];
    const coords = pj.pos.x + "," + pj.pos.y;
    document.getElementById("coords").innerHTML = coords;
    document.getElementById("hp").innerHTML = pj.combat.hp;
    document.getElementById("maxHp").style.color = col.get("Christi");
    document.getElementById("maxHp").innerHTML = pj.combat.maxHp;
    if (pj.combat.hp < pj.combat.maxHp) {
      //document.getElementById("hp").style.color = "#c02c38";
    } else {
      document.getElementById("hp").style.color = col.get("Christi");
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
  inventory: function () {
    const pj = t.entities[0];
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
    const pj = t.entities[0];
    let items = lib.atPoint(pj.pos, t.items);
    for (let i = 0; i < c.LOOT_LINES; i++) {  //clean panel
      document.getElementById("l" + i).innerHTML = "";
    }
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
      document.getElementById("l" + i).innerHTML = text;
    }
  },

  history: function () {
    let index = 1;
    let last = c.HISTORY.length - 1;
    for (let line = last; line > last - c.HISTORY_LINES; line--) {
      const begin = c.HISTORY[line].slice(0, 1);
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
      text.innerHTML = c.HISTORY[line].replace("player", c.NICK);
      index++;
    }
  },
  selected: function () {
    let text = "(F)ire: ";
    if (c.INDEX_SELECTED !== undefined) {
      text += c.NPC_SELECTED.type;
    }
    document.getElementById("target").innerHTML = text;
  },
};

export {
  update
};
