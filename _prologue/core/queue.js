/* */

console.log('Loading...../core/queue.js');

import { r } from "./run.js";
import { utils as u } from "./utils.js";

class W {
  constructor(wait, id) {
    this.wait = wait;
    this.id = id;
  }
}

const queue = {
  list: [],
  create: function () {
    this.add(100, -1); // add Turn
    for (let e of r.entities) {
      if (e.id === 0) {
        this.add(0, 0); // add Player
        continue;
      }
      if (e.is.mobile) {
        this.add(u.randomInt(95, 105), e.id);
      }
    }
  },
  sort: function () {
    this.list.sort(function (a, b) {
      return a.wait - b.wait;
    });
  },
  remove: function (id) {
    for (let i = 0; i < this.list.length; i++) {
      if (this.list[i].id === id) {
        this.list.splice(i, 1);
        break;
      }
    }
  },
  add: function (wait, id) {
    this.list.push(new W(wait, id));
    this.sort();
  },
  update: function (wait, id) {
    this.list.push(new W(wait + this.list[0].wait, id));
    this.list.shift();
    this.sort();
  },
  newTurn: function (base) {
    //console.log('NEW TURN FUNCTION');
    //console.log(JSON.stringify(queue.list));
    this.list.shift();
    for (let i = 0; i < this.list.length; i++) {
      this.list[i].wait -= base;
    }
    this.add(100, -1); // add turn
    this.sort();
    //console.log(JSON.stringify(queue.list));

  },
  show: function () {
    for (let w of this.list) {
      console.log(w.wait, " --> ", w.id, "\n");
    }
  }
};

export {
  queue,
};
