/* */

console.log('Loading...../core/classPlayer.js');

import { Entity } from "./classEntity.js";

class Player extends Entity {
  constructor(id, type, pos, blocks, mobile, combat) {
    super(id, type, pos, blocks, mobile, combat);
  }
}

export {
  Player,
};
