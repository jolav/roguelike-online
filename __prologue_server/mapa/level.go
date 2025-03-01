/* */

package mapa

import (
	"math/rand"
	"prologue/lib"
)

type Level [][]Tile

func NewLevel(lvlType string, x *rand.Rand, cols, rows int) Level {
	switch lvlType {
	case "testRoom":
		return testRoom(x, cols, rows)
	case "shelter":
		return newShelterMap(x, cols, rows)
	}
	return nil
}

func (lvl Level) GetWalkableTile(x *rand.Rand) Point {
	cols := len(lvl)
	rows := len(lvl[0])
	tries := 0
	for tries < 5000 {
		pX := lib.RandomInt(1, cols-1, x)
		pY := lib.RandomInt(1, rows-1, x)
		if lvl.isWalkable(pX, pY) {
			return Point{pX, pY}
		}
		//fmt.Println(tries)
		tries++
	}
	return Point{0, 0}
}

func (lvl Level) isWalkable(x, y int) bool {
	return lvl[x][y].Walkable
}

func (lvl Level) isBlockingLOS(x, y int) bool {
	return lvl[x][y].BlockLOS
}

func (lvl Level) isExplored(x, y int) bool {
	return lvl[x][y].Explored
}

func (lvl Level) isVisible(x, y int) bool {
	return lvl[x][y].Visible
}
