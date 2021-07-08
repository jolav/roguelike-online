/* */

package main

type entities map[string]*entity

type entity struct {
	X    int    `json:"x"`
	Y    int    `json:"y"`
	Char string `json:"char"`
}

func (e *entity) move(dx, dy int) {
	e.X += dx
	e.Y += dy
}

func newEntity(x, y int, char string) *entity {
	return &entity{
		X:    x,
		Y:    y,
		Char: char,
	}
}

func newEntities() entities {
	return make(map[string]*entity)
}
