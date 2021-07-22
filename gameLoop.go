/* */

package main

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
			if !r.GameOver {
				movement(askTurn.action, r)
				movementFoes(r)
			}
			r.Fov.rayCast(r)
			r.Map.convertMapToView(r, a.Conf)
			r.Map.createPublicEntities(r, a.Conf)
			askTurn.comm <- r
		}
	}
	// UNREACHABLE CODE
}

func movementFoes(r *run) {
	var player = r.Entities[0]
	for k, v := range r.Entities {
		if r.Map.isVisible(v.Pos.X, v.Pos.Y) && v.isCombatant() {
			if k != 0 {
				//fmt.Println("is in my LOS ...", v)
				pj := pos{
					X: player.Pos.X,
					Y: player.Pos.Y,
				}
				foe := pos{
					X: v.Pos.X,
					Y: v.Pos.Y,
				}
				path := pathFinding(r, foe, pj)
				if r.Map.isOccupied(path[1], r.Entities) {
					if path[1] == pj {
						//fmt.Println("Attacking ... ", path[1])
						v.attack(player)
						if player.isDead() {
							r.Entities[0].Pos.Char = "%"
							r.GameOver = true
						}
					} else {
						// no trail
						//fmt.Println("Bug or No trail ??")
					}
				} else {
					dx := path[1].X - path[0].X
					dy := path[1].Y - path[0].Y
					v.move(dx, dy)
				}
			}
		}
	}
}

func convertMapToMaze(r *run) [][]int {
	maze := make([][]int, r.Map.Width)
	for i := range maze {
		maze[i] = make([]int, r.Map.Height)
		for j := range maze[i] {
			if r.Map.isBlocked(i, j) {
				maze[i][j] = 1
			} else {
				maze[i][j] = 0
			}
		}
	}
	for k, e := range r.Entities {
		if e.isBlocking() && k != 0 { // not pj
			maze[e.Pos.X][e.Pos.Y] = 1
		}
	}
	return maze
}

func pathFinding(r *run, start pos, end pos) []pos {
	var dirs = [4]pos{
		{-1, 0, "", 'N'},
		{0, -1, "", 'N'},
		{1, 0, "", 'N'},
		{0, 1, "", 'N'},
	}
	maze := convertMapToMaze(r)
	steps := make([][]int, len(maze))
	for i := range steps {
		steps[i] = make([]int, len(maze[i]))
	}

	cameFrom := make(map[pos]pos)
	frontier := []pos{start}

	for len(frontier) > 0 {
		current := frontier[0]
		frontier = frontier[1:]

		if current == end {
			break
		}
		for _, dir := range dirs {
			next := current.add(dir)
			value, isInside := next.at(maze)
			if value == 1 || !isInside {
				continue
			}
			if cameFrom[next] == (pos{}) {
				cameFrom[next] = current
				frontier = append(frontier, next)
			}
		}
	}
	path := make([]pos, 0)
	path = append(path, end)
	pathDone := false
	step := end
	tries := 0 // avoid some infinite bucle, no traceroute to pj
	for !pathDone && tries < 500 {
		next := cameFrom[step]
		path = append(path, next)
		if next == start {
			pathDone = true
		}
		step = next
		tries++
	}
	path = reversePosArray(path)
	//fmt.Println("Path, ", path)
	return path
}

func movement(action string, r *run) {
	var player = r.Entities[0]
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
	newX := player.Pos.X + dx
	newY := player.Pos.Y + dy
	if !r.Map.isBlocked(newX, newY) {
		isBlocking, e := r.Map.isEntityBlocking(r, newX, newY)
		if isBlocking {
			player.attack(e)
			if e.isDead() {
				e.Pos.Char = "%"
				e.Blocks = false
				e.Mobile = false
				e.Name = "Corpse of " + e.Name
				e.Combat = combat{}
			}
		} else {
			r.Entities[0].move(dx, dy)
		}
	}

}
