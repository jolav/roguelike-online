/* */

package main

import mymap "prologue/map"

type newRunData struct {
	ID   string
	NICK string
	SEED int64
	Map  mymap.Level `json:"map"`
}

func prepareDataNew(r Run) newRunData {
	n := newRunData{
		ID:   r.Info.Token,
		NICK: r.Info.Nick,
		SEED: r.Info.Seed,
		Map:  r.Level,
	}
	return n
}

type newTurnData struct {
	Turn int64 `json:"turn"`
}

func prepareDataTurn(r Run) newTurnData {
	n := newTurnData{
		Turn: r.Control.Turn,
	}
	return n
}
