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

func (r run) moveEntity(id int, action string) bool {
	e := r.entities[id]
	var next = point{0, 0}
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
	next.X = e.Pos.X + dx
	next.Y = e.Pos.Y + dy
	if r.Map.isBlocked(next.X, next.Y) {
		return false
	}
	isBlocked, foe := next.getEntityBlocking(r.entities)
	if isBlocked && foe.isCombatant() {
		if e.id != 0 && foe.Name != "player" { // avoid attack inter npcs
			return false
		}
		e.attacks(foe)
		if foe.isDead() {
			foe.Blocks = false
			foe.Mobile = false
			foe.Name = "corpse of " + foe.Name
			foe.Combat = combat{}
		}
		return true
	}
	e.move(dx, dy)
	return true
}

func (r run) moveEntities() {
	ia := npcIA{}
	randomAction := [4]string{"up", "down", "left", "right"}
	var player = r.entities[0]
	for _, e := range r.entities {
		if e.Name != "player" && e.isMobile() {
			if r.Map.isVisible(e.Pos.X, e.Pos.Y) { // Normal move in player LOS
				path := ia.pathFinding(e.Pos, player.Pos, r)
				if path[1].isAnyEntityBlocking(r.entities) {
					var action = ""
					var dx = path[1].X - path[0].X
					var dy = path[1].Y - path[0].Y
					if dx == 1 {
						action = "right"
					} else if dx == -1 {
						action = "left"
					} else if dy == 1 {
						action = "down"
					} else {
						action = "up"
					}
					r.moveEntity(e.id, action)
					/*if path[1] == player.Pos {
						fmt.Println(e.Name, "at", e.Pos, "attacking ... ", path[1])
					} else {
						fmt.Println("No trail ??") // or bug ?
					}*/
				} else {
					dx := path[1].X - path[0].X
					dy := path[1].Y - path[0].Y
					e.move(dx, dy)
				}
			} else { // Random move
				r.moveEntity(e.id, randomAction[randomInt(0, 3)])
			}
		}
	}
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
	r.entities[player.id] = player
	r.counter++
	// populate all entities
	success := 0
	for tries := 1; tries < FOES_TRIES; tries++ {
		p = r.getRandomCoordsForPopulate()
		if (p != point{0, 0}) {
			foeName := ""
			if randomInt(1, 10) < 8 {
				foeName = "rat"
			} else {
				foeName = "mole rat"
			}
			foe := newEntity(foeName, r.counter, p)
			r.entities[foe.id] = foe
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
