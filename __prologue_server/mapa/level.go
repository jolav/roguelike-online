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

func (lvl Level) Get(p Point) Tile {
	return lvl[p.X][p.Y]
}

func (lvl Level) Set(p Point, t Tile) {
	lvl[p.X][p.Y] = t
}

func (lvl Level) RandomWalkableUnoccupiedTile(es []Point, x *rand.Rand) Point {
	cols := len(lvl)
	rows := len(lvl[0])
	tries := 0
	for tries < 5000 {
		pX := lib.RandomInt(1, cols-1, x)
		pY := lib.RandomInt(1, rows-1, x)
		if lvl.IsWalkable(Point{pX, pY}) && lvl.IsEmpty(Point{pX, pY}, es) {
			return Point{pX, pY}
		}
		tries++
	}
	return Point{0, 0}
}

func (lvl Level) IsEmpty(p Point, es []Point) bool {
	for _, point := range es {
		if point.X == p.X && point.Y == p.Y {
			return false
		}
	}
	return true
}

func (lvl Level) IsWalkable(p Point) bool {
	return lvl[p.X][p.Y].Walkable
}

func (lvl Level) IsBlockingLOS(p Point) bool {
	return lvl[p.X][p.Y].BlockLOS
}

func (lvl Level) IsExplored(p Point) bool {
	return lvl[p.X][p.Y].Explored
}

func (lvl Level) IsVisible(p Point) bool {
	return lvl[p.X][p.Y].Visible
}
