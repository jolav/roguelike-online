/* */

console.log('Loading...../core/classPlayer.js');

import { Actor } from "./classActor.js";

class Player extends Actor {
  constructor(id, type, pos, blocks, mobile, combat, item) {
    super(id, type, pos, blocks, mobile, combat, item);
  }
}

export {
  Player,
};
