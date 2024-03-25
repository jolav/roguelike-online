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
	for x := 0; x < r.zoneMap.K.COLS; x++ {
		for y := 0; y < r.zoneMap.K.ROWS; y++ {
			r.zoneMap.Tiles[x][y].Visible = true // see all map to see bugs
			//r.zoneMap.Tiles[x][y].Visible = false
		}
	}
	// mark player
	var pX, pY = r.pj.Current.X, r.pj.Current.Y
	r.zoneMap.Tiles[pX][pY].Explored = true
	r.zoneMap.Tiles[pX][pY].Visible = true

	losLength := r.fov.losRadius

	for i := 0; i < 360; i++ {
		x := float64(pX)
		y := float64(pY)

		for z := 0; z < losLength; z++ {
			x += f.sin[i]
			y += f.cos[i]
			roundedX := int(round(x))
			roundedY := int(round(y))
			if x < 0 || x > float64(r.zoneMap.K.COLS-1) ||
				y < 0 || y > float64(r.zoneMap.K.ROWS-1) {
				break
			}
			r.zoneMap.Tiles[roundedX][roundedY].Explored = true
			r.zoneMap.Tiles[roundedX][roundedY].Visible = true
			if r.zoneMap.Tiles[roundedX][roundedY].BlockLOS {
				break
			}
		}
	}
}

func round(f float64) float64 {
	return math.Floor(f + .5)
}
