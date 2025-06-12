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
      VERSION: K.VERSION,
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
    this.rnd = new Random(this.info.SEED);
    this.map = mapGen("basicRoom", this.view, this.rnd);
    this.entities = [];
    this.actions = [];
  }

  prepareDataNew() {
    const data = {};
    data.id = this.info.ID;
    data.seed = this.info.SEED;
    data.map = this.map;
    return data;
  }

  prepareDataTurn() {
    const data = {};
    data.turn = this.turn;
    return data;
  }
}

export {
  Run
};
