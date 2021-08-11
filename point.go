/* */

package main

type point struct {
	X int
	Y int
}

func (p point) getCoords() (x, y int) {
	return p.X, p.Y
}

func (p point) add(c point) point {
	p.X += c.X
	p.Y += c.Y
	return p
}

func (p point) isAnyEntityBlocking(es entities) bool {
	for _, e := range es {
		if e.Pos == p && e.isBlocking() {
			return true
		}
	}
	return false
}
