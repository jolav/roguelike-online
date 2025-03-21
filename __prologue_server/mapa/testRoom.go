/* */

package mapa

import (
	"math/rand"
	"prologue/lib"
)

///////////////////////////////
////////// TEST ROOM //////////
///////////////////////////////

func testRoom(x *rand.Rand, cols, rows int) Level {
	lvl := createMapAndfillWith(cols, rows, "wall")
	lvl = cleanTestRoom(lvl, "floor", cols, rows)
	lvl = putColumnsTestRoom(lvl, 50, x, cols, rows)
	return lvl
}

func putColumnsTestRoom(lvl Level, many int, rnd *rand.Rand, cols, rows int) Level {
	for range many {
		p := Point{}
		p.X = lib.RandomInt(1, cols-1, rnd)
		p.Y = lib.RandomInt(1, rows-1, rnd)
		if lvl.IsWalkable(p) {
			//lvl[p.X][p.Y] = Tile{}.Create("wall")
			lvl.Set(p, Tile{}.Create("wall"))
		}
	}
	return lvl
}

func cleanTestRoom(lvl Level, fill string, cols, rows int) Level {
	for x := range cols {
		for y := range rows {
			if y != 0 && x != 0 && x != cols-1 && y != rows-1 {
				//lvl[x][y] = Tile{}.Create(fill)
				lvl.Set(Point{x, y}, Tile{}.Create(fill))
			}
		}
	}
	return lvl
}
