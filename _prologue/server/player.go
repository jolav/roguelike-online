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
	if pj.isTargetWalkable(m) && !isDiagonal {
		pj.Current = pj.Target
		return true
	}
	if isDiagonal && pj.canMoveDiagonal(action, m) && pj.isTargetWalkable(m) {
		pj.Current = pj.Target
		return true
	}
	pj.Target = pj.Current
	return false
}

func (pj *player) isTargetWalkable(m zoneMap) bool {
	can := false
	if m.tiles[pj.Target.Y][pj.Target.X].Walkable {
		can = true
	}
	return can
}

func (pj *player) canMoveDiagonal(action string, m zoneMap) bool {
	switch action {
	case "UPRIGHT":
		if !m.tiles[pj.Current.Y-1][pj.Current.X].Walkable {
			return false
		}
		if !m.tiles[pj.Current.Y][pj.Current.X+1].Walkable {
			return false
		}
	case "DOWNRIGHT":
		if !m.tiles[pj.Current.Y+1][pj.Current.X].Walkable {
			return false
		}
		if !m.tiles[pj.Current.Y][pj.Current.X+1].Walkable {
			return false
		}
	case "DOWNLEFT":
		if !m.tiles[pj.Current.Y+1][pj.Current.X].Walkable {
			return false
		}
		if !m.tiles[pj.Current.Y][pj.Current.X-1].Walkable {
			return false
		}
	case "UPLEFT":
		if !m.tiles[pj.Current.Y-1][pj.Current.X].Walkable {
			return false
		}
		if !m.tiles[pj.Current.Y][pj.Current.X-1].Walkable {
			return false
		}
	}
	return true
}

func newPlayer(m zoneMap) *player {
	var x = len(m.tiles[0]) / 2
	var y = len(m.tiles) / 2
	pj := &player{
		components.Position{
			Current: components.Point{
				X: x,
				Y: y,
			},
			Target: components.Point{
				X: x,
				Y: y,
			},
			View: components.Point{
				X: -1,
				Y: -1,
			},
		},
	}
	return pj
}
