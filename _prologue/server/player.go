/* */

package main

import (
	"roguelike-online/_prologue/server/components"
)

var movements = []string{"UP", "DOWN", "LEFT", "RIGHT", "UPRIGHT", "UPLEFT", "DOWNRIGHT", "DOWNLEFT"}

type player struct {
	components.Position `json:"pos"`
}

func (pj *player) action(action string) bool {
	isAMovement := sliceContainsString(action, movements)
	if isAMovement {
		pj.move(action)
	}
	return true
}

func (pj *player) move(action string) {
	switch action {
	case "UP":
		pj.Target.Y--
	case "UPRIGHT":
		pj.Target.X++
		pj.Target.Y--
	case "RIGHT":
		pj.Target.X++
	case "DOWNRIGHT":
		pj.Target.X++
		pj.Target.Y++
	case "DOWN":
		pj.Target.Y++
	case "DOWNLEFT":
		pj.Target.X--
		pj.Target.Y++
	case "LEFT":
		pj.Target.X--
	case "UPLEFT":
		pj.Target.X--
		pj.Target.Y--
	}
	pj.Actual = pj.Target
}

func newPlayer() *player {
	pj := &player{
		components.Position{
			Actual: components.Point{
				X: 0,
				Y: 0,
			},
			Target: components.Point{
				X: 0,
				Y: 0,
			},
		},
	}
	return pj
}
