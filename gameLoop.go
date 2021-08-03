/* */

package main

import "fmt"

func (a *app) gameLoop() {
	for {
		select {
		case askRun := <-a.Ch.askGame:
			r := a.Runs.newRun(a.Cnf)
			fmt.Println(len(a.Runs))
			prettyPrintStruct(r)
			askRun <- r

		case askTurn := <-a.Ch.askTurn:
			r := a.Runs[askTurn.token]
			if askTurn.action == "erase" {
				if a.Runs.exists(r.Token) {
					r.GameOver = true
					a.Runs.delete(r.Token)
				}
			}
			prettyPrintStruct(r)
			askTurn.comm <- r
		}
	}
	// UNREACHABLE CODE
}
