/* */

package main

import "roguelike-online/_prologue/server/components"

type clientDataTurn struct {
	Turn        int              `json:"turn"`
	GameOver    bool             `json:"gameOver"`
	ValidAction bool             `json:"validAction"`
	PJ          player           `json:"pj"`
	Cam         components.Point `json:"cam"`
	View        tiles            `json:"view"`
}

func processTurn(r run) clientDataTurn {
	cam := updateCam(r)
	cd := clientDataTurn{
		Turn:     r.turn,
		GameOver: r.gameOver,
		PJ:       r.pj,
		Cam:      cam,
		View:     from2Dto1D(r.zoneMap, cam),
	}
	return cd
}

type clientDataNewGame struct {
	Nick     string           `json:"nick"`
	Token    string           `json:"token"`
	Turn     int              `json:"turn"`
	GameOver bool             `json:"gameOver"`
	PJ       player           `json:"pj"`
	Cam      components.Point `json:"cam"`
	View     tiles            `json:"view"`
}

func processNewGame(r run) clientDataNewGame {
	cam := updateCam(r)
	cd := clientDataNewGame{
		Nick:     r.nick,
		Token:    r.token,
		Turn:     r.turn,
		GameOver: r.gameOver,
		PJ:       r.pj,
		Cam:      cam,
		View:     from2Dto1D(r.zoneMap, cam),
	}
	return cd
}

func updateCam(r run) components.Point {
	m := r.zoneMap
	cam := r.zoneMap.cam
	pj := r.pj
	rows := len(m.tiles)
	cols := len(m.tiles[0])

	cam.X = pj.Actual.X - (cam.cols / 2)
	cam.Y = pj.Actual.Y - (cam.rows / 2)
	if cam.X < 0 {
		cam.X = 0
	}
	if cam.X+cam.cols > cols {
		cam.X = cols - cam.cols
	}
	if cam.Y < 0 {
		cam.Y = 0
	}
	if cam.Y+cam.rows > rows {
		cam.Y = rows - cam.rows
	}
	return components.Point{
		X: cam.X,
		Y: cam.Y,
	}
}

func from2Dto1D(m zoneMap, cam components.Point) [][]tile {
	res := m.fillMapWith(m.cam.cols, m.cam.rows, "unknown")
	for y := 0; y < m.cam.rows; y++ {
		for x := 0; x < m.cam.cols; x++ {
			res[y][x] = m.tiles[y+cam.Y][x+cam.X]
		}
	}
	return res
}
