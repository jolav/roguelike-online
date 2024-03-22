/* */

package main

import (
	"math"
	"roguelike-online/_prologue/server/components"
)

func chebyshevDistance(p1, p2 components.Point) int {
	x := math.Abs(float64(p1.X) - float64(p2.X))
	y := math.Abs(float64(p1.Y) - float64(p2.Y))
	if x > y {
		return int(x)
	}
	return int(y)
}

func manHattanDistance(p1, p2 components.Point) int {
	x := math.Abs(float64(p1.X) - float64(p2.X))
	y := math.Abs(float64(p1.Y) - float64(p2.Y))
	return int(x + y)
}

func euclideanDistance(p1, p2 components.Point) float64 {
	dx := p1.X - p2.X
	dy := p1.Y - p2.Y
	return math.Sqrt(float64(dx*dx + dy*dy))
}
