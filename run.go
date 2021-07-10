/* */

package main

type runs map[string]*run

type run struct {
	Nick     string             `json:"nick"`
	Token    string             `json:"token"`
	View     [][]int            `json:"view"`
	Entities map[string]*entity `json:"entities"`
	Map      *gameMap           `json:"-"`
}

func (rs *runs) add(c *config) *run {
	r := newRun(c)
	(*rs)[r.Token] = r
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

func newRun(c *config) *run {
	return &run{
		Nick:     getRandomNick(c.LenChars, c.LenIntegers),
		Token:    getRandomString(c.TokenLength),
		View:     get2dArray(c.ViewWidth, c.ViewHeight),
		Entities: newEntities(),
		Map: &gameMap{
			Width:  c.MapWidth,
			Height: c.MapHeight,
		},
	}
}

func newRuns() runs {
	return make(map[string]*run)
}
