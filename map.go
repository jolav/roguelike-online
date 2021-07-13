/* */

package main

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

func (m *gameMap) IsExplored(x, y int) bool {
	if m.Tiles[x][y].Explored {
		return true
	} else {
		return false
	}
}

func (m *gameMap) IsVisible(x, y int) bool {
	if m.Tiles[x][y].Visible {
		return true
	} else {
		return false
	}
}

func (m *gameMap) convertMapToView(r *run, c config) {
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

	for x := 0; x < c.ViewWidth; x++ {
		for y := 0; y < c.ViewHeight; y++ {
			switch {
			case !m.IsExplored(camX+x, camY+y) && !m.IsVisible(camX+x, camY+y):
				r.View[x][y] = "unknown"
				break
			case m.IsVisible(camX+x, camY+y) && !m.IsBlocked(camX+x, camY+y):
				r.View[x][y] = "floor"
				break
			case m.IsVisible(camX+x, camY+y) && m.IsBlocked(camX+x, camY+y):
				r.View[x][y] = "wall"
				break
			case m.IsExplored(camX+x, camY+y) && !m.IsBlocked(camX+x, camY+y):
				r.View[x][y] = "floorVisited"
				break
			case m.IsExplored(camX+x, camY+y) && m.IsBlocked(camX+x, camY+y):
				r.View[x][y] = "wallVisited"
				break
			default:
				//fmt.Println("DEFAULT")
			}
		}
	}
	// set player
	r.View[pjX][pjY] = "hero"

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
