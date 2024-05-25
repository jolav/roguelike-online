/* */

console.log('Loading..... /core/systems.js');

import { movement } from "./sys_movement.js";
import { renderable } from "./sys_renderable.js";

const systems = {
  movement,
  renderable,
};

export {
  systems
};
