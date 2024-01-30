/* */

package main

import (
	"math/rand"
)

type tile struct {
	Terrain  string `json:"terrain"`
	Walkable bool   `json:"walkable"`
	BlockLOS bool   `json:"blockLOS"`
	Explored bool   `json:"explored"`
	Visible  bool   `json:"visible"`
}

func (t tile) create(terrain string) tile {
	switch terrain {
	case "floor":
		return tile{terrain, true, false, false, false}
	case "wall":
		return tile{terrain, false, true, false, false}
	case "unknown":
		return tile{terrain, false, true, false, false}
	}
	return tile{}
}

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

type zonesConf []zoneConf

type zoneConf struct {
	MAX_ROOMS           int `json:"max_rooms"`
	MIN_SIZE_ROOM       int `json:"min_size_room"`
	MAX_SIZE_ROOM       int `json:"max_size_room"`
	MIN_CORRIDOR_LENGTH int `json:"min_corridor_length"`
	MAX_CORRIDOR_LENGTH int `json:"max_corridor_length"`
	CORRIDOR_ODDS       int `json:"corridor_odds"`
	MAP_COLS            int `json:"map_cols"`
	MAP_ROWS            int `json:"map_rows"`
	MAX_NPCS            int `json:"max_npcs"`
}

type zoneMap struct {
	id    int
	c     zoneConf
	cam   camera
	tiles [][]tile
}

func generateShelterLevelFitsScreen(x rand.Rand, cols, rows int) zoneMap {
	zones := make(map[string]zoneConf)
	loadJSONFile("./shelter.json", &zones)
	m := zoneMap{
		id:    1,
		c:     zones["1"],
		cam:   *newCamera(cols, rows),
		tiles: nil,
	}
	m.tiles = m.fillMapWith("floor")
	m.cleanRoom("wall")
	m.putColumns(100, x)
	return m
}

func (m zoneMap) putColumns(many int, rnd rand.Rand) {
	for c := 0; c < many; c++ {
		x := randomInt(1, m.cam.cols-1, rnd)
		y := randomInt(1, m.cam.rows-1, rnd)
		if m.tiles[y][x].Walkable == true {
			m.tiles[y][x] = tile{}.create("wall")
		}
	}
}

func (m zoneMap) cleanRoom(fill string) {
	for y := 0; y < m.cam.rows; y++ {
		for x := 0; x < m.cam.cols; x++ {
			if y == 0 || x == 0 || x == m.cam.cols-1 || y == m.cam.rows-1 {
				m.tiles[y][x] = tile{}.create(fill)
			}
		}
	}
}

func (m zoneMap) fillMapWith(fill string) [][]tile {
	tiles := make([][]tile, m.cam.rows)
	for i := range tiles {
		tiles[i] = make([]tile, m.cam.cols)
	}
	for y := 0; y < m.cam.rows; y++ {
		for x := 0; x < m.cam.cols; x++ {
			tiles[y][x] = tile{}.create(fill)
		}
	}
	return tiles
}
