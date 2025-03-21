/* */

package main

import (
	"errors"
	"fmt"
	"math/rand"
	"net/http"
	"prologue/action"
	"prologue/ecs"
	"prologue/ecs/comps"
	"prologue/lib"
	"prologue/mapa"
	"strconv"
	"strings"
	"time"
)

func (a app) NewRun(re *http.Request) (*Run, string, int) {
	re.ParseForm()
	nick := strings.ToUpper(re.Form.Get("nick"))
	if nick == "" {
		return &Run{}, "Nick is Empty", http.StatusBadRequest
	}
	if !lib.IsAlphanumeric(nick) {
		return &Run{}, "Nick contains invalid characters", http.StatusBadRequest
	}
	token, err := lib.GenerateUUID()
	if err != nil {
		return &Run{}, "Internal error server", http.StatusInternalServerError
	}

	seed := time.Now().UnixNano()
	//fmt.Println("SEED=", seed)
	if a.Sys.Mode == "dev" {
		//seed = int64(1234567890)
	}

	colsString := re.Form.Get("cols")
	rowsString := re.Form.Get("rows")
	cols, err := strconv.Atoi(colsString)
	rows, err := strconv.Atoi(rowsString)
	if cols < 3 || cols > 156 || rows < 3 || rows > 90 {
		err = errors.New("ERROR")
	}
	if err != nil {
		return &Run{}, "Invalid parameters cols,rows", http.StatusBadRequest
	}

	var r = new(Run)
	// Info
	r.Info.Nick = nick
	r.Info.Token = token
	r.Info.Seed = seed
	r.Info.IP = lib.GetIP(re)
	r.Info.Created = time.Now()
	// Control
	r.Control.Counter = 0
	r.Control.Turn = 0
	r.Control.LastTurn = time.Now()
	// Core
	r.Rnd = rand.New(rand.NewSource(seed))
	r.Level = mapa.NewLevel(r.Rnd, cols, rows, 1)
	r.Actions = action.NewActions()
	r.Ecs = *ecs.NewECS()
	r.Ecs = populate(*r)
	player := r.Ecs.GetEntitiesWithTag("player")[0]
	es := r.Ecs.GetEntitiesWithTag("on")
	r.Queue = action.NewQueue(es, player, r.Rnd)
	r.Camera = newCamera(cols, rows)
	r.Fov = fieldOfVision{}.initFOV()

	a.Runs.add(*r)
	return r, "", http.StatusOK
}

func populate(r Run) ecs.ECS {
	esPoints := []mapa.Point{}
	// dummy
	dummy := r.Ecs.NewEntity()
	r.Ecs.Healths.AddComponent(dummy, comps.Health{MaxHp: 2, CurrentHP: 2})
	r.Ecs.Infos.AddComponent(dummy, comps.Info{Name: "ddd", Type: "dummy"})

	// player
	player := r.Ecs.NewEntity()
	current := r.Level.RandomWalkableUnoccupiedTile(esPoints, r.Rnd)
	//current = mapa.Point{X: len(r.Level) / 2, Y: len(r.Level[0]) / 2}
	r.Ecs.Infos.AddComponent(player, comps.Info{Name: r.Info.Nick, Type: "player"})
	r.Ecs.Positions.AddComponent(player, comps.Position{Current: current, OnMap: current})
	esPoints = append(esPoints, mapa.Point{X: current.X, Y: current.Y})
	r.Ecs.Healths.AddComponent(player, comps.Health{MaxHp: 50, CurrentHP: 45})
	r.Ecs.AddTag(player, "player")
	r.Ecs.AddTag(player, "visible")
	r.Ecs.AddTag(player, "on")

	for range 45 {
		r, esPoints = addCreature("rat", r, esPoints)
	}

	return r.Ecs
}

func addCreature(name string, r Run, esPoints []mapa.Point) (Run, []mapa.Point) {
	creature := r.Ecs.NewEntity()
	current := r.Level.RandomWalkableUnoccupiedTile(esPoints, r.Rnd)
	esPoints = append(esPoints, mapa.Point{X: current.X, Y: current.Y})
	r.Ecs.Positions.AddComponent(creature, comps.Position{Current: current, OnMap: current})
	r.Ecs.Infos.AddComponent(creature, comps.Info{Name: name + fmt.Sprint(creature), Type: name})
	r.Ecs.Healths.AddComponent(creature, comps.Health{MaxHp: 20, CurrentHP: 20})
	r.Ecs.AddTag(creature, "creature")
	r.Ecs.AddTag(creature, "visible")
	r.Ecs.AddTag(creature, "on")
	return r, esPoints
}
