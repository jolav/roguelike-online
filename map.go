/* */

package main

const (
	CAM_WIDTH  int = 41
	CAM_HEIGHT int = 31
	WIDTH      int = 100 //25
	HEIGHT     int = 100 //21
)

type gameMap struct {
	Cols     int   `json:"totalCols"`
	Rows     int   `json:"totalRows"`
	ViewCols int   `json:"cols"`
	ViewRows int   `json:"rows"`
	Camera   point `json:"camera"`
	tiles    [][]tile
	View     [][]tile `json:"tiles"`
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

func (m gameMap) buildView(p point) point {
	var pjX, pjY = p.getCoords()
	var camera = point{0, 0}
	camera.X = pjX - (m.ViewCols / 2)
	camera.Y = pjY - (m.ViewRows / 2)
	if camera.X < 0 {
		camera.X = 0
	}
	if camera.X+m.ViewCols > m.Cols {
		camera.X = m.Cols - m.ViewCols
	}
	if camera.Y < 0 {
		camera.Y = 0
	}
	if camera.Y+m.ViewRows > m.Rows {
		camera.Y = m.Rows - m.ViewRows
	}
	for y := 0; y < m.ViewRows; y++ {
		for x := 0; x < m.ViewCols; x++ {
			if m.isExplored(x+camera.X, y+camera.Y) {
				m.View[y][x] = m.tiles[y+camera.Y][x+camera.X]
			} else {
				m.View[y][x] = tile{}.set("unknown")
			}
		}
	}
	return camera
}

func newGameMap() gameMap {
	m := gameMap{
		Cols:     WIDTH,
		Rows:     HEIGHT,
		ViewCols: CAM_WIDTH,
		ViewRows: CAM_HEIGHT,
	}
	m = m.generateVault()
	return m
}
