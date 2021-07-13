/* */

package main

type entities map[string]*entity

type entity struct {
	X      int    `json:"x"`
	Y      int    `json:"y"`
	Char   string `json:"char"`
	Facing rune   `json:"facing"`
}

func (e *entity) move(dx, dy int) {
	e.X += dx
	e.Y += dy
}

func newEntity(x, y int, char string) *entity {
	return &entity{
		X:      x,
		Y:      y,
		Char:   char,
		Facing: 'N',
	}
}

func newEntities() entities {
	return make(map[string]*entity)
}
