/* */

package main

type run struct {
	Nick           string `json:"nick"`
	Token          string `json:"token"`
	GameOver       bool   `json:"gameOver"`
	Turn           int    `json:"turn"`
	seed           int64
	counter        int
	entities       entities
	PublicEntities []entity `json:"entities"`
	Map            gameMap  `json:"map"`
	fov            fieldOfVision
}

func (r run) movePlayer(action string) bool {
	player := r.entities[0]
	var p = point{0, 0}
	var dx, dy = 0, 0
	switch action {
	case "up":
		dy = -1
	case "down":
		dy = 1
	case "left":
		dx = -1
	case "right":
		dx = 1
	case "skip":
		return true
	}
	p.X = player.Pos.X + dx
	p.Y = player.Pos.Y + dy
	if r.Map.isBlocked(p.X, p.Y) {
		return false
	}
	if p.isAnyEntityBlocking(r.entities) {
		return false
	}
	player.move(dx, dy)
	return true
}

func (r run) createPublicEntities() []entity {
	var public = []entity{}
	// add player firs entity[0]
	public = append(public, *r.entities[0])
	// add visible entities
	for _, v := range r.entities {
		x := v.Pos.X
		y := v.Pos.Y
		if r.Map.isVisible(x, y) && v.Name != "player" {
			public = append(public, *v)
		}
	}
	return public
}

func (r run) PopulateMap() (o point, x int) {
	p := point{0, 0}
	p = r.getRandomCoordsForPopulate()
	if (p == point{0, 0}) { //Init Player Point not found, use map center
		p = point{r.Map.Cols / 2, r.Map.Rows / 2}
	}
	player := newEntity("player", r.counter, p)
	r.entities[player.id] = &player
	r.counter++
	// populate all entities
	success := 0
	for tries := 1; tries < FOES_TRIES; tries++ {
		p = r.getRandomCoordsForPopulate()
		if (p != point{0, 0}) {
			foe := newEntity("rat", r.counter, p)
			r.entities[foe.id] = &foe
			r.counter++
			success++
		}
		if success >= MAX_FOES {
			return player.Pos, r.counter
		}
	}
	return player.Pos, r.counter
}

func (r run) getRandomCoordsForPopulate() point {
	var p = point{0, 0}
	var found = false
	var tries = 0 //9999
	for !found && tries < 10000 {
		x := randomInt(1, r.Map.Cols-2)
		y := randomInt(1, r.Map.Rows-2)
		if !r.Map.isBlocked(x, y) && !r.Map.isBlockingLOS(x, y) {
			p.X = x
			p.Y = y
			found = true
		}
		tries++
	}
	return p
}
