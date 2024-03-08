/* */

package components

type Position struct {
	Current Point `json:"current"`
	Target  Point `json:"target"`
	View    Point `json:"view"`
}

/*func NewPosition(P Point) Position {
	pos := Position{}
	return pos
}*/
