/* */

package main

import (
	"fmt"
	"log"
	"math/rand"
)

type run struct {
	nick        string
	token       string
	turn        int
	seed        int64
	issue       string
	rnd         *rand.Rand
	counter     int
	gameOver    bool
	validAction bool
	cam         camera
	pj          player
	zoneMap     zoneMap
	fov         fiedOfVision
}

type runSave struct {
	Nick        string
	Token       string
	Turn        int
	Seed        int64
	rnd         *rand.Rand // lowercase will no be exported/saved
	Counter     int
	GameOver    bool
	validAction bool
	Cam         camera
	Pj          player
	ZoneMap     zoneMap
	//fov         fiedOfVision
}

func (r run) save() {
	fmt.Println("saving run ...", r.token)
	r2 := &runSave{
		Nick:        r.nick,
		Token:       r.token,
		Turn:        r.turn,
		Seed:        r.seed,
		Counter:     r.counter,
		GameOver:    r.gameOver,
		validAction: r.validAction,
		Cam:         r.cam,
		Pj:          r.pj,
		ZoneMap:     r.zoneMap,
		//fov:         r.fov,
	}
	savePath := "./saves/" + r2.Token
	err := SaveJSON(savePath+".json", r2)
	if err != nil {
		log.Fatalln(err)
	}
}
