/* */

package main

import (
	"errors"
	"fmt"
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
	current := r.Level.GetWalkableTile(esPoints, r.Rnd)
	r.Ecs.Infos.AddComponent(player, comps.Info{Name: r.Info.Nick, Type: "player"})
	r.Ecs.Positions.AddComponent(player, comps.Position{Current: current})
	esPoints = append(esPoints, mapa.Point{X: current.X, Y: current.Y})
	r.Ecs.Healths.AddComponent(player, comps.Health{MaxHp: 50, CurrentHP: 45})
	r.Ecs.AddTag(player, "player")
	r.Ecs.AddTag(player, "visible")
	// rat
	rat := r.Ecs.NewEntity()
	current = r.Level.GetWalkableTile(esPoints, r.Rnd)
	esPoints = append(esPoints, mapa.Point{X: current.X, Y: current.Y})
	r.Ecs.Positions.AddComponent(rat, comps.Position{Current: current})
	r.Ecs.Infos.AddComponent(rat, comps.Info{Name: "rat" + fmt.Sprint(rat), Type: "rat"})
	r.Ecs.Healths.AddComponent(rat, comps.Health{MaxHp: 20, CurrentHP: 20})
	r.Ecs.AddTag(rat, "creature")
	r.Ecs.AddTag(rat, "visible")
	/*fmt.Println("#################")
	fmt.Println("Before:", r.Ecs.Infos.Index)
	r.Ecs.Infos.RemoveComponent(2)
	fmt.Println("After:", r.Ecs.Infos.Index)
	fmt.Println("#####################")*/
	return r.Ecs
}
