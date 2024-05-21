/* */

package main

type camera struct {
	Cols int
	Rows int
}

func newCamera(cols, rows int) camera {
	cam := camera{
		Cols: cols,
		Rows: rows,
	}
	return cam
}
