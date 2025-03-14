/* */

package mapa

import (
	"math/rand"
	"prologue/lib"
)

type Level [][]Tile

func NewLevel(x *rand.Rand, cols, rows, lvlType int) Level {
	lvlTypes := map[int]string{
		0: "emptyView",
		1: "testRoom",
		2: "shelter",
	}
	switch lvlTypes[lvlType] {
	case "emptyView":
		return createMapAndfillWith(cols, rows, "unknown")
	case "testRoom":
		return testRoom(x, cols, rows)
	case "shelter":
		return newShelterMap(x, 104, 60)
	}

	return nil
}

func (lvl Level) RandomWalkableUnoccupiedTile(es []Point, x *rand.Rand) Point {
	cols := len(lvl)
	rows := len(lvl[0])
	tries := 0
	for tries < 5000 {
		pX := lib.RandomInt(1, cols-1, x)
		pY := lib.RandomInt(1, rows-1, x)
		if lvl.IsWalkable(pX, pY) && lvl.IsEmpty(pX, pY, es) {
			return Point{pX, pY}
		}
		tries++
	}
	return Point{0, 0}
}

func (lvl Level) IsEmpty(x, y int, es []Point) bool {
	for _, point := range es {
		if point.X == x && point.Y == y {
			return false
		}
	}
	return true
}

func (lvl Level) IsWalkable(x, y int) bool {
	return lvl[x][y].Walkable
}

func (lvl Level) IsBlockingLOS(x, y int) bool {
	return lvl[x][y].BlockLOS
}

func (lvl Level) IsExplored(x, y int) bool {
	return lvl[x][y].Explored
}

func (lvl Level) IsVisible(x, y int) bool {
	return lvl[x][y].Visible
}
