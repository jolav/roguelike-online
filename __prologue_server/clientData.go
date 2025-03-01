/* */

package main

import (
	"prologue/ecs/comps"
	"prologue/mapa"
)

type newRunData struct {
	ID   string
	NICK string
	SEED int64
	Map  mapa.Level `json:"map"`
	PJ   comps.Position
}

func prepareDataNew(r Run) newRunData {
	posID, hasPos := r.Ecs.PositionIndex[2]
	var p = comps.Position{}
	if hasPos {
		p = r.Ecs.Positions[posID]
	}
	n := newRunData{
		ID:   r.Info.Token,
		NICK: r.Info.Nick,
		SEED: r.Info.Seed,
		Map:  r.Level,
		PJ:   p,
	}
	return n
}

type newTurnData struct {
	Turn int64 `json:"turn"`
	PJ   comps.Position
}

func prepareDataTurn(r Run) newTurnData {
	posID, hasPos := r.Ecs.PositionIndex[2]
	var p = comps.Position{}
	if hasPos {
		p = r.Ecs.Positions[posID]
	}
	n := newTurnData{
		Turn: r.Control.Turn,
		PJ:   p,
	}
	return n
}
