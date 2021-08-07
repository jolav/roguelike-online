/* */
package main

import "fmt"

type gameMap struct {
	Cols    int `json:"totalCols"`
	Rows    int `json:"totalRows"`
	CamCols int `json:"cols"`
	CamRows int `json:"rows"`
	tiles   [][]tile
	Camera  [][]tile `json:"tiles"`
	gen     mapConfig
}

type tile struct {
	Terrain  string `json:"terrain"`
	Blocked  bool   `json:"blocked"`
	BlockLOS bool   `json:"blockLOS"`
	Explored bool   `json:"explored"`
	Visible  bool   `json:"visible"`
}

func (m gameMap) isBlocked(x, y int) bool {
	if m.tiles[y][x].Blocked {
		return true
	} else {
		return false
	}
}

func (m gameMap) isBlockingLOS(x, y int) bool {
	if m.tiles[y][x].BlockLOS {
		return true
	} else {
		return false
	}
}

func (m gameMap) isExplored(x, y int) bool {
	if m.tiles[y][x].Explored {
		return true
	} else {
		return false
	}
}

func (m gameMap) isVisible(x, y int) bool {
	if m.tiles[y][x].Visible {
		return true
	} else {
		return false
	}
}

func (m gameMap) toCameraView(p point) {
	var pjX, pjY = p.getCoords()
	camX := pjX - (m.CamCols / 2)
	camY := pjY - (m.CamRows / 2)
	if camX < 0 {
		camX = 0
	}
	if camX+m.CamCols > m.Cols {
		camX = m.Cols - m.CamCols
	}
	if camY < 0 {
		camY = 0
	}
	if camY+m.CamRows > m.Rows {
		camY = m.Rows - m.CamRows
	}
	for y := 0; y < m.CamRows; y++ {
		//var aux string
		for x := 0; x < m.CamCols; x++ {
			//aux += fmt.Sprintf("%d %d  => %d %d  | ", x, y, x+camX, y+camY)
			m.Camera[y][x] = m.tiles[y+camY][x+camX]
		}
		//fmt.Println(aux)
	}
}

func newGameMap() gameMap {
	m := gameMap{
		Cols:    width,
		Rows:    height,
		CamCols: camWidth,
		CamRows: camHeight,
		gen: mapConfig{
			roomTries:         roomTries,
			rooms:             rooms,
			minSizeRoom:       minSizeRoom,
			maxSizeRoom:       maxSizeRoom,
			minLengthCorridor: minLengthCorridor,
			maxLengthCorridor: maxLengthCorridor,
			corridorPercent:   corridorPercent,
			foesTries:         foesTries,
			maxFoes:           maxFoes,
		},
	}
	m.tiles = m.fillMapBlockedtiles(m.Rows, m.Cols)
	m.Camera = m.fillMapBlockedtiles(m.CamRows, m.CamCols)
	m.initializeRandomFIXED()
	m.toCameraView(point{m.Cols / 2, m.Rows / 2})
	return m
}

func (m gameMap) fillMapBlockedtiles(rows, cols int) [][]tile {
	tiles := make([][]tile, rows)
	for i, _ := range tiles {
		tiles[i] = make([]tile, cols)
	}

	for y := 0; y < rows; y++ {
		for x := 0; x < cols; x++ {
			tiles[y][x] = tile{"wall", true, true, false, false}
		}
	}
	return tiles
}

func (m gameMap) initializeRandomFIXED() {
	for y := 0; y < m.Rows; y++ {
		for x := 0; x < m.Cols; x++ {
			if !m.isTileInTheBoardEdge(x, y) {
				m.tiles[y][x] = tile{"floor", false, false, false, false}
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

func printMap(m [][]tile) {
	for y := 0; y < len(m); y++ {
		for x := 0; x < len(m[0]); x++ {
			fmt.Print(" ", m[y][x].Terrain, " ")
		}
		fmt.Println()
	}
}
