/* */

console.log('Loading..... /core/action_melee.js');

import { aux } from "./aux.js";

const melee = function (a, d) {
  //console.log('Melee ', a.id, " -> ", d.id);
  const att = a.components;
  const def = d.components;
  sequence.a = a;
  sequence.d = d;
  sequence.toHit(att, def);
};

const sequence = {
  a: undefined,
  d: undefined,
  toHit: function (att, def) {
    const toHit = 0
      + att.melee.base.toHit
      + att.melee.slots[0].toHit
      + att.stats.agi;
    const need = 0
      + 8
      + def.stats.combat.er;
    //console.log('toHit', toHit, "need", need);
    const dice = aux.diceRoll("2d6");
    if (dice + toHit >= need) {
      this.piercing(att, def);
    }
  },
  piercing: function (att, def) {
    const APBase = 0 +
      + att.melee.slots[0].ap
      + att.stats.end;
    const AR = def.stats.combat.ar;
    let dmgDice = 0;
    let end = false;
    while (!end) {
      const success = piercingTest(APBase, AR, dmgDice);
      if (success === 0) {
        end = true;
      }
      if (success === 1 || success === 2) {
        dmgDice++;
        end = true;
      }
      if (success === 3) {
        dmgDice++;
      }
    }
    this.takeDamage(att, def, dmgDice);
  },
  takeDamage: function (att, def, dice) {
    let dmg = 0;
    for (let i = 0; i < dice; i++) {
      const d = aux.diceRoll(att.melee.slots[0].dmg);
      if (d > 0) {
        dmg += d;
      }
    }
    def.health.real -= dmg;
    if (def.health.real <= 0) {
      if (def.player) {
        alert("You Lost");
        location.reload();
      }
      this.d.die();
    }
  }
};

export {
  melee,
};

const piercingTest = function (APBase, AR, times) {
  const mod = 2 * (times + 1);
  let success = 0;
  for (let i = 0; i < 3; i++) {
    if (aux.diceRoll("2d6") + APBase - AR - mod > 0) {
      success++;
    }
  }
  return success;

};
