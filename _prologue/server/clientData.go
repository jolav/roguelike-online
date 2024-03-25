/* */

package main

import (
	"roguelike-online/_prologue/server/components"
)

type clientDataTurn struct {
	Turn        int      `json:"turn"`
	GameOver    bool     `json:"gameOver"`
	ValidAction bool     `json:"validAction"`
	PJ          player   `json:"pj"`
	Entities    []entity `json:"entities"`
	Cam         camera   `json:"cam"`
	View        Tiles    `json:"view"`
}

func processTurn(r run) clientDataTurn {
	r.cam = r.cam.updateCam(r)
	r.pj.View = updatePjView(r)
	cd := clientDataTurn{
		Turn:     r.turn,
		GameOver: r.gameOver,
		PJ:       r.pj,
		Entities: showEntitiesOnSight(r),
		Cam:      r.cam,
		View:     fromMapToView(r),
	}
	return cd
}

type clientDataNewGame struct {
	Nick     string   `json:"nick"`
	Token    string   `json:"token"`
	Turn     int      `json:"turn"`
	GameOver bool     `json:"gameOver"`
	PJ       player   `json:"pj"`
	Entities []entity `json:"entities"`
	Cam      camera   `json:"cam"`
	View     Tiles    `json:"view"`
}

func processNewGame(r run) clientDataNewGame {
	r.cam = r.cam.updateCam(r)
	r.pj.View = updatePjView(r)
	cd := clientDataNewGame{
		Nick:     r.nick,
		Token:    r.token,
		Turn:     r.turn,
		GameOver: r.gameOver,
		PJ:       r.pj,
		Entities: showEntitiesOnSight(r),
		Cam:      r.cam,
		View:     fromMapToView(r),
	}
	return cd
}

func showEntitiesOnSight(r run) []entity {
	var es []entity
	for k, e := range r.entities {
		if r.zoneMap.isVisible(e.Current.X, e.Current.Y) {
			r.entities[k].View = updateEntityView(r, k)
			es = append(es, *e)
		}
	}
	return es
}

func updateEntityView(r run, k int) components.Point {
	var p = r.entities[k].View
	p.X = r.entities[k].Current.X - r.cam.X
	p.Y = r.entities[k].Current.Y - r.cam.Y
	return p
}

func updatePjView(r run) components.Point {
	var p = r.pj.View
	p.X = r.pj.Current.X - r.cam.X
	p.Y = r.pj.Current.Y - r.cam.Y
	return p
}

func fromMapToView(r run) [][]tile {
	var cols = r.cam.Cols
	var rows = r.cam.Rows
	if r.cam.Cols > r.zoneMap.K.COLS {
		cols = r.zoneMap.K.COLS
	}
	if r.cam.Rows > r.zoneMap.K.ROWS {
		rows = r.zoneMap.K.ROWS
	}
	res := createMapAndfillWith(cols, rows, "unknown")

	for x := 0; x < cols; x++ {
		for y := 0; y < rows; y++ {
			res[x][y] = r.zoneMap.Tiles[x+r.cam.X][y+r.cam.Y]
		}
	}
	return res
}

func createMapAndfillWith(cols, rows int, fill string) [][]tile {
	Tiles := make([][]tile, cols)
	for i := range Tiles {
		Tiles[i] = make([]tile, rows)
	}
	for x := 0; x < cols; x++ {
		for y := 0; y < rows; y++ {
			Tiles[x][y] = tile{}.create(fill)
		}
	}
	return Tiles
}
