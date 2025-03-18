/* */

package main

import (
	"log"
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
	Queue   action.Queue
	Actions action.Actions
	Camera  camera
	Fov     fieldOfVision
}

func (r *Run) TurnLoop(task string) {
	//fmt.Println(r.Control.Turn, " Action=>", task)
	r.Actions = r.Actions.Clean()
	playerID := r.Ecs.GetEntitiesWithTag("player")[0]
	done := r.doTask(playerID, task)
	if !done {
		return
	}
	tries := 0
	for tries < 100 {
		eID := r.Queue.Next()
		switch eID {
		case playerID:
			return
		case -1:
			r.UpdateTurn()
		default:
			_ = r.doTask(eID, "skip")
		}
		tries++
	}
}

func (r *Run) doTask(eID int, task string) bool {
	taskType := action.GetType(task)
	//fmt.Println("Action=>", eID, task, taskType)
	switch taskType {
	case "MOVE":
		done := r.DoMove(task, eID)
		if done {
			r.Queue = r.Queue.UpdateEntity(eID, 50)
			return true
		}
		return false
	case "SKIP":
		r.doSkip(eID)
		r.Queue = r.Queue.UpdateEntity(eID, 100)
		return true
	default:
		log.Printf("Unknown Task: %s\n", taskType)
		return false
	}
}

func (r *Run) UpdateTurn() {
	r.Control.Turn++
	r.Queue = r.Queue.UpdateTurn(100)
}

func (r *Run) DoMove(task string, eID int) bool {
	positions := r.Ecs.Positions.Components
	current, onmap, moved := action.TryMove(task, eID, r.Level, positions)
	newPos := comps.Position{Current: current, OnMap: onmap}
	r.Ecs.Positions.RemoveComponent(eID)
	r.Ecs.Positions.AddComponent(eID, newPos)
	if !moved {
		return false
	}
	actionDone := action.Action{
		Type:   "move",
		ID:     eID,
		Target: current,
	}

	// add actions only in LOS
	r.Actions = r.Actions.Add(actionDone)
	return true
}

func (r *Run) doSkip(eID int) {}
