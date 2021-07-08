/* */

package main

import "fmt"

type gameMap struct {
	Width  int
	Height int
	Tiles  [][]*tile
}

type tile struct {
	Blocked  bool
	BlockLOS bool
	Explored bool
	Visible  bool
}

func (m *gameMap) initializeMap() {
	m.fillMapBlockedTiles()
	m.clearInsideMap()
}

func (m *gameMap) convertMapToView(r *run) {
	for x := 0; x < m.Width; x++ {
		for y := 0; y < m.Height; y++ {
			if m.Tiles[x][y].Blocked == true &&
				m.Tiles[x][y].BlockLOS == true {
				r.View[x][y] = 1
			}

		}
	}
}

func (m *gameMap) clearInsideMap() {
	fmt.Println("clear")
	for x := 0; x < m.Width; x++ {
		for y := 0; y < m.Height; y++ {
			if x != 0 && x != m.Width-1 && y != 0 && y != m.Height-1 {
				m.Tiles[x][y].Blocked = false
				m.Tiles[x][y].BlockLOS = false
			}
		}
	}
}

func (m *gameMap) IsBlocked(x, y int) bool {
	if m.Tiles[x][y].Blocked {
		return true
	} else {
		return false
	}
}

func (m *gameMap) fillMapBlockedTiles() {
	m.Tiles = make([][]*tile, m.Width)
	for i, _ := range m.Tiles {
		m.Tiles[i] = make([]*tile, m.Height)
	}

	for x := 0; x < m.Width; x++ {
		for y := 0; y < m.Height; y++ {
			m.Tiles[x][y] = &tile{true, true, false, false}
		}
	}
}
