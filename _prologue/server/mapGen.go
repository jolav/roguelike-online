/* */

package main

import (
	"math/rand"
	"roguelike-online/_prologue/server/components"
)

type room struct {
	components.Point
	Width  int
	Height int
}

type wall struct {
	components.Point
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
	return m.testRoom()
	m.Tiles = m.fillMapBlockedTiles(m.K.ROWS, m.K.COLS)
	//m.fillAllExceptBordersWithFloor()
	m.createSingleRoomInCenter()
	success := 0
	for tries := 1; tries < m.K.TRIES; tries++ {
		w := m.pickRandomWallFromAnyRoom()
		f := m.pickRandomFeature()
		r := m.convertFeatureToRoom(w, f)
		if m.checkIsRoomForFeature(r) {
			m.fillRoom(r)
			m.fillWall(w)
			success++
			if success >= m.K.ROOMS {
				return m.Tiles
			}
		} else {
			//m.Tiles[w.X][w.Y] = tile{}.create("wall") // clean randomWall
		}
	}

	return m.Tiles
}

func (m zoneMap) pickRandomWallFromAnyRoom() (w wall) {
	var found bool = false
	var limit int = 0
	for !found && limit < m.K.TRIES {
		w.X = randomInt(0, m.K.COLS-1, m.rnd)
		w.Y = randomInt(0, m.K.ROWS-1, m.rnd)
		if !m.isWalkableP(w.Point) && !m.istileInTheBoardEdge(w.X, w.Y) {
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
	return wall{components.Point{X: 0, Y: 0}, 0, ""}
}

func (m zoneMap) getClearNeighbours(x, y int) (int, string) {
	var nei int = 0
	var dir = "Zero"
	if m.isWalkable(x, y+1) {
		nei++
		dir = "N"
	}
	if m.isWalkable(x, y-1) {
		nei++
		dir = "S"
	}
	if m.isWalkable(x+1, y) {
		nei++
		dir = "W"
	}
	if m.isWalkable(x-1, y) {
		nei++
		dir = "E"
	}
	return nei, dir
}

func (m zoneMap) pickRandomFeature() (f feature) {
	random := randomInt(1, 100, m.rnd)
	switch {
	case random < m.K.CORRIDOR_ODDS:
		f.Width = 1
		f.Height = randomInt(m.K.CORRIDOR_MIN_LENGTH, m.K.CORRIDOR_MAX_LENGTH,
			m.rnd)
	case random >= m.K.CORRIDOR_ODDS:
		f.Width = randomInt(m.K.ROOM_MIN_SIZE, m.K.ROOM_MAX_SIZE, m.rnd)
		f.Height = randomInt(m.K.ROOM_MIN_SIZE, m.K.ROOM_MAX_SIZE, m.rnd)
	}
	return f
}

func (m zoneMap) createSingleRoomInCenter() {
	width := randomInt(m.K.ROOM_MIN_SIZE, m.K.ROOM_MAX_SIZE, m.rnd)
	height := randomInt(m.K.ROOM_MIN_SIZE, m.K.ROOM_MAX_SIZE, m.rnd)
	r := room{
		Point: components.Point{
			X: (m.K.COLS - width) / 2,
			Y: (m.K.ROWS - height) / 2,
		},
		Width:  width,
		Height: height,
	}
	m.fillRoom(r)
}

func (m zoneMap) convertFeatureToRoom(w wall, f feature) (r room) {
	r = room{components.NewPoint(0, 0), 0, 0}
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
	if r.X+r.Width > m.K.COLS-1 || r.Y+r.Height > m.K.ROWS-1 {
		return false
	}
	if r.X <= 0 || r.Y <= 0 { // =0 avoid rooms just in the edge
		return false
	}
	originX := r.X // (m.Width - r.Width) / 2
	originY := r.Y // (m.Height - r.Height) / 2
	for x := 0; x < r.Width; x++ {
		for y := 0; y < r.Height; y++ {
			if m.isWalkable(originX+x, originY+y) {
				return false
			}
		}
	}
	return true
}

func (m zoneMap) fillRoom(r room) {
	originX := r.X
	originY := r.Y
	for x := 0; x < r.Width; x++ {
		for y := 0; y < r.Height; y++ {
			m.Tiles[originX+x][originY+y] = tile{}.create("floor")
		}
	}
}

func (m zoneMap) fillWall(w wall) {
	m.Tiles[w.X][w.Y] = tile{}.create("floor")
}

func (m zoneMap) fillAllExceptBordersWithFloor() {
	for x := 0; x < m.K.COLS; x++ {
		for y := 0; y < m.K.ROWS; y++ {
			if !m.istileInTheBoardEdge(x, y) {
				m.Tiles[x][y] = tile{}.create("floor")
			}
		}
	}
}

func (m zoneMap) istileInTheBoardEdge(x, y int) bool {
	if x < 1 || y < 1 || x > m.K.COLS-2 || y > m.K.ROWS-2 {
		return true
	}
	return false
}

func (m zoneMap) fillMapBlockedTiles(rows, cols int) [][]tile {
	Tiles := make([][]tile, cols)
	for i := range Tiles {
		Tiles[i] = make([]tile, rows)
	}
	for x := 0; x < cols; x++ {
		for y := 0; y < rows; y++ {
			Tiles[x][y] = tile{}.create("wall")
		}
	}
	return Tiles
}

///////////////////////////////
////////// TEST ROOM //////////
///////////////////////////////

func (m zoneMap) testRoom() [][]tile {
	m.Tiles = m.createTestRoom()
	m.fillTestRoomWith("floor")
	m.cleanTestRoom("wall")
	m.putColumnsTestRoom(50, m.rnd)
	return m.Tiles
}

func (m zoneMap) putColumnsTestRoom(many int, rnd rand.Rand) {
	for c := 0; c < many; c++ {
		x := randomInt(1, m.K.COLS-1, rnd)
		y := randomInt(1, m.K.ROWS-1, rnd)
		if m.isWalkable(x, y) {
			m.Tiles[x][y] = tile{}.create("wall")
		}
	}
}

func (m zoneMap) cleanTestRoom(fill string) {
	for x := 0; x < m.K.COLS; x++ {
		for y := 0; y < m.K.ROWS; y++ {
			if y == 0 || x == 0 || x == m.K.COLS-1 || y == m.K.ROWS-1 {
				m.Tiles[x][y] = tile{}.create(fill)
			}
		}
	}
}

func (m zoneMap) createTestRoom() [][]tile {
	m.Tiles = make([][]tile, m.K.COLS)
	for i := range m.Tiles {
		m.Tiles[i] = make([]tile, m.K.ROWS)
	}
	for x := 0; x < m.K.COLS; x++ {
		for y := 0; y < m.K.ROWS; y++ {
			m.Tiles[x][y] = tile{}
		}
	}
	return m.Tiles
}

func (m zoneMap) fillTestRoomWith(fill string) {
	for x := 0; x < m.K.COLS; x++ {
		for y := 0; y < m.K.ROWS; y++ {
			m.Tiles[x][y] = tile{}.create(fill)
		}
	}
}
