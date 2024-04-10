/* */

console.log('Loading...../core/classItem.js');

import { K } from "./_konfig.js";
import { entities } from "./entities.js";
import { utils as u } from "./utils.js";

function populate(counter) {
  return items.create(counter);
}

class Item {
  constructor(id, type, pos, blocks, mobile) {
    this.id = id;
    this.type = type;
    this.pos = pos;
    this.is = {
      blocking: blocks,
      mobile: mobile,
    };
  }
}

const items = {
  create: function (counter) {
    let result = [];
    result.push(this.exit(counter));
    counter++;
    if (K.MAX_ITEMS === 0) { return result; }
    let items = 0;
    for (let tries = 0; tries < K.TRIES; tries++) {
      let pos = entities.randomEmptyPoint(result);
      if (pos !== undefined) {
        const item = new Item(
          counter,
          aux.itemType(),
          pos,
          false,
          false,
        );
        aux.itemStats(item);
        result.push(item);
        counter++;
        items++;
      }
      if (items >= K.MAX_ITEMS) {
        return result;
      }
    }
    console.log("Cant create all Items");
    return result;
  },
  itemType: function () {
    const odds = u.randomInt(1, 10);
    switch (odds) {
      case 1:
      case 2:
      case 3:
        return "food";
      case 4:
      case 5:
        return "supply";
      case 6:
      case 7:
        return "medical";
      case 8:
        return "melee";
      case 9:
        return "firearm";
      case 10:
        return "body";
    }
  },
  itemStats: function (item) {
    item.is = {
      ...item.is,
      lootable: true,
      consumable: false,
      equippable: false,
      equipped: false,
    };
    item.data = {};
    switch (item.type) {
      case "food":
        item.data.qty = u.randomInt(1, 6);
        item.is.consumable = true;
        break;
      case "supply":
        item.data.qty = u.randomInt(1, 3);
        item.is.consumable = true;
        break;
      case "medical":
        item.data.qty = u.randomInt(1, 3);
        item.is.consumable = true;
        break;
      case "firearm":
        item.data.name = "Pistol 9mm";
        item.data.range = 4 + u.randomInt(1, 4);
        item.is.equippable = true;
        break;
      case "melee":
        item.data.name = "Baseball Bat";
        item.data.melee = 6 + u.randomInt(1, 4);
        item.is.equippable = true;
        break;
      case "body":
        item.data.name = "Cloth";
        item.data.defence = 2 + u.randomInt(1, 4);
        item.is.equippable = true;
    }
  },
  exit: function (counter) {
    for (let tries = 0; tries < K.TRIES; tries++) {
      let pos = entities.randomEmptyPoint([]);
      if (pos !== undefined) {
        const item = new Item(
          counter,
          "exit",
          pos,
          false,
          false,
        );
        item.is = {
          lootable: false,
          consumable: false,
          equippable: false,
          equipped: false,
        };
        counter++;
        return item;
      }
    }
  }
};

const aux = {
  itemType: function () {
    const odds = u.randomInt(1, 10);
    switch (odds) {
      case 1:
      case 2:
      case 3:
        return "food";
      case 4:
      case 5:
        return "supply";
      case 6:
      case 7:
        return "medical";
      case 8:
        return "melee";
      case 9:
        return "firearm";
      case 10:
        return "body";
    }
  },
  itemStats: function (item) {
    item.is = {
      ...item.is,
      lootable: true,
      consumable: false,
      equippable: false,
      equipped: false,
    };
    item.data = {};
    switch (item.type) {
      case "food":
        item.data.qty = u.randomInt(1, 6);
        item.is.consumable = true;
        break;
      case "supply":
        item.data.qty = u.randomInt(1, 3);
        item.is.consumable = true;
        break;
      case "medical":
        item.data.qty = u.randomInt(1, 3);
        item.is.consumable = true;
        break;
      case "firearm":
        item.data.name = "Pistol 9mm";
        item.data.range = 4 + u.randomInt(1, 4);
        item.is.equippable = true;
        break;
      case "melee":
        item.data.name = "Baseball Bat";
        item.data.melee = 6 + u.randomInt(1, 4);
        item.is.equippable = true;
        break;
      case "body":
        item.data.name = "Cloth";
        item.data.defence = 2 + u.randomInt(1, 4);
        item.is.equippable = true;
    }
  }
};

export {
  populate,
};
