/* */

package main

const (
	CAM_WIDTH  int = 31
	CAM_HEIGHT int = 31
	WIDTH      int = 100 //25
	HEIGHT     int = 100 //21
)

type gameMap struct {
	Cols    int `json:"totalCols"`
	Rows    int `json:"totalRows"`
	CamCols int `json:"cols"`
	CamRows int `json:"rows"`
	tiles   [][]tile
	Camera  [][]tile `json:"tiles"`
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

func (m gameMap) convertToCameraView(p point) {
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
		for x := 0; x < m.CamCols; x++ {
			if m.isExplored(x+camX, y+camY) {
				m.Camera[y][x] = m.tiles[y+camY][x+camX]
			} else {
				m.Camera[y][x] = tile{}.set("unknown")
			}
		}
	}
}

func newGameMap() gameMap {
	m := gameMap{
		Cols:    WIDTH,
		Rows:    HEIGHT,
		CamCols: CAM_WIDTH,
		CamRows: CAM_HEIGHT,
	}
	m = m.generateVault()
	return m
}
