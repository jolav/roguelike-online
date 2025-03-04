/* */

import { Point } from "../../mapa/point.js";

class Position {
  constructor(x, y) {
    this.current = new Point(x, y);
  }
}

export {
  Position
};
