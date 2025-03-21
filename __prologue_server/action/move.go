/* */

package action

import (
	"prologue/ecs/comps"
	"prologue/mapa"
)

func TryMove(task string, eID int, lvl mapa.Level, es map[int]comps.Position) (mapa.Point, mapa.Point, bool) {
	points := []mapa.Point{}
	for k, v := range es {
		if k != eID {
			points = append(points, v.Current)
		}
	}

	pos := mapa.NewPoint(es[eID].Current.X, es[eID].Current.Y)
	onMap := pos
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
	if !lvl.IsWalkable(target) {
		return pos, onMap, false
	}
	if !lvl.IsEmpty(target, points) {
		return pos, onMap, false
	}
	if !IsDiagonalMovement(task) {
		return target, onMap, true
	}
	if canMoveDiagonal(task, lvl, pos) {
		return target, onMap, true
	}
	return pos, onMap, false
}

func canMoveDiagonal(task string, lvl mapa.Level, current mapa.Point) bool {
	switch task {
	case "UPRIGHT":
		if !lvl.IsWalkable(mapa.Point{X: current.X, Y: current.Y - 1}) {
			return false
		}
		if !lvl.IsWalkable(mapa.Point{X: current.X + 1, Y: current.Y}) {
			return false
		}
	case "DOWNRIGHT":
		if !lvl.IsWalkable(mapa.Point{X: current.X, Y: current.Y + 1}) {
			return false
		}
		if !lvl.IsWalkable(mapa.Point{X: current.X + 1, Y: current.Y}) {
			return false
		}
	case "DOWNLEFT":
		if !lvl.IsWalkable(mapa.Point{X: current.X, Y: current.Y + 1}) {
			return false
		}
		if !lvl.IsWalkable(mapa.Point{X: current.X - 1, Y: current.Y}) {
			return false
		}
	case "UPLEFT":
		if !lvl.IsWalkable(mapa.Point{X: current.X, Y: current.Y - 1}) {
			return false
		}
		if !lvl.IsWalkable(mapa.Point{X: current.X - 1, Y: current.Y}) {
			return false
		}
	}
	return true
}
