/* */

package main

import "roguelike-online/_prologue/server/components"

func pathFinding(start, end components.Point) []components.Point {

	path := make([]components.Point, 0)
	return path
}

func convertDeltaToAction(dx, dy int) string {
	if dx == -1 && dy == -1 {
		return "UPLEFT"
	}
	if dx == 0 && dy == -1 {
		return "UP"
	}
	if dx == 1 && dy == -1 {
		return "UPRIGHT"
	}
	if dx == -1 && dy == 0 {
		return "LEFT"
	}
	if dx == 1 && dy == 0 {
		return "RIGHT"
	}
	if dx == -1 && dy == 1 {
		return "DOWNLEFT"
	}
	if dx == 0 && dy == 1 {
		return "DOWN"
	}
	if dx == 1 && dy == 1 {
		return "DOWNRIGHT"
	}
	return "SKIP"
}
