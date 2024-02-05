/* */

package components

type Position struct {
	Current Point `json:"-"`
	Target  Point `json:"-"`
	View    Point `json:"view"`
}

/*func NewPosition(P Point) Position {
	pos := Position{}
	return pos
}*/
