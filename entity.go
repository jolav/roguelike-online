/* */

package main

import "fmt"

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

func (e *entity) isBlocking() bool {
	return e.Blocks
}

func (e *entity) isMobile() bool {
	return e.Mobile
}

func (e *entity) isCombatant() bool {
	if e.Combat == (combat{}) {
		return false
	}
	return true
}

func (e *entity) move(dx, dy int) {
	e.Pos.X += dx
	e.Pos.Y += dy
}

func (e *entity) attacks(target *entity, r *run) {
	d6 := randomInt(1, 6)
	damage := e.Combat.Attack + d6 - target.Combat.Defence
	if damage > 0 {
		target.Combat.HP -= damage
	}
	combatMsg :=
		fmt.Sprintf("%s deals %d damage to %s", e.Name, damage, target.Name)
	r.History = append(r.History, combatMsg)
}

func (e *entity) isDead() bool {
	if e.Combat.HP > 0 {
		return false
	}
	return true
}

func newEntity(name string, id int, p point) *entity {
	e := &entity{}
	e = &entity{
		id:     id,
		Name:   name,
		Pos:    p,
		Facing: e.createInitialFacing(),
		Blocks: e.createIsBlocks(name),
		Mobile: e.createIsMobile(name),
		Combat: e.createCombatStats(name),
	}
	return e
}

func (e *entity) createInitialFacing() rune {
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

func (e *entity) createIsBlocks(name string) bool {
	switch name {
	case "player", "rat", "mole rat":
		return true
	}
	return false
}

func (e *entity) createIsMobile(name string) bool {
	switch name {
	case "player", "rat", "mole rat":
		return true
	}
	return false
}
func (e *entity) createCombatStats(name string) combat {
	c := combat{}
	switch name {
	case "player":
		c = combat{
			MaxHP:   30,
			HP:      30,
			Attack:  5,
			Defence: 5,
		}
	case "rat":
		c = combat{
			MaxHP:   7,
			HP:      7,
			Attack:  3,
			Defence: 2,
		}
	case "mole rat":
		c = combat{
			MaxHP:   15,
			HP:      15,
			Attack:  4,
			Defence: 4,
		}
	}
	return c
}
