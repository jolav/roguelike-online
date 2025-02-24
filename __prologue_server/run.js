/* */

import { Runs } from "./runs.js";
import { network } from "./lib/network.js";
import { Random } from "./lib/random.js";
import { generate } from "./mapGen.js";
import { K } from "./_konfig.js";

class Run {
  constructor(req) {
    let seed = 123456789;
    if (K.mode !== "dev") {
      seed = performance.now();
    }
    this.info = {
      NICK: req.query.nick || "Anonymous",
      ID: Random.generateUUID(),
      CREATED: Date.now(),
      IP: network.ip(req),
      SEED: seed,
    };
    this.counter = 0;
    this.turn = 0;
    this.lastTurn = Date.now();
    this.view = {
      cols: req.query.cols,
      rows: req.query.rows,
    };
    this.rnd = new Random(this.info.SEED);
    this.map = generate("basicRoom", req.query.cols, req.query.rows, this.rnd);
    //this.entities = populateRun(this.counter, this.map);//new Map();
    //this.actions = [];
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
    r.ID = this.info.ID;
    r.SEED = this.info.SEED;
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
