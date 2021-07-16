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

func (m *gameMap) isBlocked(x, y int) bool {
	if m.Tiles[x][y].Blocked {
		return true
	} else {
		return false
	}
}

func (m *gameMap) isBlockingLOS(x, y int) bool {
	if m.Tiles[x][y].BlockLOS {
		return true
	} else {
		return false
	}
}

func (m *gameMap) isExplored(x, y int) bool {
	if m.Tiles[x][y].Explored {
		return true
	} else {
		return false
	}
}

func (m *gameMap) isVisible(x, y int) bool {
	if m.Tiles[x][y].Visible {
		return true
	} else {
		return false
	}
}

func (m *gameMap) convertMapToView(r *run, c config) {
	pj := r.Entities[0].Pos
	camX := pj.X - c.ViewWidth/2
	camY := pj.Y - c.ViewHeight/2
	if camX < 0 {
		camX = 0
	}
	if (camX + c.ViewWidth) > m.Width {
		camX = m.Width - c.ViewWidth
	}
	if camY < 0 {
		camY = 0
	}
	if (camY + c.ViewHeight) > m.Height {
		camY = m.Height - c.ViewHeight
	}

	for x := 0; x < c.ViewWidth; x++ {
		for y := 0; y < c.ViewHeight; y++ {
			switch {
			case !m.isExplored(camX+x, camY+y) && !m.isVisible(camX+x, camY+y):
				r.View[x][y] = "unknown"
				break
			case m.isVisible(camX+x, camY+y) && !m.isBlocked(camX+x, camY+y):
				r.View[x][y] = "floor"
				break
			case m.isVisible(camX+x, camY+y) && m.isBlocked(camX+x, camY+y):
				r.View[x][y] = "wall"
				break
			case m.isExplored(camX+x, camY+y) && !m.isBlocked(camX+x, camY+y):
				r.View[x][y] = "floorVisited"
				break
			case m.isExplored(camX+x, camY+y) && m.isBlocked(camX+x, camY+y):
				r.View[x][y] = "wallVisited"
				break
			default:
				//fmt.Println("PROBLEM")
			}
		}
	}
}

func (m *gameMap) createPublicEntities(r *run, c config) {
	// clear public
	r.PublicEntities = newPublicEntities()
	public := r.PublicEntities

	// get cam offset
	pj := r.Entities[0].Pos
	camX := pj.X - c.ViewWidth/2
	camY := pj.Y - c.ViewHeight/2
	if camX < 0 {
		camX = 0
	}
	if (camX + c.ViewWidth) > m.Width {
		camX = m.Width - c.ViewWidth
	}
	if camY < 0 {
		camY = 0
	}
	if (camY + c.ViewHeight) > m.Height {
		camY = m.Height - c.ViewHeight
	}

	// copy player as public[0]
	public = append(public, *r.Entities[0])
	public[0].Pos.X = r.Entities[0].Pos.X - camX
	public[0].Pos.Y = r.Entities[0].Pos.Y - camY
	// copy only visible entities
	var index int = 1
	for k, _ := range r.Entities {
		if m.isVisible(r.Entities[k].Pos.X, r.Entities[k].Pos.Y) && k != 0 {
			//fmt.Println(k, v)
			public = append(public, *r.Entities[k])
			public[index].Pos.X = r.Entities[k].Pos.X - camX
			public[index].Pos.Y = r.Entities[k].Pos.Y - camY
			index++
		}
	}
	r.PublicEntities = public

}

func (m *gameMap) isEntityBlocking(r *run, x, y int) bool {
	for k, _ := range r.Entities {
		if r.Entities[k].Pos.X == x && r.Entities[k].Pos.Y == y {
			if r.Entities[k].isBlocking() {
				return true
			}
		}
	}
	return false
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
