/* */

package main

import (
	"math/rand"
)

type run struct {
	nick        string
	token       string
	turn        int
	seed        int64
	rnd         *rand.Rand
	counter     int
	gameOver    bool
	validAction bool
	cam         camera
	pj          player
	zoneMap     zoneMap
	fov         fiedOfVision
}
