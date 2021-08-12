/* */

package main

type npcIA struct {
	//maze     [][]int
	//steps    [][]int
	//cameFrom map[point]point
	//frontier []point
}

func (npc npcIA) pathFinding(start, end point, r run) []point {
	var dirs = [4]point{
		{-1, 0},
		{0, -1},
		{1, 0},
		{0, 1},
	}
	//randomAction := [4]string{"up", "down", "left", "right"}
	maze := npc.convertMapToMaze(r)
	steps := make([][]int, len(maze))
	for i := range steps {
		steps[i] = make([]int, len(maze[i]))
	}
	cameFrom := make(map[point]point)
	frontier := []point{start}

	for len(frontier) > 0 {
		current := frontier[0]
		frontier = frontier[1:]

		if current == end {
			break
		}
		for _, dir := range dirs {
			next := current.add(dir)
			value, isInside := next.isInside(maze)
			if value == 1 || !isInside {
				continue
			}
			if cameFrom[next] == (point{}) {
				cameFrom[next] = current
				frontier = append(frontier, next)
			}
		}
	}
	path := make([]point, 0)
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
	path = reversePointsArray(path)
	//fmt.Println("Path, ", path)
	return path
}

func (npc npcIA) convertMapToMaze(r run) [][]int {
	maze := make([][]int, r.Map.Rows)
	for i := range maze {
		maze[i] = make([]int, r.Map.Cols)
		for j := range maze[i] {
			if r.Map.isBlocked(i, j) {
				maze[i][j] = 1
			} else {
				maze[i][j] = 0
			}
		}
	}
	for k, e := range r.entities {
		if e.isBlocking() && k != 0 { // not pj
			maze[e.Pos.X][e.Pos.Y] = 1
		}
	}
	return maze
}
