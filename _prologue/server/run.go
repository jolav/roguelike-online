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
	x           *rand.Rand
	counter     int
	gameOver    bool
	validAction bool
	pj          player
}
