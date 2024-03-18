/* */

package main

import (
	"math/rand"
)

type zonesConf []zoneConf

type zoneConf struct {
	ROOMS               int `json:"rooms"`
	ROOM_MIN_SIZE       int `json:"room_min_size"`
	ROOM_MAX_SIZE       int `json:"room_max_size"`
	CORRIDOR_MIN_LENGTH int `json:"corridor_min_length"`
	CORRIDOR_MAX_LENGTH int `json:"corridor_max_length"`
	CORRIDOR_ODDS       int `json:"corridor_odds"`
	COLS                int `json:"cols"`
	ROWS                int `json:"rows"`
	TRIES               int `json:"-"`
}

type zoneMap struct {
	ID  int
	K   zoneConf
	rnd rand.Rand
	Tiles
}

type Tiles [][]tile

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

func (m zoneMap) isWalkable(x, y int) bool {
	if m.Tiles[y][x].Walkable {
		return true
	} else {
		return false
	}
}

func (m zoneMap) isBlockingLOS(x, y int) bool {
	if m.Tiles[y][x].BlockLOS {
		return true
	} else {
		return false
	}
}

func (m zoneMap) isExplored(x, y int) bool {
	if m.Tiles[y][x].Explored {
		return true
	} else {
		return false
	}
}

func (m zoneMap) isVisible(x, y int) bool {
	if m.Tiles[y][x].Visible {
		return true
	} else {
		return false
	}
}

func newGameMap(rnd rand.Rand, cam camera) zoneMap {
	zones := make(map[string]zoneConf)
	loadJSONFile("./shelter.json", &zones)
	m := zoneMap{
		ID:    1,
		K:     zones["1"],
		rnd:   rnd,
		Tiles: [][]tile{},
	}
	m.K.TRIES = 9999
	var option = 0 // 0 => adjust map to screen for testing
	if option == 0 {
		m.K.COLS = cam.Cols
		m.K.ROWS = cam.Rows
	}
	m.Tiles = m.generateShelter()
	return m
}
