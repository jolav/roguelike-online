/* */

package main

import (
	"math/rand"
	mymap "prologue/map"
	"time"
)

type Run struct {
	Info struct {
		Nick    string
		Token   string
		Seed    int64
		Created time.Time
		IP      string
	}
	Control struct {
		Turn     int64
		LastTurn time.Time
		Counter  int64
	}

	Rnd   *rand.Rand
	Level mymap.Level
}

func (r *Run) DoTurn(action string) {
	//fmt.Println(r.Control.Turn, " Action=>", action)
	r.Control.Turn++
}
