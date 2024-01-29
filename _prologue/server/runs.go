/* */

package main

import (
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

func (rs runs) newRun(c config) *run {
	var seed = time.Now().UnixNano()
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
		x:           rand.New(rand.NewSource(seed)),
		counter:     0,
		gameOver:    false,
		validAction: true,
		pj:          *newPlayer(),
	}
	//prettyPrintStruct(r)
	return r
}
