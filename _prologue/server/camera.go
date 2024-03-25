/* */

package main

import (
	"roguelike-online/_prologue/server/components"
)

type camera struct {
	//pos Point
	components.Point
	Cols int
	Rows int
}

func (cam camera) updateCam(r run) camera {
	m := r.zoneMap
	pj := r.pj
	Cols := len(m.Tiles)
	Rows := len(m.Tiles[0])

	cam.X = pj.Current.X - (cam.Cols / 2)
	cam.Y = pj.Current.Y - (cam.Rows / 2)

	if cam.X+cam.Cols > Cols {
		cam.X = Cols - cam.Cols
	}
	if cam.X < 0 {
		cam.X = 0
	}

	if cam.Y+cam.Rows > Rows {
		cam.Y = Rows - cam.Rows
	}
	if cam.Y < 0 {
		cam.Y = 0
	}
	return cam
}

func newCamera(Cols, Rows int) *camera {
	cam := &camera{
		/*pos: components.Point{
			X: 0,
			Y: 0,
		},*/
		Point: components.Point{
			X: 0,
			Y: 0,
		},
		Cols: Cols,
		Rows: Rows,
	}
	return cam
}
