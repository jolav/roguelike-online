/* */

package main

import (
	"prologue/ecs/comps"
	"prologue/mapa"
)

type newRunData struct {
	ID       string     `json:"id"`
	Nick     string     `json:"nick"`
	Seed     int64      `json:"seed"`
	Map      mapa.Level `json:"map"`
	Visibles `json:"entities"`
}

type Visibles []VisibleEntity

type VisibleEntity struct {
	Pos  comps.Position `json:"pos"`
	Info comps.Info     `json:"info"`
}

func prepareDataNew(r Run) newRunData {
	var ves []VisibleEntity
	positions := r.Ecs.Positions.Components
	for k, v := range positions {
		ve := VisibleEntity{}
		ve.Pos = v
		ve.Info, _ = r.Ecs.Infos.GetComponent(k)
		ves = append(ves, ve)
	}
	n := newRunData{
		ID:       r.Info.Token,
		Nick:     r.Info.Nick,
		Seed:     r.Info.Seed,
		Map:      r.Level,
		Visibles: ves,
	}
	//fmt.Println(n.Visibles)
	return n
}

type newTurnData struct {
	Turn     int64      `json:"turn"`
	Map      mapa.Level `json:"map"`
	Visibles `json:"entities"`
}

func prepareDataTurn(r Run) newTurnData {
	var ves []VisibleEntity
	positions := r.Ecs.Positions.Components
	for k, v := range positions {
		ve := VisibleEntity{}
		ve.Pos = v
		ve.Info, _ = r.Ecs.Infos.GetComponent(k)
		ves = append(ves, ve)
	}
	n := newTurnData{
		Turn:     r.Control.Turn,
		Map:      r.Level,
		Visibles: ves,
	}
	//fmt.Println(n.Visibles)
	return n
}
