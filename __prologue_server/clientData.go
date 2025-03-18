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
	r.Fov.rayCast(r, 12)
	es := make(Entities)
	r.Camera = r.Camera.updateCam(r)
	positions := r.Ecs.Positions.Components
	for k, v := range positions {
		if r.Level[v.Current.X][v.Current.Y].Visible ||
			r.Level[v.OnMap.X][v.OnMap.Y].Visible {
			// if r.Camera.containsPoint(v.Current) || r.Camera.containsPoint(v.OnMap) {
			info, _ := r.Ecs.Infos.GetComponent(k)
			e := Entity{
				ID:   k,
				Pos:  updateEntitiesPos(r, v),
				Info: info,
			}
			es[k] = e
		}
	}
	n := newRunData{
		ID:       r.Info.Token,
		Nick:     r.Info.Nick,
		Seed:     r.Info.Seed,
		Map:      fromMapToView(r),
		Entities: es,
		Actions:  r.Actions,
	}
	//fmt.Println(n.Entities[2])
	return n
}

func prepareDataTurn(r Run) newTurnData {
	r.Fov.rayCast(r, 12)
	es := make(Entities)
	actions := r.Actions
	r.Camera = r.Camera.updateCam(r)
	positions := r.Ecs.Positions.Components
	for k, v := range positions {
		if r.Level[v.Current.X][v.Current.Y].Visible ||
			r.Level[v.OnMap.X][v.OnMap.Y].Visible {
			// if r.Camera.containsPoint(v.Current) || r.Camera.containsPoint(v.OnMap) {
			info, _ := r.Ecs.Infos.GetComponent(k)
			e := Entity{
				ID:   k,
				Pos:  updateEntitiesPos(r, v),
				Info: info,
			}
			es[k] = e
		}
	}
	n := newTurnData{
		Turn:     r.Control.Turn,
		Map:      fromMapToView(r),
		Entities: es,
		Actions:  actions,
	}
	return n
}

func updateEntitiesPos(r Run, v comps.Position) comps.Position {
	p := comps.Position{
		Current: mapa.Point{
			X: v.Current.X - r.Camera.Pos.X,
			Y: v.Current.Y - r.Camera.Pos.Y,
		},
		OnMap: mapa.Point{
			X: v.OnMap.X - r.Camera.Pos.X,
			Y: v.OnMap.Y - r.Camera.Pos.Y,
		},
	}
	return p
}

func fromMapToView(r Run) mapa.Level {
	var cols = r.Camera.Cols
	var rows = r.Camera.Rows
	if r.Camera.Cols > len(r.Level) {
		cols = len(r.Level)
	}
	if r.Camera.Rows > len(r.Level[0]) {
		rows = len(r.Level[0])
	}
	res := mapa.NewLevel(r.Rnd, cols, rows, 0)

	for x := range cols {
		for y := range rows {
			if r.Level[x+r.Camera.Pos.X][y+r.Camera.Pos.Y].Explored {
				res[x][y] = r.Level[x+r.Camera.Pos.X][y+r.Camera.Pos.Y]
			} else {
				res[x][y] = mapa.Tile{
					Terrain:  "unknown",
					Walkable: false,
					BlockLOS: true,
					Explored: false,
					Visible:  false,
				}
			}
		}
	}
	//fmt.Println("VIEW = ", cols, rows, len(res), len(res[0]))
	return res
}
