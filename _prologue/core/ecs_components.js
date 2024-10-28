/* */

console.log('Loading..... core/ecs_components.js');

class Position {
  constructor(p) {
    this.current = p; //point.new(x, y);
    this.onMap = p;
  }
}

class Render {
  constructor(char, color) {
    this.char = char;
    this.color = color;
    this.visible = true;
  }
}

const components = {
  Position,
  Render,
};

export {
  components,
};
