//

console.log('Loading..... /core/ecs_components.js');

import { point } from "../core/point.js";

class Player {
  name = "player";
}

class Creature {
  name = "creature";
}

class Item {
  name = "item";
}

class Tags {
  name = "tags";
  constructor(type) {
    this.type = type;
  }
}

class Active {
  name = "active";
}

class Renderable {
  name = "renderable";
}
//Renderable.prototype.name = 'renderable';

class Movable {
  name = "movable";
}
Movable.prototype.name = 'movable';

class BlocksMov {
  name = "blocksMov"
}

class Position {
  name = "position";
  constructor(x, y) {
    this.old = point.new(x, y);
    this.current = point.new(x, y);
  }
}

class Health {
  name = "health";
  constructor(max, current) {
    this.Max = max;
    this.Current = current;
  }
}

class Inventory {
  name = "inventory";
}

const components = {
  Player,
  Creature,
  Item,
  Tags,
  Active,
  Renderable,
  Movable,
  BlocksMov,
  Position,
  Health,
  Inventory,
};

export {
  components,
};

