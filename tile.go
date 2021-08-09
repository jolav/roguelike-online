/* */

package main

type tile struct {
	Terrain  string `json:"terrain"`
	Blocked  bool   `json:"blocked"`
	BlockLOS bool   `json:"blockLOS"`
	Explored bool   `json:"explored"`
	Visible  bool   `json:"visible"`
}

func (t tile) set(terrain string) tile {
	switch terrain {
	case "floor":
		return tile{terrain, false, false, false, false}
	case "wall":
		return tile{terrain, true, true, false, false}
	case "unknown":
		return tile{terrain, true, true, false, false}
	}
	return tile{}
}
