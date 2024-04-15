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
  melee: function (e, damage, t) {
    const h = "+ " + e.type + " deals " + damage + " damage to " + t.type + "\n";
    r.history.push(h);
  }
};

export {
  create,
  history
};

const historyPreSet =
  ["14",
    "13",
    "12",
    "11",
    "10",
    "9",
    "8",
    "7",
    "6",
    "5",
    "4",
    "3",
    "2",
    "1",
    "Adventure begins..."];
