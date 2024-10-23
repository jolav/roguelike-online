/* */

console.log('Loading..... core/ecs_components.js');

import { point } from "./point.js";

class Position {
  constructor(x, y) {
    this.current = point.new(x, y);
    //this.end = point.new(x, y);
  }
}

const components = {
  Position,
};

export {
  components,
};
