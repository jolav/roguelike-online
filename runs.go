/* */

package main

import (
	"math/rand"
	"time"
)

type runs map[string]run

type run struct {
	Nick     string   `json:"nick"`
	Token    string   `json:"token"`
	GameOver bool     `json:"gameOver"`
	Seed     int64    `json:"-"`
	Counter  int      `json:"-"`
	Entities entities `json:"entities"`
}

// RUN

func (r run) movePlayer(action string) {
	player := r.Entities[0]
	switch action {
	case "up":
		player.Pos = r.Entities[0].move(0, -1)
	case "down":
		player.Pos = r.Entities[0].move(0, 1)
	case "left":
		player.Pos = r.Entities[0].move(-1, 0)
	case "right":
		player.Pos = r.Entities[0].move(1, 0)
	}
	r.Entities[0] = player
}

// RUNS

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
		Nick:     getRandomNick(c.NickChars, c.NickIntegers),
		Token:    getRandomString(c.TokenLength),
		GameOver: false,
		Seed:     seed,
		Counter:  0,
		Entities: entities{},
	}
	// Create player
	player := newEntity("player", r.Counter, point{0, 0})
	r.Entities[player.ID] = player
	r.Counter++

	rs[r.Token] = r
	return r
}
