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
	NPCS                int `json:"pcs"`
}

type zoneMap struct {
	id  int
	k   zoneConf
	rnd rand.Rand
	tiles
}

type tiles [][]tile

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

func newGameMap(rnd rand.Rand, cam camera) zoneMap {
	zones := make(map[string]zoneConf)
	loadJSONFile("./shelter.json", &zones)
	m := zoneMap{
		id:    1,
		k:     zones["1"],
		rnd:   rnd,
		tiles: [][]tile{},
	}
	var option = 0 // 0 => adjust map to screen for testing
	if option == 0 {
		m.k.COLS = cam.cols
		m.k.ROWS = cam.rows
	}
	m.tiles = m.generateShelter()
	return m
}
