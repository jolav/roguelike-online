/* */

package main

import "fmt"

func (a *app) gameLoop() {
	for {
		select {
		case askRun := <-a.Ch.askGame:
			r := newRun(a.Cnf)
			a.Runs[r.Token] = &r
			//showMap(r)
			askRun <- r

		case askTurn := <-a.Ch.askTurn:
			r := a.Runs[askTurn.token]
			action := askTurn.action
			actionCompleted := false
			switch action {
			case "erase":
				if a.Runs.exists(r.Token) {
					r.GameOver = true
					a.Runs.delete(r.Token)
				}
			default:
				actionCompleted = r.movePlayer(action)
			}
			if actionCompleted {
				r.fov.rayCast(*r)
				r.Map.convertToCameraView(r.Entities[0].Pos)
				r.Turn++
				//showMap(*r)
			}
			askTurn.comm <- *r
		}
	}
	// UNREACHABLE CODE
}

func showMap(r run) {
	fmt.Println("**************************")
	printMap(r.Map.tiles)
	fmt.Println("--------------------------")
	printMap(r.Map.Camera)
	fmt.Println("**************************")
}
