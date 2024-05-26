/* */

console.log('Loading..... ask.js');

import { c, aux } from "./_config.js";
import { api } from "./core/api.js";
import * as render from "./render_ascii.js";

let t; // ={};

const ask = {
  version: function () {
    return fetchAPI.version();
  },
  turn: async function (action) {
    c.IS_SERVER_TURN = true;
    t = await fetchAPI.turn(action);
    //console.log("CLIENT => ", t.view);
    render.ascii();
    c.IS_SERVER_TURN = false;
  }
};

const fetchAPI = {
  version: function () {
    return api.version();
  },
  turn: async function (action) {
    const start = Date.now();
    let data = {};
    try {
      const params = {
        action: action,
        cols: c.VIEW_COLS,
        rows: c.VIEW_ROWS,
      };
      await help.sleep();
      const startProcessingTurn = Date.now();
      data = api.turn(params);
      //data = await data.json();
      c.TPT = Date.now() - startProcessingTurn;
    } catch (err) {
      console.error("ERROR fetchAPI Turn => ", err);
    }
    c.LAG = Date.now() - start;
    return data;
  },
};

export {
  ask,
  t,
};

const help = {
  sleep: function () {
    const delay = aux.randomInt(30, 50);
    return new Promise(function (resolve) {
      setTimeout(resolve, delay);
    });
  },
};
