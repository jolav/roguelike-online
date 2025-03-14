/* */

package mapa

func createMapAndfillWith(cols, rows int, fill string) Level {
	lvl := make([][]Tile, cols)
	for i := range lvl {
		lvl[i] = make([]Tile, rows)
	}
	for x := range cols {
		for y := range rows {
			lvl[x][y] = Tile{}.create(fill)
		}
	}
	return lvl
}
