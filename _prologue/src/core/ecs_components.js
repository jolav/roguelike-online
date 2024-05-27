//

console.log('Loading..... /core/ecs_components.js');

import { aux } from "../core/aux.js";

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
  constructor(name, type) {
    this.Name = name;
    this.Type = type;
  }
}

class Renderable {
  name = "renderable";
}
//Renderable.prototype.name = 'renderable';

class Movable {
  name = "movable";
}
Movable.prototype.name = 'movable';

class Position {
  name = "position";
  constructor(x, y) {
    this.old = aux.newPoint(x, y);
    this.current = aux.newPoint(x, y);
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
  Renderable,
  Movable,
  Position,
  Health,
  Inventory,
};

export {
  components,
};

