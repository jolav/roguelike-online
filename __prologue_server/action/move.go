/* */

package action

import (
	"prologue/ecs/comps"
	"prologue/mapa"
	"slices"
)

// type move struct{}
var diagonalMovements = []string{
	"UPRIGHT",
	"UPLEFT",
	"DOWNRIGHT",
	"DOWNLEFT",
}

func DoMove(task string, eID int, lvl mapa.Level, es map[int]comps.Position) mapa.Point {
	//fmt.Println(task)
	//fmt.Println("Player pos", es[eID].Current)
	pos := mapa.NewPoint(es[eID].Current.X, es[eID].Current.Y)
	target := pos

	switch task {
	case "UP":
		target.Y--
	case "UPRIGHT":
		target.X++
		target.Y--
	case "RIGHT":
		target.X++
	case "DOWNRIGHT":
		target.X++
		target.Y++
	case "DOWN":
		target.Y++
	case "DOWNLEFT":
		target.X--
		target.Y++
	case "LEFT":
		target.X--
	case "UPLEFT":
		target.X--
		target.Y--
	}
	//fmt.Println(pos, task, target)
	if !lvl.IsWalkable(target.X, target.Y) {
		return pos
	}
	isDiagonal := slices.Contains(diagonalMovements, task)
	if lvl.IsWalkable(target.X, target.Y) && !isDiagonal {
		return target
	}
	if isDiagonal && canMoveDiagonal(task, lvl, pos) && lvl.IsWalkable(target.X, target.Y) {
		return target
	}
	return pos
}

func canMoveDiagonal(task string, lvl mapa.Level, current mapa.Point) bool {
	switch task {
	case "UPRIGHT":
		if !lvl.IsWalkable(current.X, current.Y-1) {
			return false
		}
		if !lvl.IsWalkable(current.X+1, current.Y) {
			return false
		}
	case "DOWNRIGHT":
		if !lvl.IsWalkable(current.X, current.Y+1) {
			return false
		}
		if !lvl.IsWalkable(current.X+1, current.Y) {
			return false
		}
	case "DOWNLEFT":
		if !lvl.IsWalkable(current.X, current.Y+1) {
			return false
		}
		if !lvl.IsWalkable(current.X-1, current.Y) {
			return false
		}
	case "UPLEFT":
		if !lvl.IsWalkable(current.X, current.Y-1) {
			return false
		}
		if !lvl.IsWalkable(current.X-1, current.Y) {
			return false
		}
	}
	return true
}
