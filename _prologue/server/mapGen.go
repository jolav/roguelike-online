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

func (m zoneMap) generateShelter(cols, rows int) [][]tile {
	m.tiles = m.fillMapWith(cols, rows, "floor")
	m.cleanRoom(cols, rows, "wall")
	m.putColumns(100, cols, rows, m.rnd)
	return m.tiles
}

func (m zoneMap) putColumns(many, cols, rows int, rnd rand.Rand) {
	for c := 0; c < many; c++ {
		x := randomInt(1, cols-1, rnd)
		y := randomInt(1, rows-1, rnd)
		if m.tiles[y][x].Walkable == true {
			m.tiles[y][x] = tile{}.create("wall")
		}
	}
}

func (m zoneMap) cleanRoom(cols, rows int, fill string) {
	for y := 0; y < rows; y++ {
		for x := 0; x < cols; x++ {
			if y == 0 || x == 0 || x == cols-1 || y == rows-1 {
				m.tiles[y][x] = tile{}.create(fill)
			}
		}
	}
}

func (m zoneMap) fillMapWith(cols, rows int, fill string) [][]tile {
	tiles := make([][]tile, rows)
	for i := range tiles {
		tiles[i] = make([]tile, cols)
	}
	for y := 0; y < rows; y++ {
		for x := 0; x < cols; x++ {
			tiles[y][x] = tile{}.create(fill)
		}
	}
	return tiles
}
