/* */

import { Runs } from "./runs.js";

class Run {
  constructor(i) {
    this.info = i;
    this.add();
  }

  add() {
    Runs.set(this.info.id, this);
    //Runs.list();
    Run.list();
  }

  static list() {
    for (const [id, v] of Runs) {
      console.log(id, " -> ", v);
    }
  }

  prepareDataNew() {
    const r = {};
    r.id = this.info.id;
    return r;
  }

  prepareDataTurn() {
    const r = {};
    r.turn = this.info.turn;
    return r;
  }
}

export {
  Run
};
