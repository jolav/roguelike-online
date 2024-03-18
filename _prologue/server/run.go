/* */

package main

import (
	"fmt"
	"math/rand"
	"roguelike-online/_prologue/server/components"
)

const (
	maxNPC   int = 60
	maxTRIES int = 10000
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

func (r run) populateMap() {
	fmt.Println(r.counter)
	//var success int = 0
	//var p components.Point
	/*for tries := 1; tries < maxTRIES; tries++ {

	}*/

}

func (r run) randomPoint() components.Point {
	var p components.Point
	var found = false
	var tries int = 1
	for !found && tries < maxTRIES {
		x := randomInt(1, r.zoneMap.K.COLS-2, *r.rnd)
		y := randomInt(1, r.zoneMap.K.ROWS-2, *r.rnd)
		//if !r.zoneMap.isBlocked(x, y) && !r.Map.isBlockingLOS(x, y) {
		p.X = x
		p.Y = y
		found = true
		//}
		tries++
	}
	return p
}
