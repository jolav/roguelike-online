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

func (rs runs) newRun(c config, camCols, camRows int) *run {
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
		rnd:         rand.New(rand.NewSource(seed)),
		counter:     0,
		gameOver:    false,
		validAction: true,
		cam:         *newCamera(camCols, camRows),
		pj:          player{},
		zoneMap:     zoneMap{},
		fov:         fiedOfVision{}.initFOV(),
	}
	r.zoneMap = newGameMap(*r.rnd, r.cam)
	r.pj = *newPlayer(r.zoneMap)
	r.fov.rayCast(*r)
	//prettyPrintStruct(r)
	return r
}

func (rs runs) loadRun(c config, camCols, camRows int, token string) *run {
	r2 := &runSave{}
	err := LoadJSON("./saves/"+token+".json", r2)
	if err != nil {
		fmt.Println("Error, Saved game doesnt exist")
		return &run{
			issue: "There is no such saved game",
		}
	}
	r := &run{
		nick:        r2.Nick,
		token:       r2.Token,
		turn:        r2.Turn,
		seed:        r2.Seed,
		rnd:         rand.New(rand.NewSource(r2.Seed)),
		counter:     r2.Counter,
		gameOver:    false,
		validAction: true,
		cam:         *newCamera(camCols, camRows),
		pj:          r2.Pj,
		zoneMap:     r2.ZoneMap,
		fov:         fiedOfVision{}.initFOV(),
	}
	//r.zoneMap = newGameMap(*r.rnd, r.cam)
	//r.pj = *newPlayer(r.zoneMap)
	r.fov.rayCast(*r)
	//prettyPrintStruct(r)
	return r
}
