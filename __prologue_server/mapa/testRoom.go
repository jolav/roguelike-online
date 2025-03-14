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
		x := lib.RandomInt(1, cols-1, rnd)
		y := lib.RandomInt(1, rows-1, rnd)
		if lvl[x][y].Walkable {
			lvl[x][y] = Tile{}.create("wall")
		}
	}
	return lvl
}

func cleanTestRoom(lvl Level, fill string, cols, rows int) Level {
	for x := range cols {
		for y := range rows {
			if y != 0 && x != 0 && x != cols-1 && y != rows-1 {
				lvl[x][y] = Tile{}.create(fill)
			}
		}
	}
	return lvl
}
