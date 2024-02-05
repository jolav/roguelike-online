/* */

package main

import "roguelike-online/_prologue/server/components"

type clientDataTurn struct {
	Turn        int    `json:"turn"`
	GameOver    bool   `json:"gameOver"`
	ValidAction bool   `json:"validAction"`
	PJ          player `json:"pj"`
	Cam         camera `json:"cam"`
	View        tiles  `json:"view"`
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
	View     tiles  `json:"view"`
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
	var cols = r.cam.cols
	var rows = r.cam.rows
	if r.cam.cols > r.zoneMap.k.COLS {
		cols = r.zoneMap.k.COLS
	}
	if r.cam.rows > r.zoneMap.k.ROWS {
		rows = r.zoneMap.k.ROWS
	}
	res := createMapAndfillWith(cols, rows, "unknown")

	for y := 0; y < rows; y++ {
		for x := 0; x < cols; x++ {
			res[y][x] = r.zoneMap.tiles[y+r.cam.Y][x+r.cam.X]
		}
	}
	return res
}

func createMapAndfillWith(cols, rows int, fill string) [][]tile {
	tiles := make([][]tile, rows)
	for i := range tiles {
		tiles[i] = make([]tile, cols)
	}
	for y := 0; y < rows; y++ {
		for x := 0; x < cols; x++ {
			tiles[y][x] = tile{}.create(fill)
		}
	}
	return tiles
}
