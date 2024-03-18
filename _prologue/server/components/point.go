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
