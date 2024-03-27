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

func (pj *player) action(action string, m zoneMap, es entities) bool {
	if action == "SKIP" {
		return true
	}
	isAMovement := sliceContainsString(action, movements)
	if isAMovement {
		return pj.move(action, m, es)
	}
	return false
}

func (pj *player) move(action string, m zoneMap, es entities) bool {
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
	if !es.isPointEmpty(pj.Target) {
		pj.Target = pj.Current
		return false
	}
	isDiagonal := sliceContainsString(action, diagonalMovements)
	if m.isWalkableP(pj.Target) && !isDiagonal {
		pj.Current = pj.Target
		return true
	}
	if isDiagonal && pj.canMoveDiagonal(action, m) && m.isWalkableP(pj.Target) {
		pj.Current = pj.Target
		return true
	}
	pj.Target = pj.Current
	return false
}

func (pj *player) canMoveDiagonal(action string, m zoneMap) bool {
	switch action {
	case "UPRIGHT":
		if !m.isWalkable(pj.Current.X, pj.Current.Y-1) {
			return false
		}
		if !m.isWalkable(pj.Current.X+1, pj.Current.Y) {
			return false
		}
	case "DOWNRIGHT":
		if !m.isWalkable(pj.Current.X, pj.Current.Y+1) {
			return false
		}
		if !m.isWalkable(pj.Current.X+1, pj.Current.Y) {
			return false
		}
	case "DOWNLEFT":
		if !m.isWalkable(pj.Current.X, pj.Current.Y+1) {
			return false
		}
		if !m.isWalkable(pj.Current.X-1, pj.Current.Y) {
			return false
		}
	case "UPLEFT":
		if !m.isWalkable(pj.Current.X, pj.Current.Y-1) {
			return false
		}
		if !m.isWalkable(pj.Current.X-1, pj.Current.Y) {
			return false
		}
	}
	return true
}

func newPlayer(m zoneMap) *player {
	var x = len(m.Tiles) / 2
	var y = len(m.Tiles[0]) / 2
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
