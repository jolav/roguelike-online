/* */

package main

type clientDataTurn struct {
	Turn        int      `json:"turn"`
	GameOver    bool     `json:"gameOver"`
	ValidAction bool     `json:"validAction"`
	PJ          player   `json:"pj"`
	View        [][]tile `json:"view"`
}

func processTurn(r run) clientDataTurn {
	cd := clientDataTurn{
		Turn:     r.turn,
		GameOver: r.gameOver,
		PJ:       r.pj,
		View:     from2Dto1D(r.zoneMap.tiles),
	}
	return cd
}

type clientDataNewGame struct {
	Nick     string   `json:"nick"`
	Token    string   `json:"token"`
	Turn     int      `json:"turn"`
	GameOver bool     `json:"gameOver"`
	PJ       player   `json:"pj"`
	View     [][]tile `json:"view"`
}

func processNewGame(r run) clientDataNewGame {
	cd := clientDataNewGame{
		Nick:     r.nick,
		Token:    r.token,
		Turn:     r.turn,
		GameOver: r.gameOver,
		PJ:       r.pj,
		View:     from2Dto1D(r.zoneMap.tiles),
	}
	return cd
}

func from2Dto1D(tiles [][]tile) [][]tile {
	rows := len(tiles)
	cols := len(tiles[0])
	res := tiles
	for y := 0; y < rows; y++ {
		for x := 0; x < cols; x++ {
			res[y][x] = tiles[y][x]
		}
	}
	return res
}
