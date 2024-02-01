/* */

package main

import (
	"math/rand"
)

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
	id  int
	c   zoneConf
	cam camera
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

func newGameMap(rnd rand.Rand, camCols, camRows int) zoneMap {
	zones := make(map[string]zoneConf)
	loadJSONFile("./shelter.json", &zones)
	m := zoneMap{
		id:    1,
		c:     zones["1"],
		cam:   *newCamera(camCols, camRows),
		rnd:   rnd,
		tiles: nil,
	}
	//prettyPrintStructExported(m.c)
	var option = 1
	var cols = [2]int{m.cam.cols, m.c.MAP_COLS} // adjust map to screen
	var rows = [2]int{m.cam.rows, m.c.MAP_ROWS}
	m.tiles = m.generateShelter(cols[option], rows[option])
	return m
}
