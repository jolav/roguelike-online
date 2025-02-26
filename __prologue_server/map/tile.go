/* */

package mymap

type Tile struct {
	Terrain  string `json:"terrain"`
	Walkable bool   `json:"walkable"`
	BlockLOS bool   `json:"blockLOS"`
	Explored bool   `json:"explored"`
	Visible  bool   `json:"visible"`
}

func (t Tile) create(terrain string) Tile {
	switch terrain {
	case "floor":
		return Tile{terrain, true, false, false, false}
	case "wall":
		return Tile{terrain, false, true, false, false}
	case "unknown":
		return Tile{terrain, false, true, false, false}
	}
	return Tile{}
}
