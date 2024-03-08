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
	fmt.Sprintln(r2)
	err := Save("./saves/file.json", r2)
	if err != nil {
		log.Fatalln(err)
	}
	err = SaveGob("./saves/file.bin", r2)
	if err != nil {
		log.Fatalln(err)
	}
}

func load() {
	var r2 runSave
	err := Load("./saves/file.bin", r2)
	if err != nil {
		log.Fatalln(err)
	}
	r := &run{
		nick: r2.Nick,
	}
	fmt.Println("LOAD GAME FROM ...", r.nick)

}
