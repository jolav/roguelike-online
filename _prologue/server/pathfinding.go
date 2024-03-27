/* */

package main

import (
	"roguelike-online/_prologue/server/components"
)

func pathFinding(e *entity, r run) []components.Point {
	start := e.Current
	end := r.pj.Current
	var dirs = [8]components.Point{
		{X: -1, Y: 0},
		{X: 0, Y: -1},
		{X: 1, Y: 0},
		{X: 0, Y: 1},
		{X: -1, Y: -1},
		{X: -1, Y: 1},
		{X: 1, Y: -1},
		{X: 1, Y: 1},
	}
	maze := convertMapToMaze(r)
	steps := make([][]int, len(maze))
	for i := range steps {
		steps[i] = make([]int, len(maze[i]))
	}
	cameFrom := make(map[components.Point]components.Point)
	frontier := []components.Point{start}

	for len(frontier) > 0 {
		current := frontier[0]
		frontier = frontier[1:]

		if current == end {
			break
		}
		for _, dir := range dirs {
			if !dirIsLegal(dir, r.zoneMap, e) { // check dir is legal move
				continue
			}
			next := current.Add(dir)
			value, isInside := next.IsInside(maze)
			if value == 1 || !isInside {
				continue
			}
			if cameFrom[next] == (components.Point{}) {
				cameFrom[next] = current
				frontier = append(frontier, next)
			}
		}
	}
	path := make([]components.Point, 0)
	path = append(path, end)
	pathDone := false
	step := end
	tries := 0 // avoid some infinite bucle, no traceroute to pj
	for !pathDone && tries < 50 {
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

func dirIsLegal(p components.Point, m zoneMap, e *entity) bool {
	action := convertDeltaToAction(p.X, p.Y)
	return e.canMoveDiagonal(action, m)
}

func convertMapToMaze(r run) [][]int {
	maze := make([][]int, r.zoneMap.K.COLS)
	for i := range maze {
		maze[i] = make([]int, r.zoneMap.K.ROWS)
		for j := range maze[i] {
			if r.zoneMap.isWalkable(i, j) {
				maze[i][j] = 0
			} else {
				maze[i][j] = 1
			}
		}
	}
	for k, e := range r.entities {
		if e.isBlocking() && k != 0 { // not pj
			maze[e.Current.X][e.Current.Y] = 1
		}
	}
	return maze
}

func reversePointsArray(reverse []components.Point) []components.Point {
	for i, j := 0, len(reverse)-1; i < j; i, j = i+1, j-1 {
		reverse[i], reverse[j] = reverse[j], reverse[i]
	}
	return reverse
}

func convertDeltaToAction(dx, dy int) string {
	if dx == -1 && dy == -1 {
		return "UPLEFT"
	}
	if dx == 0 && dy == -1 {
		return "UP"
	}
	if dx == 1 && dy == -1 {
		return "UPRIGHT"
	}
	if dx == -1 && dy == 0 {
		return "LEFT"
	}
	if dx == 1 && dy == 0 {
		return "RIGHT"
	}
	if dx == -1 && dy == 1 {
		return "DOWNLEFT"
	}
	if dx == 0 && dy == 1 {
		return "DOWN"
	}
	if dx == 1 && dy == 1 {
		return "DOWNRIGHT"
	}
	return "SKIP"
}
