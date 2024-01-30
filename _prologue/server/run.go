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
	pj          player
	zoneMap     zoneMap
}
