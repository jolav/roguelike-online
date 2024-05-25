//

console.log('Loading..... /core/ecs_components.js');

class Player { }
Player.prototype.name = 'player';

class Creature { }
Creature.prototype.name = 'creature';

class Item { }
Item.prototype.name = 'item';

class Tags {
  constructor(name, type) {
    this.Name = name;
    this.Type = type;
  }
}
Tags.prototype.name = 'name';

class Renderable { }
Renderable.prototype.name = 'renderable';

class Movable { }
Movable.prototype.name = 'movable';

class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
Position.prototype.name = 'position';

class Health {
  constructor(max, current) {
    this.Max = max;
    this.Current = current;
  }
}
Health.prototype.name = 'health';

class Inventory { }
Inventory.prototype.name = 'inventory';

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

