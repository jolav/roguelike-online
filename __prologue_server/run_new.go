/* */

package main

import (
	"errors"
	"math/rand"
	"net/http"
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
	//fmt.Println("MAP=", cols, rows)
	if rows < 3 || rows > 150 || cols < 3 || cols > 300 {
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

	r.Rnd = rand.New(rand.NewSource(seed))
	r.Level = mapa.NewLevel("testRoom", r.Rnd, cols, rows)
	//r.Level = mapa.NewLevel("shelter", r.Rnd, cols, rows)

	r.Ecs = *ecs.NewECS()
	r.Ecs = populate(*r)
	//r.Ecs.List()
	//r.Ecs.PrintEntity(2)
	a.Runs.add(*r)
	//fmt.Println(r.Info.created.Format("2006-01-02 15:04:05"))
	//fmt.Println(r)
	return r, "", http.StatusOK
}

func populate(r Run) ecs.ECS {
	// dummy
	_ = r.Ecs.NewEntity()
	// player
	player := r.Ecs.NewEntity()
	current := r.Level.GetWalkableTile(r.Rnd)
	r.Ecs.AddComponent(player, "info", &comps.Info{Name: r.Info.Nick, Type: "player"})
	r.Ecs.AddComponent(player, "position", &comps.Position{Current: current})
	r.Ecs.AddComponent(player, "health", &comps.Health{MaxHp: 50, CurrentHP: 200})
	r.Ecs.AddTag(player, "player")
	r.Ecs.AddTag(player, "visible")
	// dummy
	_ = r.Ecs.NewEntity()
	return r.Ecs
}
