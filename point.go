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

func (p point) getEntityBlocking(es entities) (bool, *entity) {
	for _, e := range es {
		if e.Pos == p && e.isBlocking() {
			return true, e
		}
	}
	return false, nil
}

func (p point) isInside(grid [][]int) (int, bool) {
	if p.X < 0 || p.X >= len(grid) {
		return 0, false
	}
	if p.Y < 0 || p.Y >= len(grid[p.X]) {
		return 0, false
	}
	return grid[p.X][p.Y], true
}
