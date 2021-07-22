/* */

package main

type entities map[int]*entity

type entity struct {
	Name   string `json:"name"`
	Blocks bool   `json:"blocks"`
	Mobile bool   `json:"mobile"`
	Pos    pos    `json:"pos"`
	Combat combat `json:"combat"`
}

type pos struct {
	X      int    `json:"x"`
	Y      int    `json:"y"`
	Char   string `json:"char"`
	Facing rune   `json:"facing"`
}

type combat struct {
	HP      int `json:"hp"`
	MaxHP   int `json:"maxhp"`
	Attack  int `json:"attack"`
	Defence int `json:"defende"`
}

func (e *entity) move(dx, dy int) {
	e.Pos.X += dx
	e.Pos.Y += dy
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

func (e *entity) attack(target *entity) {
	d6 := randomInt(1, 6)
	damage := e.Combat.Attack + d6 - target.Combat.Defence
	if damage > 0 {
		target.Combat.HP -= damage
	}
}

func (e *entity) isDead() bool {
	if e.Combat.HP > 0 {
		return false
	}
	return true
}

func (p pos) add(p2 pos) pos {
	return pos{
		X: p.X + p2.X,
		Y: p.Y + p2.Y,
	}
}

func (p pos) at(grid [][]int) (int, bool) {
	if p.X < 0 || p.X >= len(grid) {
		return 0, false
	}
	if p.Y < 0 || p.Y >= len(grid[p.X]) {
		return 0, false
	}
	return grid[p.X][p.Y], true
}

func newEntity(name string, block bool, mob bool, p pos, c combat) *entity {
	return &entity{
		Name:   name,
		Blocks: block,
		Mobile: mob,
		Pos:    p,
		Combat: c,
	}
}

func newEntities() entities {
	return entities{}
}

func newPublicEntities() []entity {
	return make([]entity, 0) //[]entity{}
}
