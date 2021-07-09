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

func (m *gameMap) IsBlocked(x, y int) bool {
	if m.Tiles[x][y].Blocked {
		return true
	} else {
		return false
	}
}

func (m *gameMap) IsBlockingLOS(x, y int) bool {
	if m.Tiles[x][y].BlockLOS {
		return true
	} else {
		return false
	}
}

func (m *gameMap) convertMapToView(r *run) {
	// clean old view
	r.View = *new([viewWidth][viewHeight]int)

	pj := r.Entities["player"]
	camX := pj.X - viewWidth/2
	camY := pj.Y - viewHeight/2
	pjX := viewWidth / 2
	pjY := viewHeight / 2
	if camX < 0 {
		camX = 0
		pjX = pj.X
	}
	if (camX + viewWidth) > mapWidth {
		camX = mapWidth - viewWidth
		pjX = pj.X - camX
	}
	if camY < 0 {
		camY = 0
		pjY = pj.Y
	}
	if (camY + viewHeight) > mapHeight {
		camY = mapHeight - viewHeight
		pjY = pj.Y - camY
	}
	// set player
	r.View[pjX][pjY] = 2

	for x := 0; x < viewWidth; x++ {
		for y := 0; y < viewHeight; y++ {
			if m.IsBlocked(camX+x, camY+y) && m.IsBlockingLOS(camX+x, camY+y) {
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
