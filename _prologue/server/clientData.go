/* */

package main

type clientData struct {
	Nick     string `json:"nick"`
	Token    string `json:"token"`
	Turn     int    `json:"turn"`
	GameOver bool   `json:"gameOver"`
}

func process(r run) clientData {

	cd := clientData{
		Nick:     r.nick,
		Token:    r.token,
		Turn:     r.turn,
		GameOver: r.gameOver,
	}
	return cd
}
