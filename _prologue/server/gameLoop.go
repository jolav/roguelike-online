/* */

package main

import (
	"fmt"
	"strconv"
	"strings"
)

func (a *app) gameLoop() {
	var rs = a.Runs
	var camCols int
	var camRows int
	for {
		select {

		case askGameParams := <-a.Ch.askGameParams:
			camCols, camRows = paramCamValues(askGameParams)

		case askRun := <-a.Ch.askGame:
			fmt.Println("##### Asking for a New Game")
			r := rs.newRun(a.Cnf, camCols, camRows)
			rs[r.token] = r
			askRun <- *r

		case askTurn := <-a.Ch.askTurn:
			camCols, camRows = paramCamValues(askTurn.cam)
			r := rs[askTurn.token]
			action := askTurn.action
			fmt.Printf("##### Turn %d , action %s\n", r.turn, action)
			r.validAction = r.pj.action(action, r.zoneMap)
			if r.validAction {
				r.fov.rayCast(*r)
				r.turn++
			}
			askTurn.comm <- *r
		}
	}
	// UNREACHABLE CODE
}

func paramCamValues(params string) (int, int) {
	camCols := 0
	camRows := 0
	camCols, err := strconv.Atoi((strings.Split(params, "_")[0]))
	if err != nil {
		camCols = 0
	}
	camRows, err = strconv.Atoi((strings.Split(params, "_")[1]))
	if err != nil {
		camRows = 0
	}
	return camCols, camRows
}
