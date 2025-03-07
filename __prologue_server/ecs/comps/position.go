/* */

package comps

import "prologue/mapa"

type Position struct {
	Current mapa.Point
	OnMap   mapa.Point
}

func NewPosition(x, y int) Position {
	return Position{
		Current: mapa.NewPoint(x, y),
		OnMap:   mapa.NewPoint(x, y),
	}
}
