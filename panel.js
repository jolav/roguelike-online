/* */

console.log('Loading.....panel.js');

import { r } from "./run.js";
import { es } from "./entity.js";

let player;

function update() {
  player = r.entities[0];
  panel.currentTime();
  panel.pjPos();
  panel.stats();
  panel.inventory();
  panel.loot();
  panel.history();
  if (player.targets.who !== -1 && player.targets.foes.length > 0) {
    panel.selected();
  }
}

const panel = {
  pjPos: function () {
    document.getElementById("pjX").innerHTML = player.pos.x;
    document.getElementById("pjY").innerHTML = player.pos.y;
  },
  currentTime: function () {
    let aa = r.date.toDateString().slice(4);
    let bb = r.date.toTimeString().split(" ")[0];
    document.getElementById("date").innerHTML = aa;
    document.getElementById("time").innerHTML = bb;
  },
  stats: function () {
    const health = player.combat.hp + "/" + player.combat.maxHp;
    document.getElementById("hp").innerHTML = health;
    document.getElementById("melee").innerHTML = player.combat.melee;
    document.getElementById("range").innerHTML = player.combat.range;
    document.getElementById("defence").innerHTML = player.combat.defence;
  },
  inventory: function name() {
    const i = player.inventory;
    const e = player.equipment;
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
  selected: function () {
    let text = "(F)ire: ";
    if (player.targets.who !== -1) {
      const t = player.targets.foes[player.targets.who].type;
      //console.log(t);
      text += t;
    }
    document.getElementById("target").innerHTML = text;
  },
  loot: function () {
    let items = es.atPoint(player.pos.x, player.pos.y);
    items.shift(); // remove player
    for (let i = 0; i < 9; i++) {  //clean panel
      document.getElementById("l" + i).innerHTML = "";
    }
    if (items.length < 1) { // clean panel
      return;
    }
    for (let i = 0; i < items.length; i++) {
      let text = "(q)" + items[i].type;
      //console.log(JSON.stringify(items[i], null, 2));
      /*if (items[i].type.includes("corpse of")) {
        text = "(e)" + text;
      } else*/ if (items[i].is.consumable) {
        text += " " + items[i].data.qty;
      } else if (items[i].is.equippable) {
        //console.log(JSON.stringify(items[i], null, 2));
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
    let last = r.history.length - 1;
    for (let line = last; line > last - 9; line--) {
      document.getElementById("h" + index).innerHTML = r.history[line];
      index++;
    }
  },
};

export {
  update,
};
