/* */

package main

import (
	"roguelike-online/_prologue/server/components"
)

var movements = []string{
	"UP",
	"DOWN",
	"LEFT",
	"RIGHT",
	"UPRIGHT",
	"UPLEFT",
	"DOWNRIGHT",
	"DOWNLEFT",
}
var diagonalMovements = []string{
	"UPRIGHT",
	"UPLEFT",
	"DOWNRIGHT",
	"DOWNLEFT",
}

type player struct {
	components.Position `json:"pos"`
}

func (pj *player) action(action string, m zoneMap) bool {
	isAMovement := sliceContainsString(action, movements)
	if isAMovement {
		return pj.move(action, m)
	}
	return false
}

func (pj *player) move(action string, m zoneMap) bool {
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
	isDiagonal := sliceContainsString(action, diagonalMovements)
	if pj.tileIsWalkable(m) && !isDiagonal {
		pj.Actual = pj.Target
		return true
	}
	if isDiagonal && pj.diagonalDontDisturb(action, m) && pj.tileIsWalkable(m) {
		pj.Actual = pj.Target
		return true
	}
	pj.Target = pj.Actual
	return false
}

func (pj *player) diagonalDontDisturb(action string, m zoneMap) bool {
	switch action {
	case "UPRIGHT":
		if !m.tiles[pj.Actual.Y-1][pj.Actual.X].Walkable {
			return false
		}
		if !m.tiles[pj.Actual.Y][pj.Actual.X+1].Walkable {
			return false
		}
	case "DOWNRIGHT":
		if !m.tiles[pj.Actual.Y+1][pj.Actual.X].Walkable {
			return false
		}
		if !m.tiles[pj.Actual.Y][pj.Actual.X+1].Walkable {
			return false
		}
	case "DOWNLEFT":
		if !m.tiles[pj.Actual.Y+1][pj.Actual.X].Walkable {
			return false
		}
		if !m.tiles[pj.Actual.Y][pj.Actual.X-1].Walkable {
			return false
		}
	case "UPLEFT":
		if !m.tiles[pj.Actual.Y-1][pj.Actual.X].Walkable {
			return false
		}
		if !m.tiles[pj.Actual.Y][pj.Actual.X-1].Walkable {
			return false
		}
	}
	return true
}

func (pj *player) tileIsWalkable(m zoneMap) bool {
	can := false
	if m.tiles[pj.Target.Y][pj.Target.X].Walkable {
		can = true
	}
	return can
}

func newPlayer() *player {
	pj := &player{
		components.Position{
			Actual: components.Point{
				X: 5,
				Y: 5,
			},
			Target: components.Point{
				X: 5,
				Y: 5,
			},
		},
	}
	return pj
}
