/* */

import { Runs } from "./runs.js";
import { aux } from "./a_lib/aux.js";
import { network } from "./a_lib/network.js";
import { generate } from "./mapGen.js";

class Run {
  constructor(req) {
    this.info = {
      nick: req.query.nick,
      id: aux.GenerateUUID(),
      created: Date.now(),
      ip: network.IP(req),
      turn: 0,
      lastTurn: Date.now()
    };
    this.view = {
      cols: req.query.cols,
      rows: req.query.rows,
    };
    this.map = generate("basicRoom", req.query.cols, req.query.rows);
    this.add();
  }

  add() {
    Runs.set(this.info.id, this);
    //Runs.list();
    //Run.list();
  }

  static list() {
    for (const [id, v] of Runs) {
      console.log(id, " -> ", v);
    }
  }

  prepareDataNew() {
    const r = {};
    r.id = this.info.id;
    r.map = this.map;
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
