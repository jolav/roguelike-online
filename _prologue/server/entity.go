/* */

package main

import (
	"roguelike-online/_prologue/server/components"
	"strconv"
)

type entity struct {
	Id                    int
	Name                  string `json:"name"`
	Kind                  string `json:"kind"`
	components.Position   `json:"pos"`
	components.Properties `json:"props"`
}

func (e *entity) isBlocking() bool {
	return e.Blocks
}

func (e *entity) isMobile() bool {
	return e.Mobile
}

func newEntity(p components.Point, counter int) *entity {
	x := p.X
	y := p.Y
	name := "name" + "_" + strconv.Itoa(counter)
	kind := "rat"
	e := &entity{
		Id:   counter,
		Name: name,
		Kind: kind,
		Position: components.Position{
			Current: components.Point{
				X: x,
				Y: y,
			},
			Target: components.Point{
				X: x,
				Y: y,
			},
			View: components.Point{
				X: -1,
				Y: -1,
			},
		},
		Properties: components.Properties{
			Blocks: true,
			Mobile: true,
		},
	}
	return e
}
