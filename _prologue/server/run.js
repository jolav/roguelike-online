/* */

import { Runs } from "./runs.js";
import { aux } from "./a_lib/aux.js";
import { network } from "./a_lib/network.js";
import { generate } from "./mapGen.js";
import { Random } from "./a_lib/random.js";
import { K } from "./_config.js";

class Run {
  constructor(req) {
    let seed = 123456789;
    if (K.mode !== "dev") {
      seed = performance.now();
    }
    this.info = {
      NICK: req.query.nick || "Anonymous",
      ID: aux.GenerateUUID(),
      CREATED: Date.now(),
      IP: network.IP(req),
      SEED: seed,
    };
    this.turn = 0;
    this.lastTurn = Date.now();
    this.view = {
      cols: req.query.cols,
      rows: req.query.rows,
    };
    this.rnd = new Random(this.info.SEED);
    this.map = generate("basicRoom", req.query.cols, req.query.rows, this.rnd);
    this.add();
  }

  add() {
    Runs.set(this.info.ID, this);
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
    r.id = this.info.ID;
    r.seed = this.info.SEED;
    r.map = this.map;
    return r;
  }

  prepareDataTurn() {
    const r = {};
    r.turn = this.turn;
    return r;
  }
}

export {
  Run
};
