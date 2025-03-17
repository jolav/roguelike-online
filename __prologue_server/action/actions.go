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

func (ac Actions) Add(a Action) Actions {
	return append(ac, a)
}

func (ac Actions) Clean() Actions {
	return make([]Action, 0)
}

func (ac Actions) Remove(ID int) Actions {
	result := make([]Action, 0)
	for _, a := range ac {
		if a.ID != ID {
			result = append(result, a)
		}
	}
	return result
}
