/* */

package main

import (
	"math/rand"
	"prologue/action"
	"prologue/ecs"
	"prologue/ecs/comps"
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

func (r *Run) DoTurn(task string) {
	//fmt.Println(r.Control.Turn, " Action=>", task)
	positions := r.Ecs.Positions.Components //(&r.Ecs, "position")
	esPoints := []mapa.Point{}
	for _, v := range positions {
		esPoints = append(esPoints, v.Current)
	}
	target := action.DoMove(task, 2, r.Level, positions)
	newPos := comps.Position{Current: target}
	r.Ecs.Positions.RemoveComponent(2)
	r.Ecs.Positions.AddComponent(2, newPos)
	r.Control.Turn++
}
