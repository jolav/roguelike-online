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
	roomTries         = 5000
	rooms             = 200
	minSizeRoom       = 4
	maxSizeRoom       = 25
	minLengthCorridor = 2
	maxLengthCorridor = 25
	corridorPercent   = 15
)

func (m *gameMap) initializeRandomMap() {
	m.fillMapBlockedTiles()
	m.createSingleRoomInCenter()
	success := 0
	for tries := 1; tries < roomTries; tries++ {
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
			if success >= rooms {
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
	case random < corridorPercent:
		f.Width = 1
		f.Height = randomInt(minLengthCorridor, maxLengthCorridor)
	case random >= corridorPercent:
		f.Width = randomInt(minSizeRoom, maxSizeRoom)
		f.Height = randomInt(minSizeRoom, maxSizeRoom)
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
	width := randomInt(minSizeRoom, maxSizeRoom) + 5
	height := randomInt(minSizeRoom, maxSizeRoom) + 5
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
