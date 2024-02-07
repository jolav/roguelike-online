/* */

package main

import (
	"math/rand"
)

type room struct {
	X      int
	Y      int
	Width  int
	Height int
}

type wall struct {
	X   int
	Y   int
	Nei int
	Dir string
}

type feature struct {
	Width  int
	Height int
}

/////////////////////////////////////////////////////////////////////////
// http://www.roguebasin.com/index.php?title=Dungeon-Building_Algorithm
/////////////////////////////////////////////////////////////////////////

func (m zoneMap) generateShelter() [][]tile {
	//return m.testRoom()
	m.tiles = m.fillMapBlockedtiles(m.k.ROWS, m.k.COLS)
	//m.fillAllExceptBordersWithFloor()
	m.createSingleRoomInCenter()
	success := 0
	for tries := 1; tries < m.k.TRIES; tries++ {
		w := m.pickRandomWallFromAnyRoom()
		f := m.pickRandomFeature()
		r := m.convertFeatureToRoom(w, f)
		if m.checkIsRoomForFeature(r) {
			m.fillRoom(r)
			m.fillWall(w)
			success++
			if success >= m.k.ROOMS {
				return m.tiles
			}
		} else {
			//m.tiles[w.Y][w.X] = tile{}.create("wall") // clean randomWall
		}
	}

	return m.tiles
}

func (m zoneMap) pickRandomWallFromAnyRoom() (w wall) {
	var found bool = false
	var limit int = 0
	for !found && limit < m.k.TRIES {
		w.X = randomInt(0, m.k.COLS-1, m.rnd)
		w.Y = randomInt(0, m.k.ROWS-1, m.rnd)
		if !m.tiles[w.Y][w.X].Walkable && !m.isTileInTheBoardEdge(w.X, w.Y) {
			w.Nei, w.Dir = m.getClearNeighbours(w.X, w.Y)
			if w.Nei == 1 {
				found = true
			}
		}
		limit++
	}
	if found {
		return w
	}
	return wall{0, 0, 0, ""}
}

func (m zoneMap) getClearNeighbours(x, y int) (int, string) {
	var nei int = 0
	var dir = "Zero"
	if m.tiles[y+1][x].Walkable {
		nei++
		dir = "N"
	}
	if m.tiles[y-1][x].Walkable {
		nei++
		dir = "S"
	}
	if m.tiles[y][x+1].Walkable {
		nei++
		dir = "W"
	}
	if m.tiles[y][x-1].Walkable {
		nei++
		dir = "E"
	}
	return nei, dir
}

func (m zoneMap) pickRandomFeature() (f feature) {
	random := randomInt(1, 100, m.rnd)
	switch {
	case random < m.k.CORRIDOR_ODDS:
		f.Width = 1
		f.Height = randomInt(m.k.CORRIDOR_MIN_LENGTH, m.k.CORRIDOR_MAX_LENGTH,
			m.rnd)
	case random >= m.k.CORRIDOR_ODDS:
		f.Width = randomInt(m.k.ROOM_MIN_SIZE, m.k.ROOM_MAX_SIZE, m.rnd)
		f.Height = randomInt(m.k.ROOM_MIN_SIZE, m.k.ROOM_MAX_SIZE, m.rnd)
	}
	return f
}

func (m zoneMap) createSingleRoomInCenter() {
	width := randomInt(m.k.ROOM_MIN_SIZE, m.k.ROOM_MAX_SIZE, m.rnd)
	height := randomInt(m.k.ROOM_MIN_SIZE, m.k.ROOM_MAX_SIZE, m.rnd)
	r := room{
		X:      (m.k.COLS - width) / 2,
		Y:      (m.k.ROWS - height) / 2,
		Width:  width,
		Height: height,
	}
	m.fillRoom(r)
}

func (m zoneMap) convertFeatureToRoom(w wall, f feature) (r room) {
	r = room{0, 0, 0, 0}
	r.Width = f.Width
	r.Height = f.Height
	switch {
	case w.Dir == "N":
		r.X = w.X - f.Width/2
		r.Y = w.Y - f.Height
		break
	case w.Dir == "S":
		r.X = w.X - f.Width/2
		r.Y = w.Y + 1
		break
	case w.Dir == "E":
		r.X = w.X + 1
		r.Y = w.Y - f.Width/2
		break
	case w.Dir == "W":
		r.X = w.X - f.Width
		r.Y = w.Y - f.Height/2
		break
	}
	return r
}

func (m zoneMap) checkIsRoomForFeature(r room) bool {
	if r.X+r.Width > m.k.COLS-1 || r.Y+r.Height > m.k.ROWS-1 {
		return false
	}
	if r.X <= 0 || r.Y <= 0 { // =0 avoid rooms just in the edge
		return false
	}
	originX := r.X // (m.Width - r.Width) / 2
	originY := r.Y // (m.Height - r.Height) / 2
	for y := 0; y < r.Height; y++ {
		for x := 0; x < r.Width; x++ {
			if m.tiles[originY+y][originX+x].Walkable {
				return false
			}
		}
	}
	return true
}

func (m zoneMap) fillRoom(r room) {
	originX := r.X
	originY := r.Y
	for y := 0; y < r.Height; y++ {
		for x := 0; x < r.Width; x++ {
			m.tiles[originY+y][originX+x] = tile{}.create("floor")
		}
	}
}

func (m zoneMap) fillWall(w wall) {
	m.tiles[w.Y][w.X] = tile{}.create("floor")
}

func (m zoneMap) fillAllExceptBordersWithFloor() {
	for y := 0; y < m.k.ROWS; y++ {
		for x := 0; x < m.k.COLS; x++ {
			if !m.isTileInTheBoardEdge(x, y) {
				m.tiles[y][x] = tile{}.create("floor")
			}
		}
	}
}

func (m zoneMap) isTileInTheBoardEdge(x, y int) bool {
	if x < 1 || y < 1 || x > m.k.COLS-2 || y > m.k.ROWS-2 {
		return true
	}
	return false
}

func (m zoneMap) fillMapBlockedtiles(rows, cols int) [][]tile {
	tiles := make([][]tile, rows)
	for i := range tiles {
		tiles[i] = make([]tile, cols)
	}
	for y := 0; y < rows; y++ {
		for x := 0; x < cols; x++ {
			tiles[y][x] = tile{}.create("wall")
		}
	}
	return tiles
}

///////////////////////////////
////////// TEST ROOM //////////
///////////////////////////////

func (m zoneMap) testRoom() [][]tile {
	m.tiles = m.createTestRoom()
	m.fillTestRoomWith("floor")
	m.cleanTestRoom("wall")
	m.putColumnsTestRoom(100, m.rnd)
	return m.tiles
}

func (m zoneMap) putColumnsTestRoom(many int, rnd rand.Rand) {
	for c := 0; c < many; c++ {
		x := randomInt(1, m.k.COLS-1, rnd)
		y := randomInt(1, m.k.ROWS-1, rnd)
		if m.tiles[y][x].Walkable == true {
			m.tiles[y][x] = tile{}.create("wall")
		}
	}
}

func (m zoneMap) cleanTestRoom(fill string) {
	for y := 0; y < m.k.ROWS; y++ {
		for x := 0; x < m.k.COLS; x++ {
			if y == 0 || x == 0 || x == m.k.COLS-1 || y == m.k.ROWS-1 {
				m.tiles[y][x] = tile{}.create(fill)
			}
		}
	}
}
func (m zoneMap) createTestRoom() [][]tile {
	m.tiles = make([][]tile, m.k.ROWS)
	for i := range m.tiles {
		m.tiles[i] = make([]tile, m.k.COLS)
	}
	for y := 0; y < m.k.ROWS; y++ {
		for x := 0; x < m.k.COLS; x++ {
			m.tiles[y][x] = tile{}
		}
	}
	return m.tiles
}

func (m zoneMap) fillTestRoomWith(fill string) {
	for y := 0; y < m.k.ROWS; y++ {
		for x := 0; x < m.k.COLS; x++ {
			m.tiles[y][x] = tile{}.create(fill)
		}
	}
}
