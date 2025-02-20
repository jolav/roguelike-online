/* */

package main

import (
	"math/rand"
	"prologue/lib"
)

type Level [][]Tile

type Tile struct {
	Terrain  string `json:"terrain"`
	Walkable bool   `json:"walkable"`
	BlockLOS bool   `json:"blockLOS"`
	Explored bool   `json:"explored"`
	Visible  bool   `json:"visible"`
}

func (t Tile) create(terrain string) Tile {
	switch terrain {
	case "floor":
		return Tile{terrain, true, false, false, false}
	case "wall":
		return Tile{terrain, false, true, false, false}
	case "unknown":
		return Tile{terrain, false, true, false, false}
	}
	return Tile{}
}

func NewLevel(lvlType string, x *rand.Rand, cols, rows int) Level {
	switch lvlType {
	case "testRoom":
		return testRoom(x, cols, rows)
	}
	return nil
}

///////////////////////////////
////////// TEST ROOM //////////
///////////////////////////////

func testRoom(x *rand.Rand, cols, rows int) Level {
	lvl := createTestRoom(cols, rows)
	lvl = fillTestRoomWith(lvl, "floor", cols, rows)
	lvl = cleanTestRoom(lvl, "wall", cols, rows)
	lvl = putColumnsTestRoom(lvl, 50, x, cols, rows)
	return lvl
}

func putColumnsTestRoom(lvl Level, many int, rnd *rand.Rand, cols, rows int) Level {
	for c := 0; c < many; c++ {
		x := lib.RandomInt(1, cols-1, rnd)
		y := lib.RandomInt(1, rows-1, rnd)
		if lvl[x][y].Walkable {
			lvl[x][y] = Tile{}.create("wall")
		}
	}
	return lvl
}

func cleanTestRoom(lvl Level, fill string, cols, rows int) Level {
	for x := 0; x < cols; x++ {
		for y := 0; y < rows; y++ {
			if y == 0 || x == 0 || x == cols-1 || y == rows-1 {
				lvl[x][y] = Tile{}.create(fill)
			}
		}
	}
	return lvl
}

func createTestRoom(cols, rows int) Level {
	lvl := make([][]Tile, cols)
	for i := range lvl {
		lvl[i] = make([]Tile, rows)
	}
	for x := 0; x < cols; x++ {
		for y := 0; y < rows; y++ {
			lvl[x][y] = Tile{}
		}
	}
	return lvl
}

func fillTestRoomWith(lvl Level, fill string, cols, rows int) Level {
	for x := 0; x < cols; x++ {
		for y := 0; y < rows; y++ {
			lvl[x][y] = Tile{}.create(fill)
		}
	}
	return lvl
}
