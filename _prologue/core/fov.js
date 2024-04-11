/* */

console.log('Loading...../core/fov.js');

import { r } from "./run.js";
import { K } from "./_konfig.js";
import { Point } from "./utils.js";
import { utils as u } from "./utils.js";

function get() {
  from.player(r.entities[0]);
}

const from = {
  player: function (pj) {
    const p1 = { x: pj.pos.x, y: pj.pos.y };
    for (let col = 0; col < K.CAM_COLS; col++) {
      for (let row = 0; row < K.CAM_ROWS; row++) {
        const tile = r.map[r.cam.x + col][r.cam.y + row];
        const p2 = { x: r.cam.x + col, y: r.cam.y + row };
        tile.visible = false;
        if (u.euclideanDistance(p1, p2) <= K.FOV_PJ_RANGE) {
          const option =
            [line(p1, p2), walkGrid(p1, p2), supercoverLine(p1, p2)];
          const path = option[K.FOV_TYPE];
          tile.visible = true;
          for (let z = 1; z < path.length; z++) {
            const routeTile = r.map[path[z].x][path[z].y];
            if (routeTile.blockLOS) {
              tile.visible = false;
              routeTile.visible = true;
              break; // z = path.length;
            }
          }
          if (tile.visible) {
            tile.explored = true;
          }
        }
        // UNCOMMENT THIS FOR WATCH ALL THE MAP
        //tile.visible = true;
      }
    }
  }

};

//
// https://www.redblobgames.com/grids/line-drawing/
//

// linear interpolation
function line(p0, p1) {
  let points = [];
  let N = u.manhattanDistance(p0, p1);
  for (let step = 0; step <= N; step++) {
    let t = N === 0 ? 0.0 : step / N;
    points.push(roundPoint(lerpPoint(p0, p1, t)));
  }
  return points;
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

function walkGrid(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const nx = Math.abs(dx);
  const ny = Math.abs(dy);
  const sign_x = (dx > 0) ? 1 : -1;
  const sign_y = (dy > 0) ? 1 : -1;

  let p = new Point(p1.x, p1.y);
  let points = [new Point(p.x, p.y)];
  for (let ix = 0, iy = 0; ix < nx || iy < ny;) {
    if ((1 + 2 * ix) * ny < (1 + 2 * iy) * nx) {
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

export {
  get,
};
