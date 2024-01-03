/* */

console.log('Loading...../server/fov.js');

import { r } from "./run.js";
import { K, lib } from "./_conf.js";

function get() {
  from.player();
}

const from = {
  player: function () {
    const p1 = { x: r.pj.pos.x, y: r.pj.pos.y };
    for (let col = 0; col < K.CAM_COLS; col++) {
      for (let row = 0; row < K.CAM_ROWS; row++) {
        const tile = r.map[r.cam.x + col][r.cam.y + row];
        const p2 = { x: r.cam.x + col, y: r.cam.y + row };
        tile.visible = false;
        if (lib.euclideanDistance(p1, p2) <= K.LOS_RANGE) {
          const path = walkGrid(p1, p2);
          tile.visible = true;
          for (let z = 1; z < path.length; z++) {
            const routeTile = r.map[path[z].x][path[z].y];
            if (routeTile.blockLOS) {
              tile.visible = false;
              routeTile.visible = true;
              break;
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

/*
https://www.redblobgames.com/grids/line-drawing/
*/
function walkGrid(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const nx = Math.abs(dx);
  const ny = Math.abs(dy);
  const sign_x = (dx > 0) ? 1 : -1;
  const sign_y = (dy > 0) ? 1 : -1;

  let p = new lib.Point(p1.x, p1.y);
  let points = [new lib.Point(p.x, p.y)];
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
    points.push(new lib.Point(p.x, p.y));
  }
  return points;
}

export {
  get,
};
