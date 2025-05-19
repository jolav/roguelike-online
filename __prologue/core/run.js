/* */

console.log('Loading..... ./core/run.js');

import { aux } from "./lib/aux.js";
import { K } from "./_konfig.js";
import { Random } from "./lib/random.js";

class Run {
  constructor(params) {
    let seed = 123456789;
    if (K.mode !== "dev") {
      seed = performance.now();
    }
    this.info = {
      NICK: params.nick || "Anonymous",
      ID: aux.GenerateUUID(),
      SEED: seed,
    };
    this.counter = 0;
    this.turn = 0;
    this.lastTurn = Date.now();
    this.view = {
      cols: params.cols,
      rows: params.rows,
    };
    this.rnd = new Random(this.info.SEED);
    this.map = [];
    this.entities = [];
    this.actions = [];
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
