/* */

package main

import "math"

type fiedOfVision struct {
	sin       map[int]float64
	cos       map[int]float64
	losRadius int
}

func (f fiedOfVision) initFOV() fiedOfVision {
	f.cos = make(map[int]float64)
	f.sin = make(map[int]float64)

	for i := 0; i < 360; i++ {
		ax := math.Sin(float64(i) / (float64(180) / math.Pi))
		ay := math.Cos(float64(i) / (float64(180) / math.Pi))
		f.sin[i] = ax
		f.cos[i] = ay
	}
	f.losRadius = 20 //change this to pj
	return f
}

func (f fiedOfVision) rayCast(r run) {
	// clean map
	for y := 0; y < r.zoneMap.k.ROWS; y++ {
		for x := 0; x < r.zoneMap.k.COLS; x++ {
			r.zoneMap.tiles[y][x].Visible = true // see all map to see bugs
			//r.zoneMap.tiles[y][x].Visible = false
		}
	}
	// mark player
	var pX, pY = r.pj.Current.X, r.pj.Current.Y
	r.zoneMap.tiles[pY][pX].Explored = true
	r.zoneMap.tiles[pY][pX].Visible = true

	losLength := r.fov.losRadius

	for i := 0; i < 360; i++ {
		x := float64(pX)
		y := float64(pY)

		for z := 0; z < losLength; z++ {
			x += f.sin[i]
			y += f.cos[i]
			roundedX := int(round(x))
			roundedY := int(round(y))
			if x < 0 || x > float64(r.zoneMap.k.COLS-1) ||
				y < 0 || y > float64(r.zoneMap.k.ROWS-1) {
				break
			}
			r.zoneMap.tiles[roundedY][roundedX].Explored = true
			r.zoneMap.tiles[roundedY][roundedX].Visible = true
			if r.zoneMap.tiles[roundedY][roundedX].BlockLOS {
				break
			}
		}
	}
}

func round(f float64) float64 {
	return math.Floor(f + .5)
}
