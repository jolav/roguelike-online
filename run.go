/* */

package main

import (
	"math/rand"
	"time"
)

type run struct {
	Nick     string   `json:"nick"`
	Token    string   `json:"token"`
	GameOver bool     `json:"gameOver"`
	Turn     int      `json:"turn"`
	Seed     int64    `json:"-"`
	Counter  int      `json:"-"`
	Entities entities `json:"entities"`
	Map      gameMap  `json:"map"`
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
	centerPos := point{r.Map.Cols / 2, r.Map.Rows / 2}
	player := newEntity("player", r.Counter, centerPos)
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
		Seed:     seed,
		Counter:  0,
		Entities: entities{},
		Map:      newGameMap(),
	}
	playerPoint := r.PopulateMap()
	r.Counter++
	r.Map.convertToCameraView(playerPoint)

	return r
}
