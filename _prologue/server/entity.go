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

func (e *entity) move(action string, m zoneMap, es entities) bool {
	switch action {
	case "UP":
		e.Target.Y--
	case "UPRIGHT":
		e.Target.X++
		e.Target.Y--
	case "RIGHT":
		e.Target.X++
	case "DOWNRIGHT":
		e.Target.X++
		e.Target.Y++
	case "DOWN":
		e.Target.Y++
	case "DOWNLEFT":
		e.Target.X--
		e.Target.Y++
	case "LEFT":
		e.Target.X--
	case "UPLEFT":
		e.Target.X--
		e.Target.Y--
	}
	if !es.isPointEmpty(e.Target) {
		e.Target = e.Current
		return false
	}
	isDiagonal := sliceContainsString(action, diagonalMovements)
	if m.isWalkableP(e.Target) && !isDiagonal {
		e.Current = e.Target
		return true
	}
	if isDiagonal && e.canMoveDiagonal(action, m) && m.isWalkableP(e.Target) {
		e.Current = e.Target
		return true
	}
	e.Target = e.Current
	return false
}

func (e *entity) canMoveDiagonal(action string, m zoneMap) bool {
	switch action {
	case "UPRIGHT":
		if !m.isWalkable(e.Current.X, e.Current.Y-1) {
			return false
		}
		if !m.isWalkable(e.Current.X+1, e.Current.Y) {
			return false
		}
	case "DOWNRIGHT":
		if !m.isWalkable(e.Current.X, e.Current.Y+1) {
			return false
		}
		if !m.isWalkable(e.Current.X+1, e.Current.Y) {
			return false
		}
	case "DOWNLEFT":
		if !m.isWalkable(e.Current.X, e.Current.Y+1) {
			return false
		}
		if !m.isWalkable(e.Current.X-1, e.Current.Y) {
			return false
		}
	case "UPLEFT":
		if !m.isWalkable(e.Current.X, e.Current.Y-1) {
			return false
		}
		if !m.isWalkable(e.Current.X-1, e.Current.Y) {
			return false
		}
	}
	return true
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
