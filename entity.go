/* */

package main

type entities map[int]*entity

type entity struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
	Pos  point  `json:"pos"`
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
		ID:   id,
		Name: name,
		Pos:  p,
	}
}
