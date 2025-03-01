/* */

console.log('Loading..... core/run.js');

import { Random } from "./lib/random.js";
import { generate } from "./mapa/level.js";
import { K } from "./_konfig.js";

class Run {
  constructor(nick, cols, rows) {
    let seed = 123456789;
    if (K.mode !== "dev") {
      seed = performance.now();
    }
    this.info = {
      NICK: nick || "Anonymous",
      ID: Random.generateUUID(),
      CREATED: Date.now(),
      //IP: network.ip(req),
      SEED: seed,
    };
    this.counter = 0;
    this.turn = 0;
    this.lastTurn = Date.now();
    this.view = {
      cols: cols,
      rows: rows,
    };
    this.rnd = new Random(this.info.SEED);
    this.map = generate("shelter", this.view, this.rnd);
    //this.entities = populateRun(this.counter, this.map);//new Map();
    //this.actions = [];
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
