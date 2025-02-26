/* */

package comps

type Position struct {
	Current Point
}

func NewPosition(x, y int) Position {
	return Position{
		Current: NewPoint(x, y),
	}
}
