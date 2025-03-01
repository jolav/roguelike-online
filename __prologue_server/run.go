/* */

package main

import (
	"math/rand"
	"prologue/ecs"
	"prologue/mapa"
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
	Level mapa.Level
	Ecs   ecs.ECS
}

func (r *Run) DoTurn(action string) {
	//fmt.Println(r.Control.Turn, " Action=>", action)
	r.Control.Turn++
}
