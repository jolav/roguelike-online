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
	roomTries         int = 5000
	rooms             int = 200
	minSizeRoom       int = 4
	maxSizeRoom       int = 25
	minLengthCorridor int = 2
	maxLengthCorridor int = 25
	corridorPercent   int = 15
	foesTries         int = roomTries
	maxFoes           int = rooms / 2
)

// CREATE MAP

func (m *gameMap) initializeRandom() {
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

// POPULATE MAP

func (m *gameMap) populate(r *run) {
	r.Entities[0] = newEntity(
		"player",
		true,
		true,
		pos{
			Char:   "@",
			Facing: 'N',
			X:      r.Map.Width / 2,
			Y:      r.Map.Height / 2,
		},
		combat{},
	)
	success := 0
	for tries := 1; tries < foesTries; tries++ {
		p := m.pickRandomPointFromMap()
		if m.checkIsRoomForFoe(p) && m.isNotOccupied(p, r.Entities) {
			r.Entities[len(r.Entities)] = newEntity(
				"rat",
				true,
				true,
				pos{
					Char:   "r",
					Facing: 'N',
					X:      p.X,
					Y:      p.Y,
				},
				combat{},
			)
			success++
			if success >= maxFoes {
				return
			}
		}
	}
}

func (m *gameMap) pickRandomPointFromMap() (p pos) {
	p = pos{m.Width / 2, m.Height / 2, "E", 'N'}
	var found bool = false
	var limit int = 0
	for !found && limit < 5000 {
		p.X = randomInt(0, m.Width-1)
		p.Y = randomInt(0, m.Height-1)
		if !m.IsBlocked(p.X, p.Y) {
			found = true
		}
		limit++
	}
	return p
}

func (m *gameMap) checkIsRoomForFoe(p pos) bool {
	nei, _ := m.getClearNeighbours(p.X, p.Y)
	if nei > 2 {
		return true
	}
	return false
}

func (m *gameMap) isNotOccupied(p pos, e entities) bool {
	for k, _ := range e {
		if p.X == e[k].Pos.X && p.Y == e[k].Pos.X {
			return false
		}
	}
	return true
}
