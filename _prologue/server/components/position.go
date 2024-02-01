/* */

package components

type Position struct {
	Actual Point `json:"now"`
	Target Point `json:"-"`
}

/*func NewPosition(P Point) Position {
	pos := Position{}
	return pos
}*/
