/* */

package main

import "roguelike-online/_prologue/server/components"

type camera struct {
	//pos Point
	components.Point
	cols int
	rows int
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
	//prettyPrintStruct(cam)
	return cam
}
