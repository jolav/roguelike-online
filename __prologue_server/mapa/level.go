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

func (lvl Level) GetWalkableTile(es []Point, x *rand.Rand) Point {
	cols := len(lvl)
	rows := len(lvl[0])
	tries := 0
	for tries < 5000 {
		pX := lib.RandomInt(1, cols-1, x)
		pY := lib.RandomInt(1, rows-1, x)
		if lvl.IsWalkable(pX, pY) {
			empty := true
			for _, point := range es {
				if point.X == pX || point.Y == pY {
					empty = false
					break
				}
			}
			if empty {
				return Point{pX, pY}
			}
		}
		tries++
	}
	return Point{0, 0}
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
