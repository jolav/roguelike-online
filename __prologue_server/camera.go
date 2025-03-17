/* */

package main

import (
	"prologue/mapa"
)

type camera struct {
	Pos  mapa.Point
	Cols int
	Rows int
}

func (cam camera) updateCam(r Run) camera {
	m := r.Level
	player := r.Ecs.GetEntitiesWithTag("player")[0]
	pj, _ := r.Ecs.Positions.GetComponent(player)
	Cols := len(m)
	Rows := len(m[0])

	cam.Pos.X = pj.Current.X - (cam.Cols / 2)
	cam.Pos.Y = pj.Current.Y - (cam.Rows / 2)

	if cam.Pos.X+cam.Cols > Cols {
		cam.Pos.X = Cols - cam.Cols
	}
	if cam.Pos.X < 0 {
		cam.Pos.X = 0
	}

	if cam.Pos.Y+cam.Rows > Rows {
		cam.Pos.Y = Rows - cam.Rows
	}
	if cam.Pos.Y < 0 {
		cam.Pos.Y = 0
	}
	return cam
}

func (cam camera) containsPoint(p mapa.Point) bool {
	if p.X < cam.Pos.X || p.Y < cam.Pos.Y {
		return false
	}
	if p.X > cam.Pos.X+cam.Cols || p.Y > cam.Pos.Y+cam.Rows {
		return false
	}

	return true
}

func newCamera(cols, rows int) camera {
	cam := camera{
		Pos: mapa.Point{
			X: 0,
			Y: 0,
		},
		Cols: cols,
		Rows: rows,
	}
	return cam
}
