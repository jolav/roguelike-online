/* */
package main

import "fmt"

type gameMap struct {
	Cols  int      `json:"cols"`
	Rows  int      `json:"rows"`
	Tiles [][]tile `json:"tiles"`
	gen   mapConfig
}

type tile struct {
	Terrain  string `json:"terrain"`
	Blocked  bool   `json:"blocked"`
	BlockLOS bool   `json:"blockLOS"`
	Explored bool   `json:"explored"`
	Visible  bool   `json:"visible"`
}

func (m gameMap) isBlocked(x, y int) bool {
	if m.Tiles[y][x].Blocked {
		return true
	} else {
		return false
	}
}

func (m gameMap) isBlockingLOS(x, y int) bool {
	if m.Tiles[y][x].BlockLOS {
		return true
	} else {
		return false
	}
}

func (m gameMap) isExplored(x, y int) bool {
	if m.Tiles[y][x].Explored {
		return true
	} else {
		return false
	}
}

func (m gameMap) isVisible(x, y int) bool {
	if m.Tiles[y][x].Visible {
		return true
	} else {
		return false
	}
}

type mapConfig struct {
	roomTries         int
	rooms             int
	minSizeRoom       int
	maxSizeRoom       int
	minLengthCorridor int
	maxLengthCorridor int
	corridorPercent   int
	foesTries         int
	maxFoes           int
}

func newGameMap() gameMap {
	m := gameMap{
		Cols: width,
		Rows: height,
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
	m.Tiles = m.fillMapBlockedTiles()
	m.initializeRandomFIXED()
	//m.printMap()
	return m
}

func (m gameMap) fillMapBlockedTiles() [][]tile {
	tiles := make([][]tile, m.Rows)
	for i, _ := range tiles {
		tiles[i] = make([]tile, m.Cols)
	}

	for y := 0; y < m.Rows; y++ {
		for x := 0; x < m.Cols; x++ {
			tiles[y][x] = tile{"wall", true, true, false, false}
		}
	}
	return tiles
}

func (m gameMap) initializeRandomFIXED() {
	for y := 0; y < m.Rows; y++ {
		for x := 0; x < m.Cols; x++ {
			if !m.isTileInTheBoardEdge(x, y) {
				m.Tiles[y][x] = tile{"floor", false, false, false, false}
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

func (m gameMap) printMap() {
	for k, v := range m.Tiles {
		fmt.Println(k, v)
	}
}
