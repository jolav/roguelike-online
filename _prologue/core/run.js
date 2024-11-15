/* */

console.log('Loading..... core/run.js');

import { aux } from "../aux/aux.js";
import { generate } from "./mapGen.js";
import { populateRun } from "./entities.js";
import { K } from "./_konfig.js";
import { myRandom } from "../aux/random.js";
import { components } from "./ecs_components.js";
import { actions } from "./actions.js";
import { queue } from "./queue.js";

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
    queue.create(this.entities);
  },
  doAction: function (req) {
    this.actions = [];
    // players turn
    const playerAction = req.playerAction;
    const actionType = actions.getType(playerAction);
    for (const [_, e] of this.entities) {
      if (e.hasTag("player")) {
        const done = actions[actionType](e, playerAction);
        if (!done) { // player turn has not been done
          return false;
        }
        //run.turn++;
        const cost = actions.getCost(playerAction.toUpperCase());
        queue.update(cost, e.id);
        break;
      }
    }
    //return true;
    let sec = 0;
    while (sec < K.TRIES) {
      const active = queue.list[0];
      if (active.id >= 0) {
        const e = this.entities.get(active.id);
        if (e.hasTag("player")) { // player turn
          //queue.show();
          return true;
        }
        // active entities turn
        const action = actions.ai(e, this);
        //const actionType = actions.getType(action);
        //actions[actionType](e, action);
        const cost = actions.getCost(action.toUpperCase());
        queue.update(cost, e.id);
      }
      if (active.id === -1) { // new turn
        this.turn++;
        queue.newTurn(active.wait);
      }
      sec++;
    }
    console.log('FAIL ?????');
    return false;
  },
  prepareDataNew: function () {
    const r = {
      info: {
        ID: this.info.ID,
        SEED: this.info.SEED,
      },
      map: this.map,
      entities: getVisibleEntities(this.entities),
      actions: this.actions,
    };
    return r;
  },
  prepareDataTurn: function () {
    const r = {
      turn: this.turn,
      entities: getVisibleEntities(this.entities),
      actions: this.actions,
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
