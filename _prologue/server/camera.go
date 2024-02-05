/* */

package main

import (
	"roguelike-online/_prologue/server/components"
)

type camera struct {
	//pos Point
	components.Point
	cols int
	rows int
}

func (cam camera) updateCam(r run) camera {
	m := r.zoneMap
	pj := r.pj
	rows := len(m.tiles)
	cols := len(m.tiles[0])

	cam.X = pj.Current.X - (cam.cols / 2)
	cam.Y = pj.Current.Y - (cam.rows / 2)

	if cam.X+cam.cols > cols {
		cam.X = cols - cam.cols
	}
	if cam.X < 0 {
		cam.X = 0
	}

	if cam.Y+cam.rows > rows {
		cam.Y = rows - cam.rows
	}
	if cam.Y < 0 {
		cam.Y = 0
	}
	return cam
}

func newCamera(cols, rows int) *camera {
	cam := &camera{
		/*pos: components.Point{
			X: 0,
			Y: 0,
		},*/
		Point: components.Point{
			X: 0,
			Y: 0,
		},
		cols: cols,
		rows: rows,
	}
	return cam
}
