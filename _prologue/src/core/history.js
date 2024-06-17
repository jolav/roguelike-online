/* */

console.log('Loading...../core/history.js');

import { r } from "./run.js";

function create() {
  return historyPreSet;
}

const history = {
  eat: function (e, qty) {
    const h = e.type + " eat and heals " + qty + " HP";
    r.history.push(h);
  },
  heal: function (e, qty) {
    const h = e.type + " heals " + qty + " HP";
    r.history.push(h);
  },
  kill: function (e) {
    const h = "-" + e.name + " dies";
    r.history.push(h);
  },
  loot: function (e) {
    const h = r.nick + " loots " + (e.data.qty || "") + " " + e.type;
    r.history.push(h);
  },
  fire: function (e, damage, t) {
    const h = "+ " + e.type + " deals " + damage + " damage to " + t.type + "\n";
    r.history.push(h);
  },
  meleeHit: function (e, t) {
    let aux = "+ ";
    if (e.player) {
      aux = "- ";
    }
    const h = aux + e.tags.type + " misses attacking " + t.tags.type;
    r.history.push(h);
  },
  meleeDmg: function (e, damage, dice, t) {
    let aux = "+ ";
    if (t.player) {
      aux = "- ";
    }
    const h = aux + e.tags.type + " deals (x" + dice + ") "
      + damage + " damage to " + t.tags.type;
    r.history.push(h);
  },
  cantMove: function () {
    const h = "player can't move there";
    r.history.push(h);
  }
};

export {
  create,
  history
};

// max characters per line 45
const historyPreSet =
  [
    "20",
    "19",
    "18",
    "17",
    "16",
    "15",
    "14",
    "13",
    "12",
    "11",
    "10 En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y galgo corredor.",
    "9",
    "8",
    "7",
    "6",
    "5",
    "4",
    "3",
    "2",
    "1",
    "Adventure begins..."
  ];
