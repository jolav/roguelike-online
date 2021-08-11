/* */

package main

import (
	"math/rand"
	"time"
)

type runs map[string]*run

func (rs runs) delete(token string) {
	if rs.exists(token) {
		delete(rs, token)
	}
}

func (rs runs) exists(token string) bool {
	_, ok := rs[token]
	if ok {
		return true
	}
	return false
}

func (rs runs) newRun(c config) run {
	seed := time.Now().UnixNano()
	rand.Seed(seed)
	r := run{
		Nick:           getRandomNick(c.NickChars, c.NickIntegers),
		Token:          getRandomString(c.TokenLength),
		Turn:           0,
		GameOver:       false,
		seed:           seed,
		counter:        0,
		entities:       entities{},
		PublicEntities: make([]entity, 0),
		Map:            newGameMap(),
		fov:            fieldOfVision{}.initFOV(),
	}
	playerPoint, counter := r.PopulateMap()
	r.counter = counter
	r.fov.rayCast(r)
	r.Map.Camera = r.Map.buildView(playerPoint)
	r.PublicEntities = r.createPublicEntities()
	return r
}
