/* */

package main

type runs map[string]*run

type run struct {
	Nick     string             `json:"nick"`
	Token    string             `json:"token"`
	View     [][]string         `json:"view"`
	Legend   map[string]string  `json:"legend"`
	Entities map[string]*entity `json:"entities"`
	Map      *gameMap           `json:"-"`
	Fov      *FieldOfVision     `json:"-"`
}

func (rs *runs) newRun(c *config) *run {
	r := newRunCreator(c)
	(*rs)[r.Token] = r
	r.Fov.initFOV()
	r.Map.initializeRandomMap()
	r.Entities["player"] = newEntity(r.Map.Width/2, r.Map.Height/2, "@")
	return r
}

func (rs *runs) delete(token string) {
	if rs.exists(token) {
		delete(*rs, token)
	}
}

func (rs *runs) exists(token string) bool {
	_, ok := (*rs)[token]
	if ok {
		return true
	}
	return false
}

func newRunCreator(c *config) *run {
	return &run{
		Nick:     getRandomNick(c.LenChars, c.LenIntegers),
		Token:    getRandomString(c.TokenLength),
		View:     get2dArray(c.ViewWidth, c.ViewHeight),
		Legend:   getLegend(),
		Entities: newEntities(),
		Map: &gameMap{
			Width:  c.MapWidth,
			Height: c.MapHeight,
		},
		Fov: &FieldOfVision{},
	}
}

func newRuns() runs {
	return make(map[string]*run)
}

func getLegend() map[string]string {
	var legend = make(map[string]string)
	legend["unknown"] = "\u00A0" // blank space
	legend["wall"] = "#"
	legend["floor"] = "."
	legend["hero"] = "@"
	legend["wallVisited"] = "##"
	legend["floorVisited"] = ".."
	return legend
}
