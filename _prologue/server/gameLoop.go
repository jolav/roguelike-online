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
			fmt.Printf("Turn %d , action %s\n", r.turn, action)
			r.validAction = r.pj.action(action)
			if r.validAction {
				r.turn++
			}
			askTurn.comm <- *r
		}
	}
	// UNREACHABLE CODE
}
