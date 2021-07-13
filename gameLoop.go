/* */

package main

import (
	"fmt"
)

func gameLoop(a *app) {

	for {
		select {

		case sendToken := <-a.Ch.askNewGame:
			fullToken := a.Runs.add(&a.Conf)
			fullToken.Fov.rayCast(fullToken)
			fullToken.Map.convertMapToView(fullToken, a.Conf)
			sendToken <- fullToken

		case askTurn := <-a.Ch.askNewTurn:
			r := a.Runs[askTurn.token]
			movement(askTurn.action, r)
			r.Fov.rayCast(r)
			r.Map.convertMapToView(r, a.Conf)
			a.Runs[askTurn.token] = r
			askTurn.comm <- r
		}
	}
	// UNREACHABLE CODE
	fmt.Println("UNREACHABLE CODE")
}

func movement(action string, r *run) {
	var dx, dy = 0, 0
	switch action {
	case "up":
		dy = -1
	case "down":
		dy = 1
	case "right":
		dx = 1
	case "left":
		dx = -1
	}
	var playerX = r.Entities["player"].X
	var playerY = r.Entities["player"].Y
	if !r.Map.Tiles[playerX+dx][playerY+dy].Blocked {
		r.Entities["player"].move(dx, dy)
	}
}
