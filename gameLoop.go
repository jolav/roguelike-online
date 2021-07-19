/* */

package main

import "fmt"

func gameLoop(a *app) {

	for {
		select {

		case askRun := <-a.Ch.askNewGame:
			r := a.Runs.newRun(&a.Conf)
			r.Fov.rayCast(r)
			r.Map.convertMapToView(r, a.Conf)
			r.Map.createPublicEntities(r, a.Conf)
			askRun <- r

		case askTurn := <-a.Ch.askNewTurn:
			r := a.Runs[askTurn.token]
			movement(askTurn.action, r)
			//movementFoes(r)
			r.Fov.rayCast(r)
			r.Map.convertMapToView(r, a.Conf)
			r.Map.createPublicEntities(r, a.Conf)
			//	a.Runs[askTurn.token] = r // NOT neccesary ??
			askTurn.comm <- r
		}
	}
	// UNREACHABLE CODE
}

func movementFoes(r *run) {
	for k, v := range r.Entities {
		if r.Map.isVisible(v.Pos.X, v.Pos.Y) {
			if k != 0 {
				fmt.Println("is in my LOS ...", v)
				r.Map.pathFinding(r, v.Pos)
			}
		}
	}
}

func (m *gameMap) pathFinding(r *run, start pos) {
	paths := make([][]int, r.Map.Height)
	for i := range paths {
		paths[i] = make([]int, r.Map.Width)
	}
	fmt.Println("HUYYYY")
	fmt.Println(len(paths))
	//fmt.Println(paths[150][90])
	fmt.Println(paths[90][150])
	//paths := make([w][10]int)
	end := pos{
		X: r.Entities[0].Pos.X,
		Y: r.Entities[0].Pos.Y,
	}
	queue := []pos{start}
	fmt.Println(queue, end)
	for len(queue) > 0 {
		current := queue[0]
		queue = queue[1:]
		if current == end {
			break
		}
	}
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
	case "skip":
		return
	}
	var playerX = r.Entities[0].Pos.X
	var playerY = r.Entities[0].Pos.Y
	if !r.Map.isBlocked(playerX+dx, playerY+dy) &&
		!r.Map.isEntityBlocking(r, playerX+dx, playerY+dy) {
		r.Entities[0].move(dx, dy)
	}
}
