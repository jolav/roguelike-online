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

	Rnd     *rand.Rand
	Level   mapa.Level
	Ecs     ecs.ECS
	Actions action.Actions
}

func (r *Run) DoTurn(task string) {
	//fmt.Println(r.Control.Turn, " Action=>", task)
	r.Actions.Clean()
	eID := r.Ecs.GetEntitiesWithTag("player")[0]
	taskType := action.GetType(task)
	switch taskType {
	case "MOVE":
		r.DoMove(task, eID)
		return
	case "SKIP":
		r.Control.Turn++
		return
	}
}

func (r *Run) DoMove(task string, eID int) {
	positions := r.Ecs.Positions.Components
	current, onmap, moved := action.TryMove(task, eID, r.Level, positions)
	newPos := comps.Position{Current: current, OnMap: onmap}
	r.Ecs.Positions.RemoveComponent(eID)
	r.Ecs.Positions.AddComponent(eID, newPos)
	if !moved {
		return
	}
	actionDone := action.Action{
		Type:   "move",
		ID:     eID,
		Target: current,
	}
	r.Actions.Add(actionDone)
	r.Control.Turn++
}
