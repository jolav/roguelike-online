/* */

package main

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

type room struct {
	X      int
	Y      int
	Width  int
	Height int
}

const (
	ROOM_TRIES          = 5000
	ROOMS               = 200
	MIN_SIZE_ROOM       = 4
	MAX_SIZE_ROOM       = 25
	MIN_LENGTH_CORRIDOR = 2
	MAX_LENGTH_CORRIDOR = 25
	CORRIDOR_PERCENT    = 15
)

func (m *gameMap) initializeRandomMap() {
	m.fillMapBlockedTiles()
	m.createSingleRoomInCenter()
	success := 0
	for tries := 1; tries < ROOM_TRIES; tries++ {
		w := m.pickRandomWallFromAnyRoom()
		//prettyPrintStruct(w)
		f := m.pickRandomFeature()
		//prettyPrintStruct(f)
		r := m.convertFeatureToRoom(w, f)
		//prettyPrintStruct(r)
		if m.checkIsRoomForFeature(r) {
			m.fillRectRoom(r)
			m.fillWall(w)
			success++
			if success >= ROOMS {
				return
			}
		}
	}
}

func (m *gameMap) pickRandomWallFromAnyRoom() (w *wall) {
	w = new(wall)
	var found bool = false
	var limit int = 0
	for !found && limit < 5000 {
		w.X = randomInt(0, m.Width-1)
		w.Y = randomInt(0, m.Height-1)
		if m.Tiles[w.X][w.Y].Blocked && m.notInTheBoardEdge(w.X, w.Y) {
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
	return &wall{0, 0, 0, ""}
}

func (m *gameMap) getClearNeighbours(x, y int) (int, string) {
	var nei int = 0
	var dir = "Zero"
	if !m.Tiles[x][y-1].Blocked {
		nei++
		dir = "S"
	}
	if !m.Tiles[x][y+1].Blocked {
		nei++
		dir = "N"
	}
	if !m.Tiles[x+1][y].Blocked {
		nei++
		dir = "W"
	}
	if !m.Tiles[x-1][y].Blocked {
		nei++
		dir = "E"
	}
	return nei, dir
}

func (m *gameMap) notInTheBoardEdge(x, y int) bool {
	if x < 1 || y < 1 || x > m.Width-2 || y > m.Height-2 {
		return false
	}
	return true
}

func (m *gameMap) pickRandomFeature() (f *feature) {
	f = new(feature)
	random := randomInt(1, 100)
	switch {
	case random < CORRIDOR_PERCENT:
		f.Width = 1
		f.Height = randomInt(MIN_LENGTH_CORRIDOR, MAX_LENGTH_CORRIDOR)
	case random >= CORRIDOR_PERCENT:
		f.Width = randomInt(MIN_SIZE_ROOM, MAX_SIZE_ROOM)
		f.Height = randomInt(MIN_SIZE_ROOM, MAX_SIZE_ROOM)
	}
	return
}

func (m *gameMap) convertFeatureToRoom(w *wall, f *feature) (r *room) {
	r = new(room)
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

func (m *gameMap) checkIsRoomForFeature(r *room) bool {
	if r.X+r.Width > m.Width-1 || r.Y+r.Height > m.Height-1 {
		return false
	}
	if r.X <= 0 || r.Y <= 0 { // =0 avoid rooms just in the edge
		return false
	}
	originX := r.X // (m.Width - r.Width) / 2
	originY := r.Y // (m.Height - r.Height) / 2
	for x := 0; x < r.Width; x++ {
		for y := 0; y < r.Height; y++ {
			if !m.Tiles[originX+x][originY+y].Blocked {
				return false
			}
		}
	}
	return true
}

func (m *gameMap) createSingleRoomInCenter() {
	width := randomInt(MIN_SIZE_ROOM, MAX_SIZE_ROOM) + 5
	height := randomInt(MIN_SIZE_ROOM, MAX_SIZE_ROOM) + 5
	r := &room{
		X:      (m.Width - width) / 2,
		Y:      (m.Height - height) / 2,
		Width:  width,
		Height: height,
	}
	m.fillRectRoom(r)
}

func (m *gameMap) fillWall(w *wall) {
	m.Tiles[w.X][w.Y] = &tile{false, false, false, false}
}

func (m *gameMap) fillRectRoom(r *room) {
	originX := r.X
	originY := r.Y
	for x := 0; x < r.Width; x++ {
		for y := 0; y < r.Height; y++ {
			m.Tiles[originX+x][originY+y] = &tile{false, false, false, false}
		}
	}
}
