/* */

package main

import (
	"prologue/action"
	"prologue/ecs/comps"
	"prologue/mapa"
)

type newRunData struct {
	ID       string         `json:"id"`
	Nick     string         `json:"nick"`
	Seed     int64          `json:"seed"`
	Map      mapa.Level     `json:"map"`
	Entities Entities       `json:"entities"`
	Actions  action.Actions `json:"actions"`
}

type newTurnData struct {
	Turn     int64          `json:"turn"`
	Map      mapa.Level     `json:"map"`
	Entities Entities       `json:"entities"`
	Actions  action.Actions `json:"actions"`
}

type Entities map[int]Entity

type Entity struct {
	ID   int            `json:"eID"`
	Pos  comps.Position `json:"pos"`
	Info comps.Info     `json:"info"`
}

func prepareDataNew(r Run) newRunData {
	es := make(Entities)
	positions := r.Ecs.Positions.Components
	for k, v := range positions {
		e := Entity{}
		e.ID = k
		e.Pos = v
		e.Info, _ = r.Ecs.Infos.GetComponent(k)
		es[k] = e
	}
	n := newRunData{
		ID:       r.Info.Token,
		Nick:     r.Info.Nick,
		Seed:     r.Info.Seed,
		Map:      r.Level,
		Entities: es,
		Actions:  r.Actions,
	}
	//fmt.Println(n.Entities)
	return n
}

func prepareDataTurn(r Run) newTurnData {
	es := make(Entities)
	positions := r.Ecs.Positions.Components
	for k, v := range positions {
		e := Entity{}
		e.ID = k
		e.Pos = v
		e.Info, _ = r.Ecs.Infos.GetComponent(k)
		es[k] = e
	}
	n := newTurnData{
		Turn:     r.Control.Turn,
		Map:      r.Level,
		Entities: es,
		Actions:  r.Actions,
	}
	//fmt.Println(n.Visibles)
	return n
}
