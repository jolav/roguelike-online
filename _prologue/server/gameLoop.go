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
	var loadToken string
	for {
		select {

		case askGameParams := <-a.Ch.askGameParams:
			camCols, camRows, loadToken = paramsValues(askGameParams)

		case askRun := <-a.Ch.askGame:
			fmt.Println("##### Asking for ... ")
			r := &run{}
			if loadToken == "" {
				fmt.Println("a New Game")
				r = rs.newRun(a.Cnf, camCols, camRows)
			} else {
				fmt.Println("Loading Game")
				r = rs.loadRun(a.Cnf, camCols, camRows, loadToken)

			}
			if r.issue != "" {
				askRun <- *r
			} else {
				rs[r.token] = r
				askRun <- *r
			}

		case askTurn := <-a.Ch.askTurn:
			camCols, camRows = paramCamValues(askTurn.cam)
			r := rs[askTurn.token]
			action := askTurn.action
			fmt.Printf("##### Turn %d , action %s\n", r.turn, action)
			r.validAction = r.pj.action(action, r.zoneMap, r.entities)
			if r.validAction {
				r.fov.rayCast(*r)
				r.turn++
			}
			askTurn.comm <- *r
		}
	}
	// UNREACHABLE CODE
}

func paramsValues(params string) (int, int, string) {
	paramsFull := strings.Split(params, "-")
	camParams := paramsFull[0]
	token := paramsFull[1]
	camCols := 0
	camRows := 0
	camCols, err := strconv.Atoi((strings.Split(camParams, "_")[0]))
	if err != nil {
		camCols = 0
	}
	camRows, err = strconv.Atoi((strings.Split(camParams, "_")[1]))
	if err != nil {
		camRows = 0
	}
	return camCols, camRows, token

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
