/* */

package main

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

const (
	ROOM_TRIES          int = 10000 //5000
	ROOMS               int = 150   //10   //200
	MIN_SIZE_ROOM       int = 4
	MAX_SIZE_ROOM       int = 12 //12 //25
	MIN_LENGTH_CORRIDOR int = 4  //2
	MAX_LENGTH_CORRIDOR int = 25 //6 //25
	CORRIDOR_PERCENT    int = 20
	FOES_TRIES          int = ROOM_TRIES
	MAX_FOES            int = ROOMS / 4
)

func (m gameMap) generateVault() gameMap {
	// http://www.roguebasin.com/index.php?title=Dungeon-Building_Algorithm
	m.tiles = m.fillMapBlockedtiles(m.Rows, m.Cols)
	m.Camera = m.fillMapBlockedtiles(m.CamRows, m.CamCols)
	//m.fillAllExceptBordersWithFloor()
	m.createSingleRoomInCenter()
	success := 0
	for tries := 1; tries < ROOM_TRIES; tries++ {
		w := m.pickRandomWallFromAnyRoom()
		f := m.pickRandomFeature()
		r := m.convertFeatureToRoom(w, f)
		if m.checkIsRoomForFeature(r) {
			m.fillRoom(r)
			m.fillWall(w)
			success++
			if success >= ROOMS {
				return m
			}
		} else {
			//m.tiles[w.Y][w.X] = tile{}.set("wall") // clean randomWall
		}
	}
	return m
}

func (m gameMap) pickRandomWallFromAnyRoom() (w wall) {
	var found bool = false
	var limit int = 0
	for !found && limit < 5000 {
		w.X = randomInt(0, m.Cols-1)
		w.Y = randomInt(0, m.Rows-1)
		if m.tiles[w.Y][w.X].Blocked && !m.isTileInTheBoardEdge(w.X, w.Y) {
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

func (m gameMap) getClearNeighbours(x, y int) (int, string) {
	var nei int = 0
	var dir = "Zero"
	if !m.isBlocked(x, y-1) {
		nei++
		dir = "S"
	}
	if !m.isBlocked(x, y+1) {
		nei++
		dir = "N"
	}
	if !m.isBlocked(x+1, y) {
		nei++
		dir = "W"
	}
	if !m.isBlocked(x-1, y) {
		nei++
		dir = "E"
	}
	return nei, dir
}

func (m gameMap) pickRandomFeature() (f feature) {
	random := randomInt(1, 100)
	switch {
	case random < CORRIDOR_PERCENT:
		f.Width = 1
		f.Height = randomInt(MIN_LENGTH_CORRIDOR, MAX_LENGTH_CORRIDOR)
	case random >= CORRIDOR_PERCENT:
		f.Width = randomInt(MIN_SIZE_ROOM, MAX_SIZE_ROOM)
		f.Height = randomInt(MIN_SIZE_ROOM, MAX_SIZE_ROOM)
	}
	return f
}

func (m gameMap) createSingleRoomInCenter() {
	width := randomInt(MIN_SIZE_ROOM, MAX_SIZE_ROOM)
	height := randomInt(MIN_SIZE_ROOM, MAX_SIZE_ROOM)
	r := room{
		X:      (m.Cols - width) / 2,
		Y:      (m.Rows - height) / 2,
		Width:  width,
		Height: height,
	}
	m.fillRoom(r)
}

func (m gameMap) convertFeatureToRoom(w wall, f feature) (r room) {
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

func (m gameMap) checkIsRoomForFeature(r room) bool {
	if r.X+r.Width > m.Cols-1 || r.Y+r.Height > m.Rows-1 {
		return false
	}
	if r.X <= 0 || r.Y <= 0 { // =0 avoid rooms just in the edge
		return false
	}
	originX := r.X // (m.Width - r.Width) / 2
	originY := r.Y // (m.Height - r.Height) / 2
	for y := 0; y < r.Height; y++ {
		for x := 0; x < r.Width; x++ {
			if !m.isBlocked(originX+x, originY+y) {
				return false
			}
		}
	}
	return true
}

func (m gameMap) fillRoom(r room) {
	originX := r.X
	originY := r.Y
	for y := 0; y < r.Height; y++ {
		for x := 0; x < r.Width; x++ {
			m.tiles[originY+y][originX+x] = tile{}.set("floor")
		}
	}
}

func (m gameMap) fillWall(w wall) {
	m.tiles[w.Y][w.X] = tile{}.set("floor")
}

func (m gameMap) fillAllExceptBordersWithFloor() {
	for y := 0; y < m.Rows; y++ {
		for x := 0; x < m.Cols; x++ {
			if !m.isTileInTheBoardEdge(x, y) {
				m.tiles[y][x] = tile{}.set("floor")
			}
		}
	}
}

func (m gameMap) isTileInTheBoardEdge(x, y int) bool {
	if x < 1 || y < 1 || x > m.Cols-2 || y > m.Rows-2 {
		return true
	}
	return false
}

func (m gameMap) fillMapBlockedtiles(rows, cols int) [][]tile {
	tiles := make([][]tile, rows)
	for i, _ := range tiles {
		tiles[i] = make([]tile, cols)
	}
	for y := 0; y < rows; y++ {
		for x := 0; x < cols; x++ {
			tiles[y][x] = tile{}.set("wall")
		}
	}
	return tiles
}
