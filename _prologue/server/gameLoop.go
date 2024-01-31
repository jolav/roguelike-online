/* */

package main

import (
	"fmt"
	"strconv"
	"strings"
)

func (a *app) gameLoop() {
	var rs = a.Runs
	var cols int
	var rows int
	for {
		select {

		case askGameParams := <-a.Ch.askGameParams:
			cols, rows = paramCamValues(askGameParams)

		case askRun := <-a.Ch.askGame:
			fmt.Println("NewGame")
			r := rs.newRun(a.Cnf, cols, rows)
			rs[r.token] = r
			askRun <- *r

		case askTurn := <-a.Ch.askTurn:
			cols, rows = paramCamValues(askTurn.cam)
			r := rs[askTurn.token]
			action := askTurn.action
			fmt.Printf("Turn %d , action %s\n", r.turn, action)
			r.validAction = r.pj.action(action, r.zoneMap)
			if r.validAction {
				r.turn++
			}
			askTurn.comm <- *r
		}
	}
	// UNREACHABLE CODE
}

func paramCamValues(params string) (int, int) {
	cols := 0
	rows := 0
	cols, err := strconv.Atoi((strings.Split(params, "_")[0]))
	if err != nil {
		cols = 0
	}
	rows, err = strconv.Atoi((strings.Split(params, "_")[1]))
	if err != nil {
		rows = 0
	}
	return cols, rows
}
