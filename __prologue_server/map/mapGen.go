/* */

package mymap

import (
	"math/rand"
)

type Level [][]Tile

func NewLevel(lvlType string, x *rand.Rand, cols, rows int) Level {
	switch lvlType {
	case "testRoom":
		return testRoom(x, cols, rows)
	case "shelter":
		return newShelterMap(x, cols, rows)
	}
	return nil
}
