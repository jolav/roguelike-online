/* */

console.log('Loading..... core/run.js');

import { Random } from "./lib/random.js";
import { generate } from "./mapa/level.js";
import { K } from "./_konfig.js";
import { populate } from "./populate.js";
import { ECS } from "./ecs/manager.js";

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
    this.turn = 0;
    this.lastTurn = Date.now();
    this.view = {
      cols: cols,
      rows: rows,
    };
    this.rnd = new Random(this.info.SEED);
    this.map = generate("testRoom", this.view, this.rnd);
    //this.map = generate("shelter", this.view, this.rnd);
    this.ecs = new ECS();
    //populate.shelter(this);
    this.actions = [];
  }

  prepareDataNew() {
    const r = {};
    r.ID = this.info.ID;
    r.SEED = this.info.SEED;
    r.map = this.map;
    //r.entities = this.ecs.getEntitiesWithComp("position");
    //console.log("CUANTAS =>", r.entities.length);
    //console.log(r.entities[0]);
    //console.log(r.entities);
    return r;
  }
  prepareDataTurn() {
    const r = {};
    r.turn = this.turn;
    r.map = this.map;
    return r;
  }
  doAction(command) {
    console.log('Command =>', command);
  }
}

export {
  Run
};
