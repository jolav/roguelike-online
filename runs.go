/* */

package main

import (
	"math/rand"
	"time"
)

type runs map[string]run

type run struct {
	Nick     string `json:"nick"`
	Token    string `json:"token"`
	GameOver bool   `json:"gameOver"`
	Seed     int64  `json:"-"`
}

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
	}
	rs[r.Token] = r
	return r
}
