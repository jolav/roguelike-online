/* */

package main

func (a *app) gameLoop() {
	for {
		select {
		case askRun := <-a.Ch.askGame:
			r := a.Runs.newRun(a.Cnf)
			prettyPrintStruct(r)
			askRun <- r

		case askTurn := <-a.Ch.askTurn:
			r := a.Runs[askTurn.token]
			if askTurn.action == "erase" {
				if a.Runs.exists(r.Token) {
					r.GameOver = true
					a.Runs.delete(r.Token)
				}
			} else {
				r.movePlayer(askTurn.action)
			}

			//prettyPrintStruct(r.Entities[0])
			askTurn.comm <- r
		}
	}
	// UNREACHABLE CODE
}
