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

func (r run) entitiesTurn() {
	randomAction := [8]string{
		"UPLEFT", "UP", "UPRIGHT,",
		"LEFT", "RIGHT",
		"DOWNLEFT", "DOWN", "DOWNRIGHT",
	}
	for _, e := range r.entities {
		if e.isMobile() {
			if r.zoneMap.isVisible(e.Current.X, e.Current.Y) {
				path := pathFinding(e, r)
				//fmt.Println("PATH", len(path)) //, path)
				if len(path) > 0 {
					if path[1] == r.pj.Current {
						//fmt.Println("melee PJ")
					} else {
						dx := path[1].X - path[0].X
						dy := path[1].Y - path[0].Y
						action := convertDeltaToAction(dx, dy)
						e.move(action, r.zoneMap, r.entities)
					}
				}
			} else { // Random move when not visible
				odd := randomInt(0, 13, *r.rnd)
				if odd < 8 {
					action := randomAction[odd]
					e.move(action, r.zoneMap, r.entities)
				}
			}
		}
	}
}
