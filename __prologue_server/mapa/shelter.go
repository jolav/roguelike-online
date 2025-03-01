/* */

package mapa

import (
	"fmt"
	"math/rand"
	"prologue/lib"
)

type Wall struct {
	X   int
	Y   int
	Nei int
	Dir string
}

type Feature struct {
	Width  int
	Height int
}

type Room struct {
	X      int
	Y      int
	Width  int
	Height int
}

const (
	ROOM_TRIES          = 5000
	ROOMS               = 100
	MIN_SIZE_ROOM       = 6
	MAX_SIZE_ROOM       = 15
	MIN_LENGTH_CORRIDOR = 1
	MAX_LENGTH_CORRIDOR = 5
	CORRIDOR_PERCENT    = 0
)

func newShelterMap(x *rand.Rand, cols, rows int) Level {
	fmt.Println("creating", cols, "x", rows)
	lvl := createShelter(cols, rows)
	lvl = createSingleRoomInCenter(lvl, cols, rows, x)
	success := 0
	for tries := 1; tries < ROOM_TRIES; tries++ {
		w := pickRandomWallFromAnyRoom(lvl, x, cols, rows)
		//prettyPrintStruct(w)
		f := pickRandomFeature(x)
		//prettyPrintStruct(f)
		r := convertFeatureToRoom(w, f)
		//prettyPrintStruct(r)
		if checkIsRoomForFeature(lvl, cols, rows, r) {
			lvl = fillRectRoom(lvl, r)
			lvl = fillWall(lvl, w)
			success++
			if success >= ROOMS {
				return lvl
			}
		} else {
			lvl[w.X][w.Y] = Tile{}.create("wall") // clean randomWall
		}
	}
	return lvl
}

func checkIsRoomForFeature(lvl Level, cols, rows int, r *Room) bool {
	if r.X+r.Width > cols-1 || r.Y+r.Height > rows-1 {
		return false
	}
	if r.X <= 0 || r.Y <= 0 { // =0 avoid rooms just in the edge
		return false
	}
	originX := r.X // (Width - r.Width) / 2
	originY := r.Y // (Height - r.Height) / 2
	for x := 0; x < r.Width; x++ {
		for y := 0; y < r.Height; y++ {
			if lvl[originX+x][originY+y].Walkable {
				return false
			}
		}
	}
	return true
}

func convertFeatureToRoom(w *Wall, f *Feature) (r *Room) {
	r = new(Room)
	switch {
	case w.Dir == "N":
		r.X = w.X - f.Width/2
		r.Y = w.Y - f.Height
		r.Width = f.Width
		r.Height = f.Height
	case w.Dir == "S":
		r.X = w.X - f.Width/2
		r.Y = w.Y + 1
		r.Width = f.Width
		r.Height = f.Height
	case w.Dir == "E":
		r.X = w.X + 1
		r.Y = w.Y - f.Width/2
		r.Width = f.Height
		r.Height = f.Width
	case w.Dir == "W":
		r.X = w.X - f.Height
		r.Y = w.Y - f.Width/2
		r.Width = f.Height
		r.Height = f.Width
	}
	return r

}

func pickRandomFeature(x *rand.Rand) (f *Feature) {
	f = new(Feature)
	random := lib.RandomInt(1, 100, x)
	switch {
	case random < CORRIDOR_PERCENT:
		f.Width = 1
		f.Height = lib.RandomInt(MIN_LENGTH_CORRIDOR, MAX_LENGTH_CORRIDOR, x)
	case random >= CORRIDOR_PERCENT:
		f.Width = lib.RandomInt(MIN_SIZE_ROOM, MAX_SIZE_ROOM, x)
		f.Height = lib.RandomInt(MIN_SIZE_ROOM, MAX_SIZE_ROOM, x)
	}
	return
}

func pickRandomWallFromAnyRoom(lvl Level, x *rand.Rand, cols, rows int) (w *Wall) {
	w = new(Wall)
	var found bool = false
	var limit int = 0
	for !found && limit < 5000 {
		w.X = lib.RandomInt(0, cols-1, x)
		w.Y = lib.RandomInt(0, rows-1, x)
		if !lvl[w.X][w.Y].Walkable && notInTheBoardEdge(w.X, w.Y, cols, rows) {
			w.Nei, w.Dir = getClearNeighbours(lvl, w.X, w.Y)
			if w.Nei == 1 {
				found = true
			}
		}
		limit++
	}
	if found {
		return w
	}
	return &Wall{0, 0, 0, ""}
}

func getClearNeighbours(lvl Level, x, y int) (int, string) {
	var nei int = 0
	var dir = "Zero"
	if lvl[x][y-1].Walkable {
		nei++
		dir = "S"
	}
	if lvl[x][y+1].Walkable {
		nei++
		dir = "N"
	}
	if lvl[x+1][y].Walkable {
		nei++
		dir = "W"
	}
	if lvl[x-1][y].Walkable {
		nei++
		dir = "E"
	}
	return nei, dir
}

func notInTheBoardEdge(x, y, cols, rows int) bool {
	if x < 1 || y < 1 || x > cols-2 || y > rows-2 {
		return false
	}
	return true
}

func createSingleRoomInCenter(lvl Level, cols, rows int, x *rand.Rand) Level {
	width := lib.RandomInt(MIN_SIZE_ROOM, MAX_SIZE_ROOM, x) + 5
	height := lib.RandomInt(MIN_SIZE_ROOM, MAX_SIZE_ROOM, x) + 5
	r := &Room{
		X:      (cols - width) / 2,
		Y:      (rows - height) / 2,
		Width:  width,
		Height: height,
	}
	lvl = fillRectRoom(lvl, r)
	return lvl
}

func fillRectRoom(lvl Level, r *Room) Level {
	originX := r.X
	originY := r.Y
	for x := range r.Width {
		for y := range r.Height {
			lvl[originX+x][originY+y] = Tile{}.create("floor")
		}
	}
	return lvl
}

func fillWall(lvl Level, w *Wall) Level {
	lvl[w.X][w.Y] = Tile{}.create("floor")
	return lvl
}

func createShelter(cols, rows int) Level {
	lvl := make([][]Tile, cols)
	for i := range lvl {
		lvl[i] = make([]Tile, rows)
	}
	for x := range cols {
		for y := range rows {
			lvl[x][y] = Tile{}.create("wall")
		}
	}
	return lvl
}
