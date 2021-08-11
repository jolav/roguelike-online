/* */

package main

type entity struct {
	id     int
	Name   string `json:"name"`
	Pos    point  `json:"pos"`
	Facing rune   `json:"facing"`
	Blocks bool   `json:"blocks"`
	Mobile bool   `json:"mobile"`
	Combat combat `json:"combat"`
}

type combat struct {
	HP      int `json:"hp"`
	MaxHP   int `json:"maxhp"`
	Attack  int `json:"attack"`
	Defence int `json:"defende"`
}

func (e entity) isBlocking() bool {
	return e.Blocks
}

func (e entity) isMobile() bool {
	return e.Mobile
}

func (e entity) isCombatant() bool {
	if e.Combat == (combat{}) {
		return false
	}
	return true
}

func (e *entity) move(dx, dy int) {
	e.Pos.X += dx
	e.Pos.Y += dy
}

func newEntity(name string, id int, p point) entity {
	return entity{
		id:     id,
		Name:   name,
		Pos:    p,
		Facing: entity{}.getInitialFacing(),
		Blocks: entity{}.getIsBlocks(name),
		Mobile: entity{}.getIsMobile(name),
		Combat: entity{}.getCombatStats(name),
	}
}

func (e entity) getInitialFacing() rune {
	switch randomInt(1, 4) {
	case 1:
		return 'N'
	case 2:
		return 'S'
	case 3:
		return 'W'
	case 4:
		return 'E'
	}
	return 'N'
}

func (e entity) getIsBlocks(name string) bool {
	switch name {
	case "player", "rat", "mole rat":
		return true
	}
	return false
}

func (e entity) getIsMobile(name string) bool {
	switch name {
	case "player", "rat", "mole rat":
		return true
	}
	return false
}
func (e entity) getCombatStats(name string) combat {
	switch name {
	case "player":
		return combat{
			MaxHP:   30,
			HP:      30,
			Attack:  5,
			Defence: 5,
		}
	case "rat":
		return combat{
			MaxHP:   7,
			HP:      7,
			Attack:  3,
			Defence: 2,
		}
	case "mole rat":
		return combat{
			MaxHP:   15,
			HP:      15,
			Attack:  4,
			Defence: 6,
		}
	}
	return combat{}
}
