/* */

console.log('Loading.....ask.js');

import { C, aux } from "./_config.js";
import { answer } from "./server/answer.js";

const ask = {
  init: async function (cb) {
    await simulatePing();
    C.VERSION = answer.K.VERSION;
    cb();
  }
};

export {
  ask
};

async function simulatePing(delay) {
  if (delay === undefined) {
    delay = aux.randomInt(100, 200) + 150;
  }
  console.log('Delay.....', delay, "ms");
  await aux.sleep(delay);
}
