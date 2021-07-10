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

func (m *gameMap) convertMapToView(r *run, c config) {
	// clean old view
	r.View = get2dArray(c.ViewWidth, c.ViewHeight)

	pj := r.Entities["player"]
	camX := pj.X - c.ViewWidth/2
	camY := pj.Y - c.ViewHeight/2
	pjX := c.ViewWidth / 2
	pjY := c.ViewHeight / 2
	if camX < 0 {
		camX = 0
		pjX = pj.X
	}
	if (camX + c.ViewWidth) > m.Width {
		camX = m.Width - c.ViewWidth
		pjX = pj.X - camX
	}
	if camY < 0 {
		camY = 0
		pjY = pj.Y
	}
	if (camY + c.ViewHeight) > m.Height {
		camY = m.Height - c.ViewHeight
		pjY = pj.Y - camY
	}
	// set player
	r.View[pjX][pjY] = 2

	for x := 0; x < c.ViewWidth; x++ {
		for y := 0; y < c.ViewHeight; y++ {
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
