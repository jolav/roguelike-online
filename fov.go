/* */

package main

import (
	"math"
)

const (
	losRadius = 8
)

type fieldOfVision struct {
	sin       map[int]float64
	cos       map[int]float64
	losRadius int
}

func (f fieldOfVision) initFOV() fieldOfVision {
	f.cos = make(map[int]float64)
	f.sin = make(map[int]float64)

	for i := 0; i < 360; i++ {
		ax := math.Sin(float64(i) / (float64(180) / math.Pi))
		ay := math.Cos(float64(i) / (float64(180) / math.Pi))
		f.sin[i] = ax
		f.cos[i] = ay
	}
	f.losRadius = losRadius
	return f
}

func (f fieldOfVision) rayCast(r run) {
	// clean map
	for y := 0; y < r.Map.Cols; y++ {
		for x := 0; x < r.Map.Rows; x++ {
			//r.Map.tiles[y][x].Visible = true // see all map to see bugs
			r.Map.tiles[y][x].Visible = false
		}
	}
	// mark player
	player := r.Entities[0]
	var pX, pY = player.Pos.getCoords()
	r.Map.tiles[pY][pX].Explored = true
	r.Map.tiles[pY][pX].Visible = true

	losLength := r.fov.losRadius
	arcL := 135
	arcR := 225
	switch player.Facing {
	case 'N':
	case 'E':
		arcL = 45
		arcR = 135
	case 'S':
		arcL = 315
		arcR = 45
	case 'W':
		arcL = 225
		arcR = 315
	}

	for i := 0; i < 360; i++ {
		x := float64(pX)
		y := float64(pY)

		if (i >= arcL && i <= arcR) ||
			(i >= 315 && arcR <= 45 || arcL >= 315 && i <= 45) {
			losLength = r.fov.losRadius
			/*} else if (i > arcR && i < 270) || (i < arcL && i > 90) {
			losLength = 2
			*/
		} else {
			losLength = losRadius // 2
		}

		for z := 0; z < losLength; z++ {
			x += f.sin[i]
			y += f.cos[i]
			roundedX := int(round(x))
			roundedY := int(round(y))
			if x < 0 || x > float64(r.Map.Cols-1) ||
				y < 0 || y > float64(r.Map.Rows-1) {
				break
			}
			r.Map.tiles[roundedY][roundedX].Explored = true
			r.Map.tiles[roundedY][roundedX].Visible = true
			if r.Map.isBlockingLOS(roundedX, roundedY) {
				break
			}
		}
	}
}
