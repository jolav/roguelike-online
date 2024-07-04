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

class Queueable {
  name = "queueable";
}

class View {
  name = "view";
  pos = point.new(0, 0);
  dx = 0;
  dy = 0;
  action = undefined;
  update(p, dx, dy, action) {
    this.pos = point.new(p.x, p.y);
    this.dx = dx;
    this.dy = dy;
    this.action = action;
  }
}
//View.prototype.name = 'view';

class Movable {
  name = "movable";
}

class BlocksMov {
  name = "blocksMov";
}

class Stats {
  name = "stats";
  constructor(args) {
    this.endurance = args[0][0];
    this.agility = args[0][1];
    this.perception = args[0][2];
    this.intelligence = args[0][3];
    this.willpower = args[0][4];
    this.createDMs();
    //console.log(JSON.stringify(this, null, 2));
    this.xp(args[1]);
    this.combat(args[2]);
  }
  createDMs() {
    this.end = this.roundAttribute(this.endurance);
    this.agi = this.roundAttribute(this.agility);
    this.per = this.roundAttribute(this.perception);
    this.int = this.roundAttribute(this.intelligence);
    this.wil = this.roundAttribute(this.willpower);
  }
  xp(args) {
    this.xp = {
      level: args[0],
      qty: args[1],
    };
  }
  combat(args) {
    this.combat = {
      ar: args[0],
      er: args[1],
    };
  }
  roundAttribute(value) {
    return Math.floor((value - 10) / 2);
  }
}

class Melee {
  name = "melee";
  constructor(args) {
    this.base = {
      slots: args[0][0],
      toHit: args[0][1],
      ap: args[0][2],
      er: args[0][3],
    };
    this.slots = [{
      type: args[1][0],
      toHit: args[1][1],
      ap: args[1][2],
      dmg: args[1][3],
    }];
  }
}

class Position {
  name = "position";
  constructor(x, y) {
    this.current = point.new(x, y);
    //this.end = point.new(x, y);
  }
}

class Health {
  name = "health";
  constructor(max, current) {
    this.max = max;
    this.real = current;
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
  Queueable,
  View,
  Movable,
  BlocksMov,
  Stats,
  Melee,
  Position,
  Health,
  Inventory,
};

export {
  components,
};
