/* */

package action

import (
	"math/rand"
	"prologue/ecs/comps"
	"prologue/lib"
	"prologue/mapa"
	"sort"
)

func GetRandomMovement(x *rand.Rand) string {
	return movements[lib.RandomInt(0, 7, x)]
}

type Options []Option

type Option struct {
	Action   string
	distance float64
}

func AssaultMove(pos, posPJ mapa.Point) Options {
	ops := Options{
		{"LEFT",
			mapa.EuclideanDistance(posPJ, mapa.Point{X: pos.X - 1, Y: pos.Y})},
		{"RIGHT",
			mapa.EuclideanDistance(posPJ, mapa.Point{X: pos.X + 1, Y: pos.Y})},
		{"UP",
			mapa.EuclideanDistance(posPJ, mapa.Point{X: pos.X, Y: pos.Y - 1})},
		{"DOWN",
			mapa.EuclideanDistance(posPJ, mapa.Point{X: pos.X, Y: pos.Y + 1})},
		{"DOWNLEFT",
			mapa.EuclideanDistance(posPJ, mapa.Point{X: pos.X - 1, Y: pos.Y + 1})},
		{"DOWNRIGHT",
			mapa.EuclideanDistance(posPJ, mapa.Point{X: pos.X + 1, Y: pos.Y + 1})},
		{"UPLEFT",
			mapa.EuclideanDistance(posPJ, mapa.Point{X: pos.X - 1, Y: pos.Y - 1})},
		{"UPRIGHT",
			mapa.EuclideanDistance(posPJ, mapa.Point{X: pos.X + 1, Y: pos.Y - 1})},
	}
	sort.Slice(ops, func(i, j int) bool {
		return ops[i].distance < ops[j].distance
	})
	return ops
}

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
