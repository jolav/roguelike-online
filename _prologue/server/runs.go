/* */

package main

import (
	"fmt"
	"log"
	"math/rand"
	"time"
)

type runs map[string]*run

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
		pj:          *newPlayer(),
	}
	r.zoneMap = generateShelterLevelFitsScreen(*r.rnd, cols, rows)
	//prettyPrintStruct(r)
	return r
}
