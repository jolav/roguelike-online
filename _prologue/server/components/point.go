/* */

package components

type Point struct {
	X int `json:"x"`
	Y int `json:"y"`
}

func NewPoint(x, y int) Point {
	p := Point{x, y}
	return p
}

func (p Point) IsInside(grid [][]int) (int, bool) {
	if p.X < 0 || p.X >= len(grid) {
		return 0, false
	}
	if p.Y < 0 || p.Y >= len(grid[p.X]) {
		return 0, false
	}
	return grid[p.X][p.Y], true
}

func (p Point) Add(c Point) Point {
	p.X += c.X
	p.Y += c.Y
	return p
}
