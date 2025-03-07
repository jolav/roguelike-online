/* */

package action

import "prologue/mapa"

type Actions []Action

type Action struct {
	Type   string
	ID     int
	Target mapa.Point
}

func NewActions() Actions {
	return make([]Action, 0)
}

func (ac *Actions) Add(a Action) {
	*ac = append(*ac, a)
}

func (ac *Actions) Clean() {
	*ac = make([]Action, 0)
}
