/* */

console.log('Loading.....fov.js');

import { r } from "./run.js";
import { K } from "./_config.js";

function calculate() {
  for (let x = 0; x < K.MAP_X; x++) {
    for (let y = 0; y < K.MAP_Y; y++) {
      const i = r.entities[0].pos.x + 0.5, j = r.entities[0].pos.y + 0.5;
      const tile = r.map[x][y];
      tile.visible = false;
      if (isInsideCircle({ i, j }, { x, y }, K.LOS_RADIUS)) {
        const path = line(new Point(r.entities[0].pos.x, r.entities[0].pos.y), new Point(x, y));
        tile.visible = true;
        for (let z = 1; z < path.length; z++) {
          const routeTile = r.map[path[z].x][path[z].y];
          if (routeTile.blocks || routeTile.blockLOS) {
            tile.visible = false;
            routeTile.visible = true;
            z = path.length;
          }
        }
        if (tile.visible) {
          tile.explored = true;
        }
      }
      // UNCOMMENT THIS FOR WATCH ALL THE MAP
      //tile.visible = true;
      //  
    }
  }
}

function isInsideCircle(center, tile, radius) {
  const dx = center.i - tile.x;
  const dy = center.j - tile.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance <= radius;
}

// https://www.redblobgames.com/grids/line-drawing/
function line(p0, p1) {
  let points = [];
  let N = diagonalDistance(p0, p1);
  for (let step = 0; step <= N; step++) {
    let t = N === 0 ? 0.0 : step / N;
    points.push(roundPoint(lerpPoint(p0, p1, t)));
  }
  return points;
}

function diagonalDistance(p0, p1) {
  let dx = p1.x - p0.x, dy = p1.y - p0.y;
  return Math.max(Math.abs(dx), Math.abs(dy));
}

function roundPoint(p) {
  return new Point(Math.round(p.x), Math.round(p.y));
}

function lerpPoint(p0, p1, t) {
  return new Point(lerp(p0.x, p1.x, t),
    lerp(p0.y, p1.y, t));
}

function lerp(start, end, t) {
  return start * (1.0 - t) + t * end;
}

function Point(x, y) {
  this.x = x;
  this.y = y;
}

export {
  calculate,
};
