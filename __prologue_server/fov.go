/* */

package main

import (
	"math"
	"prologue/lib"
)

type fieldOfVision struct {
	sin map[int]float64
	cos map[int]float64
}

func (f fieldOfVision) initFOV() fieldOfVision {
	f.cos = make(map[int]float64)
	f.sin = make(map[int]float64)

	for i := range 360 {
		ax := math.Sin(float64(i) / (float64(180) / math.Pi))
		ay := math.Cos(float64(i) / (float64(180) / math.Pi))
		f.sin[i] = ax
		f.cos[i] = ay
	}
	return f
}

func (f fieldOfVision) rayCast(r Run, losRadius int) {
	cols := len(r.Level)
	rows := len(r.Level[0])
	// clean map
	for x := range cols {
		for y := range rows {
			//r.Level[x][y].Visible = true // see all map to see bugs
			r.Level[x][y].Visible = false
		}
	}
	// mark player
	pjID := r.Ecs.GetEntitiesWithTag("player")[0]
	player, _ := r.Ecs.Positions.GetComponent(pjID)
	var pX, pY = player.Current.GetCoords()
	r.Level[pX][pY].Explored = true
	r.Level[pX][pY].Visible = true

	for i := 0; i < 360; i++ {
		x := float64(pX)
		y := float64(pY)

		for z := 0; z < losRadius; z++ {
			x += f.sin[i]
			y += f.cos[i]
			roundedX := int(lib.RoundFloat(x))
			roundedY := int(lib.RoundFloat(y))
			if x < 0 || x > float64(cols-1) || y < 0 || y > float64(rows-1) {
				break
			}
			r.Level[roundedX][roundedY].Explored = true
			r.Level[roundedX][roundedY].Visible = true
			if r.Level.IsBlockingLOS(roundedX, roundedY) {
				break
			}
		}
	}
}
