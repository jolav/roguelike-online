/* */

console.log('Loading.....fov.js');

import { r } from "./run.js";
import { K, lib } from "./_config.js";

function playerLOS() {
  for (let x = 0; x < K.MAP_X; x++) {
    for (let y = 0; y < K.MAP_Y; y++) {
      const aux1 = r.entities[0].pos.x + 0.5;
      const aux2 = r.entities[0].pos.y + 0.5;
      const center = new Point(aux1, aux2);
      const tile = r.map[x][y];
      tile.visible = false;
      if (isInSight(center, { x, y }, K.LOS_RADIUS)) {
        const p0 = new Point(r.entities[0].pos.x, r.entities[0].pos.y);
        const p1 = new Point(x, y);
        const option =
          [line(p0, p1), walkGrid(p0, p1), supercoverLine(p0, p1)];
        const path = option[0];
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

function foeLOS(p) {
  const p0 = new Point(p.x, p.y);
  const p1 = new Point(r.entities[0].pos.x, r.entities[0].pos.y);
  const path = line(p0, p1);
  return path[1];
}

function isInSight(center, tile, radius) {
  return lib.pointsDistance(center, tile) <= radius;
}

// https://www.redblobgames.com/grids/line-drawing/

function Point(x, y) {
  this.x = x;
  this.y = y;
}

// orthogonal steps
function walkGrid(p0, p1) {
  let dx = p1.x - p0.x, dy = p1.y - p0.y;
  let nx = Math.abs(dx), ny = Math.abs(dy);
  let sign_x = dx > 0 ? 1 : -1, sign_y = dy > 0 ? 1 : -1;

  let p = new Point(p0.x, p0.y);
  let points = [new Point(p.x, p.y)];
  for (let ix = 0, iy = 0; ix < nx || iy < ny;) {
    if ((0.5 + ix) / nx < (0.5 + iy) / ny) {
      // next step is horizontal
      p.x += sign_x;
      ix++;
    } else {
      // next step is vertical
      p.y += sign_y;
      iy++;
    }
    points.push(new Point(p.x, p.y));
  }
  return points;
}

function supercoverLine(p0, p1) {
  let dx = p1.x - p0.x, dy = p1.y - p0.y;
  let nx = Math.abs(dx), ny = Math.abs(dy);
  let sign_x = dx > 0 ? 1 : -1, sign_y = dy > 0 ? 1 : -1;

  let p = new Point(p0.x, p0.y);
  let points = [new Point(p.x, p.y)];
  for (let ix = 0, iy = 0; ix < nx || iy < ny;) {
    let decision = (1 + 2 * ix) * ny - (1 + 2 * iy) * nx;
    if (decision === 0) {
      // next step is diagonal
      p.x += sign_x;
      p.y += sign_y;
      ix++;
      iy++;
    } else if (decision < 0) {
      // next step is horizontal
      p.x += sign_x;
      ix++;
    } else {
      // next step is vertical
      p.y += sign_y;
      iy++;
    }
    points.push(new Point(p.x, p.y));
  }
  return points;
}

// linear interpolation
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

// end linear interpolation

export {
  playerLOS,
  foeLOS,
};
