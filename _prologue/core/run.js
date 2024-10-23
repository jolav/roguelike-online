/* */

console.log('Loading..... core/run.js');

import { aux } from "../aux/aux.js";
import { generate } from "./mapGen.js";
import { populateRun } from "./entities.js";
import { Random } from "../aux/random.js";
import { K } from "./_konfig.js";

const run = {
  create: function (req) {
    let seed = performance.now();
    if (K.MODE === "dev") {
      seed = "123456789";
    }
    this.info = {
      NICK: req.nick || "Anonymous",
      ID: aux.GenerateUUID(),
      CREATED: Date.now(),
      SEED: seed,
    };
    this.counter = 0;
    this.turn = 0;
    this.lastTurn = Date.now();
    this.view = {
      cols: req.cols,
      rows: req.rows,
    };
    this.rnd = new Random(this.info.SEED);
    this.map = generate("basicRoom", req.cols, req.rows, this.rnd);
    this.entities = populateRun(this.counter, this.map);
    this.actions = [];
  },
  prepareDataNew: function () {
    return {
      id: this.info.ID,
      seed: this.info.SEED,
      map: this.map
    };
  },

  prepareDataTurn: function () {
    return {
      turn: this.turn
    };
  }
};

export {
  run
};
