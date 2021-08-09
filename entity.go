/* */

package main

type entities map[int]*entity

type entity struct {
	id     int
	Name   string `json:"name"`
	Pos    point  `json:"pos"`
	Facing rune   `json:"facing"`
}

type point struct {
	X int
	Y int
}

func (p point) getCoords() (x, y int) {
	return p.X, p.Y
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
