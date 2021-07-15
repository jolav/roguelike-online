/* */

package main

func gameLoop(a *app) {

	for {
		select {

		case sendToken := <-a.Ch.askNewGame:
			newRun := a.Runs.newRun(&a.Conf)
			newRun.Fov.rayCast(newRun)
			newRun.Map.convertMapToView(newRun, a.Conf)
			newRun.Map.createPublicEntities(newRun, a.Conf)
			sendToken <- newRun

		case askTurn := <-a.Ch.askNewTurn:
			r := a.Runs[askTurn.token]
			movement(askTurn.action, r)
			r.Fov.rayCast(r)
			r.Map.convertMapToView(r, a.Conf)
			r.Map.createPublicEntities(r, a.Conf)
			a.Runs[askTurn.token] = r
			askTurn.comm <- r
		}
	}
	// UNREACHABLE CODE
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
	var playerX = r.Entities[0].Pos.X
	var playerY = r.Entities[0].Pos.Y
	if !r.Map.IsBlocked(playerX+dx, playerY+dy) &&
		!r.Map.isEntityBlocking(r, playerX+dx, playerY+dy) {
		r.Entities[0].move(dx, dy)
	}
}
