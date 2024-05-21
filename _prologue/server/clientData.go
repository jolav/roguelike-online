/* */

package main

type clientDataNewRun struct {
	Nick  string `json:"nick"`
	Token string `json:"token"`
}

func processNewRun(r run) clientDataNewRun {
	cd := clientDataNewRun{
		Nick:  r.nick,
		Token: r.token,
	}
	return cd
}

type clientDataNewTurn struct {
	X int `json:"x"`
	Y int `json:"y"`
}

func processNewTurn(r run, action string, cols, rows int) clientDataNewTurn {
	//fmt.Println(r)
	cd := clientDataNewTurn{
		X: r.x,
		Y: r.y,
	}
	switch action {
	case "UP":
		cd.Y--
	case "UPRIGHT":
		cd.X++
		cd.Y--
	case "RIGHT":
		cd.X++
	case "DOWNRIGHT":
		cd.X++
		cd.Y++
	case "DOWN":
		cd.Y++
	case "DOWNLEFT":
		cd.X--
		cd.Y++
	case "LEFT":
		cd.X--
	case "UPLEFT":
		cd.X--
		cd.Y--
	}
	return cd
}
