/* */

package main

type clientDataTurn struct {
	Turn        int    `json:"turn"`
	GameOver    bool   `json:"gameOver"`
	ValidAction bool   `json:"validAction"`
	PJ          player `json:"pj"`
}

func processTurn(r run) clientDataTurn {
	cd := clientDataTurn{
		Turn:     r.turn,
		GameOver: r.gameOver,
		PJ:       r.pj,
	}
	return cd
}

type clientDataNewGame struct {
	Nick     string `json:"nick"`
	Token    string `json:"token"`
	Turn     int    `json:"turn"`
	GameOver bool   `json:"gameOver"`
	PJ       player `json:"pj"`
}

func processNewGame(r run) clientDataNewGame {
	cd := clientDataNewGame{
		Nick:     r.nick,
		Token:    r.token,
		Turn:     r.turn,
		GameOver: r.gameOver,
		PJ:       r.pj,
	}
	return cd
}
