/* */

console.log('Loading..... core/run.js');

import { aux } from "../aux/aux.js";
import { generate } from "./mapGen.js";
import { populateRun } from "./entities.js";
import { K } from "./_konfig.js";
import { myRandom } from "../aux/random.js";
import { components } from "./ecs_components.js";
import { actions } from "./actions.js";

const run = {
  create: function (req) {
    let seed = 123456789;
    if (K.MODE !== "dev") {
      seed = performance.now();
    }
    myRandom.init(seed);
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
    this.map = generate("basicRoom", this.view.cols, this.view.rows);
    this.entities = populateRun(this);//new Map();
    this.actions = [];
  },
  doTurn: function (req) {
    // players turn
    const action = req.action;
    const actionType = actions.getType(action);
    for (const [_, e] of this.entities) {
      if (e.hasTag("player")) {
        const done = actions[actionType](e, action);
        if (!done) { // player turn has not been done
          return done;
        }
        run.turn++;
        break;
      }
    }
    return true;
    // others turn
  },
  prepareDataNew: function () {
    const r = {
      info: {
        ID: this.info.ID,
        SEED: this.info.SEED,
      },
      map: this.map,
      entities: getVisibleEntities(this.entities),
    };
    return r;
  },
  prepareDataTurn: function () {
    const r = {
      turn: this.turn
    };
    return r;
  }
};

export {
  run
};

function getVisibleEntities(es) {
  const result = new Map();
  for (const [k, e] of es) {
    //console.log(e);
    if (e.hasComponent(components.Render)) {
      if (e.components.Render.visible) {
        result.set(k, e);
      }
    }
  }
  return result;
}
