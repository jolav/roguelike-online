/* */

package main

import "fmt"

func (a *app) gameLoop() {
	var rs = a.Runs
	for {
		select {
		case askRun := <-a.Ch.askGame:
			r := rs.newRun(a.Cnf)
			rs[r.token] = r
			askRun <- *r

		case askTurn := <-a.Ch.askTurn:
			r := rs[askTurn.token]
			action := askTurn.action
			actionCompleted := false
			fmt.Sprintln("ASKTURN", action, actionCompleted)
			askTurn.comm <- *r
		}
	}
	// UNREACHABLE CODE
}
