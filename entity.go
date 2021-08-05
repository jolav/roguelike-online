/* */

package main

type entities map[int]entity

type entity struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
	Pos  point  `json:"pos"`
}

type point struct {
	X int
	Y int
}

func (e entity) move(dx, dy int) point {
	e.Pos.X += dx
	e.Pos.Y += dy
	return e.Pos
}

func newEntity(name string, id int, p point) entity {
	return entity{
		ID:   id,
		Name: name,
		Pos:  p,
	}
}
