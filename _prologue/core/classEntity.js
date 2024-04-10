/* */

console.log('Loading...../core/classEntity.js');

class Entity {
  constructor(id, type, pos, blocks, mobile, combat, item) {
    this.id = id;
    this.name = type + "_" + id;
    this.type = type;
    this.pos = pos;
    this.last = this.pos;
    this.view = pos;
    this.is = {
      blocking: blocks,
      mobile: mobile,
      combatant: combat,
      item: item,
    };
  }
}

export {
  Entity,
};
