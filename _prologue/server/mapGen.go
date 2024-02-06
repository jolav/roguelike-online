/* */

package main

import (
	"math/rand"
)

type room struct {
	X      int
	Y      int
	Width  int
	Height int
}

type wall struct {
	X   int
	Y   int
	Nei int
	Dir string
}

type feature struct {
	Width  int
	Height int
}

func (m zoneMap) generateShelter() [][]tile {
	m.tiles = m.createMap()
	m.fillMapWith("floor")
	m.cleanRoom("wall")
	m.putColumns(100, m.rnd)
	return m.tiles
}

func (m zoneMap) putColumns(many int, rnd rand.Rand) {
	for c := 0; c < many; c++ {
		x := randomInt(1, m.k.COLS-1, rnd)
		y := randomInt(1, m.k.ROWS-1, rnd)
		if m.tiles[y][x].Walkable == true {
			m.tiles[y][x] = tile{}.create("wall")
		}
	}
}

func (m zoneMap) cleanRoom(fill string) {
	for y := 0; y < m.k.ROWS; y++ {
		for x := 0; x < m.k.COLS; x++ {
			if y == 0 || x == 0 || x == m.k.COLS-1 || y == m.k.ROWS-1 {
				m.tiles[y][x] = tile{}.create(fill)
			}
		}
	}
}
func (m zoneMap) createMap() [][]tile {
	m.tiles = make([][]tile, m.k.ROWS)
	for i := range m.tiles {
		m.tiles[i] = make([]tile, m.k.COLS)
	}
	for y := 0; y < m.k.ROWS; y++ {
		for x := 0; x < m.k.COLS; x++ {
			m.tiles[y][x] = tile{}
		}
	}
	return m.tiles
}

func (m zoneMap) fillMapWith(fill string) {
	for y := 0; y < m.k.ROWS; y++ {
		for x := 0; x < m.k.COLS; x++ {
			m.tiles[y][x] = tile{}.create(fill)
		}
	}
}
