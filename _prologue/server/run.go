/* */

package main

import (
	"math/rand"
	"roguelike-online/_prologue/server/components"
)

const (
	maxNPC   int = 10
	maxTRIES int = 5000
)

type run struct {
	nick        string
	token       string
	turn        int
	seed        int64
	issue       string
	rnd         *rand.Rand
	counter     int
	gameOver    bool
	validAction bool
	cam         camera
	pj          player
	entities    entities
	zoneMap     zoneMap
	fov         fiedOfVision
}

type runSave struct {
	Nick        string
	Token       string
	Turn        int
	Seed        int64
	rnd         *rand.Rand // lowercase will no be exported/saved
	Counter     int
	GameOver    bool
	validAction bool
	Cam         camera
	Pj          player
	Entities    entities
	ZoneMap     zoneMap
	//fov         fiedOfVision
}

func (r run) populateMap() int {
	var success int = 0
	var p components.Point
	var p0 = components.Point{X: 0, Y: 0}
	for tries := 1; tries < maxTRIES; tries++ {
		p = r.randomEmptyPoint()
		if p != p0 {
			e := newEntity(p, r.counter)
			r.entities[e.Id] = e
			r.counter++
			success++
		}
		if success >= maxNPC {
			return r.counter
		}
	}
	return r.counter
}

func (r run) randomEmptyPoint() components.Point {
	var p = components.Point{X: 0, Y: 0}
	var found = false
	var tries int = 1
	for !found && tries < maxTRIES {
		x := randomInt(1, r.zoneMap.K.COLS-2, *r.rnd)
		y := randomInt(1, r.zoneMap.K.ROWS-2, *r.rnd)
		if r.zoneMap.isWalkable(x, y) {
			p.X = x
			p.Y = y
			if len(r.entities.atPoint(p)) == 0 {
				found = true
			}
		}
		tries++
	}
	return p
}
