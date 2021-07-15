/* */

package main

type entities map[int]*entity

type entity struct {
	Name      string `json:"name"`
	BlocksMov bool   `json:"blocksMov"`
	IsMobile  bool   `json:"isMobile"`
	Pos       pos    `json:"pos"`
	Combat    combat `json:"combat"`
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

func newEntity(name string, block bool, mob bool, p pos, c combat) *entity {
	return &entity{
		Name:      name,
		BlocksMov: block,
		IsMobile:  mob,
		Pos: pos{
			X:      p.X,
			Y:      p.Y,
			Char:   p.Char,
			Facing: 'N',
		},
		Combat: combat{
			HP:      c.HP,
			MaxHP:   c.MaxHP,
			Attack:  c.Attack,
			Defence: c.Defence,
		},
	}
}

func newEntities() entities {
	return entities{}
}

func newPublicEntities() []entity {
	return make([]entity, 0) //[]entity{}
}
