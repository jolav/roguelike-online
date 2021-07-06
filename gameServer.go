/* */

package main

import (
	"fmt"
)

func gameLoop(a *app) {

	for {
		select {

		case sendToken := <-a.Ch.askNewGame:
			fullToken := a.Runs.add()
			sendToken <- fullToken

		case askTurn := <-a.Ch.askNewTurn:
			fullTurn := a.Runs[askTurn.token]
			switch askTurn.action {
			case "up":
				fullTurn.Y--
			case "down":
				fullTurn.Y++
			case "right":
				fullTurn.X++
			case "left":
				fullTurn.X--
			}
			a.Runs[askTurn.token] = fullTurn
			askTurn.comm <- fullTurn
		}
		//prettyPrintStruct(len(a.Runs))

	}

	// UNREACHABLE CODE
	fmt.Println("UNREACHABLE CODE")

}
