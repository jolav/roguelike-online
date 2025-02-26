/* */

package comps

type Point struct {
	X int
	Y int
}

func NewPoint(x, y int) Point {
	return Point{
		X: x,
		Y: y,
	}
}

func (p Point) GetCoords() (x, y int) {
	return p.X, p.Y
}
