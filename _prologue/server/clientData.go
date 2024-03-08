/* */

package main

import "roguelike-online/_prologue/server/components"

type clientDataTurn struct {
	Turn        int    `json:"turn"`
	GameOver    bool   `json:"gameOver"`
	ValidAction bool   `json:"validAction"`
	PJ          player `json:"pj"`
	Cam         camera `json:"cam"`
	View        Tiles  `json:"view"`
}

func processTurn(r run) clientDataTurn {
	r.cam = r.cam.updateCam(r)
	r.pj.View = updatePjView(r)
	cd := clientDataTurn{
		Turn:     r.turn,
		GameOver: r.gameOver,
		PJ:       r.pj,
		Cam:      r.cam,
		View:     fromMapToView(r),
	}
	return cd
}

type clientDataNewGame struct {
	Nick     string `json:"nick"`
	Token    string `json:"token"`
	Turn     int    `json:"turn"`
	GameOver bool   `json:"gameOver"`
	PJ       player `json:"pj"`
	Cam      camera `json:"cam"`
	View     Tiles  `json:"view"`
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
		Cam:      r.cam,
		View:     fromMapToView(r),
	}
	return cd
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

	for y := 0; y < rows; y++ {
		for x := 0; x < cols; x++ {
			res[y][x] = r.zoneMap.Tiles[y+r.cam.Y][x+r.cam.X]
		}
	}
	return res
}

func createMapAndfillWith(cols, rows int, fill string) [][]tile {
	Tiles := make([][]tile, rows)
	for i := range Tiles {
		Tiles[i] = make([]tile, cols)
	}
	for y := 0; y < rows; y++ {
		for x := 0; x < cols; x++ {
			Tiles[y][x] = tile{}.create(fill)
		}
	}
	return Tiles
}
