/* */

console.log('Loading..... core/run.js');

import { K } from "./_konfig.js";
import { Random } from "./lib/random.js";
import { mapGen } from "./map/gen/gen.js";

class Run {
  constructor(params) {
    this.info = {
      NICK: params.nick || "Anonymous",
      ID: Random.generateUUID(),
      SEED: Random.generateSeed(),
    };
    if (K.MODE === "dev") {
      this.info.SEED = 1234567890;
    }
    this.counter = 0;
    this.turn = 0;
    this.lastTurn = Date.now();
    this.view = {
      cols: params.cols,
      rows: params.rows,
    };
    console.log(this.info);
    this.rnd = new Random(this.info.SEED);
    this.map = mapGen("basicRoom", this.view, this.rnd);
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
