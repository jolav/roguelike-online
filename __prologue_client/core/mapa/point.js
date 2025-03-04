/* */

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static getCoords(p) {
    return {
      x: p.x,
      y: p.y,
    };
  }
}

export {
  Point
};
