/* */

package main

import (
	"fmt"
	"log"
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

func (rs runs) newRun(c config, cols, rows int) *run {
	var seed = time.Now().UnixNano()
	fmt.Sprintln(seed)
	token, err := generateToken(c.TokenLength)
	if err != nil {
		log.Printf("ERROR generating Token %s\n", err)
		// run cant be created because not having token, now manage it
	}
	r := &run{
		nick:        randomNick(c.NickChars, c.NickIntegers, c.SurnameFile),
		token:       token,
		turn:        0,
		seed:        seed,
		rnd:         rand.New(rand.NewSource(1)),
		counter:     0,
		gameOver:    false,
		validAction: true,
		pj:          player{}, //*newPlayer(),
		zoneMap:     zoneMap{},
	}
	r.zoneMap = newGameMap(*r.rnd, cols, rows)
	r.pj = *newPlayer(r.zoneMap)
	/* COPIAR ESTE PATRON
	   https://github.com/jolav/roguelike-online/blob/63c888300f96575ee1acb24aa4f619b061c986ce/_prologue/server/run.js
	*/

	// center player
	//prettyPrintStruct(r)
	return r
}
