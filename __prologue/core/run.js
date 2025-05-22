/* */

console.log('Loading..... /core/run.js');

import { aux } from "./lib/aux.js";
import { K } from "./_konfig.js";
import { Random } from "./lib/random.js";
import { basicRoom } from "./map/gen/basicRoom.js";
import { shelter } from "./map/gen/shelter.js";

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
    this.map = mapGen("basicRoom", this.view.cols, this.view.rows, this.rnd);
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

function mapGen(typeOfMap, cols, rows, rnd) {
  switch (typeOfMap) { // outdoors,indoors
    case "basicRoom":
      return basicRoom.create(cols, rows, rnd);
    case "shelter":
      return shelter.create();
  }
}
