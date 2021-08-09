/* */

package main

import (
	"math/rand"
	"time"
)

type run struct {
	Nick     string `json:"nick"`
	Token    string `json:"token"`
	GameOver bool   `json:"gameOver"`
	Turn     int    `json:"turn"`
	seed     int64
	counter  int
	Entities entities `json:"entities"`
	Map      gameMap  `json:"map"`
	fov      fieldOfVision
}

// RUN

func (r run) movePlayer(action string) bool {
	player := r.Entities[0]
	var dx, dy = 0, 0
	switch action {
	case "up":
		dy = -1
	case "down":
		dy = 1
	case "left":
		dx = -1
	case "right":
		dx = 1
	case "skip":
		return true
	}
	newX := player.Pos.X + dx
	newY := player.Pos.Y + dy
	if !r.Map.isBlocked(newX, newY) {
		player.move(dx, dy)
		return true
	}
	return false
}

func (r run) PopulateMap() point {
	var found = false
	pos := point{r.Map.Cols / 2, r.Map.Rows / 2}
	var tries = 0
	for !found && tries < 10000 {
		x := randomInt(1, r.Map.Cols-2)
		y := randomInt(1, r.Map.Rows-2)
		if !r.Map.isBlocked(x, y) && !r.Map.isBlockingLOS(x, y) {
			pos.X = x
			pos.Y = y
			found = true
		}
		tries++
	}
	player := newEntity("player", r.counter, pos)
	r.Entities[player.id] = &player
	return player.Pos
}

func newRun(c config) run {
	seed := time.Now().UnixNano()
	rand.Seed(seed)
	r := run{
		Nick:     getRandomNick(c.NickChars, c.NickIntegers),
		Token:    getRandomString(c.TokenLength),
		Turn:     0,
		GameOver: false,
		seed:     seed,
		counter:  0,
		Entities: entities{},
		Map:      newGameMap(),
		fov:      fieldOfVision{}.initFOV(),
	}
	playerPoint := r.PopulateMap()
	r.counter++
	r.fov.rayCast(r)
	r.Map.convertToCameraView(playerPoint)
	return r
}
