/* */

package mapa

import "math"

func createMapAndfillWith(cols, rows int, fill string) Level {
	lvl := make([][]Tile, cols)
	for i := range lvl {
		lvl[i] = make([]Tile, rows)
	}
	for x := range cols {
		for y := range rows {
			lvl[x][y] = Tile{}.create(fill)
		}
	}
	return lvl
}

func ChebyshevDistance(p1, p2 Point) int {
	x := math.Abs(float64(p1.X) - float64(p2.X))
	y := math.Abs(float64(p1.Y) - float64(p2.Y))
	if x > y {
		return int(x)
	}
	return int(y)
}

func ManHattanDistance(p1, p2 Point) int {
	x := math.Abs(float64(p1.X) - float64(p2.X))
	y := math.Abs(float64(p1.Y) - float64(p2.Y))
	return int(x + y)
}

func EuclideanDistance(p1, p2 Point) float64 {
	dx := p1.X - p2.X
	dy := p1.Y - p2.Y
	return math.Sqrt(float64(dx*dx + dy*dy))
}
