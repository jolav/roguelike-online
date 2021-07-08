/* */

package main

type runs map[string]*run

type run struct {
	Nick     string                     `json:"nick"`
	Token    string                     `json:"token"`
	View     [viewWidth][viewHeight]int `json:"view"`
	Entities map[string]*entity         `json:"entities"`
	Map      *gameMap                   `json:"-"`
}

func (rs *runs) add() *run {
	r := newRun()
	(*rs)[r.Token] = r
	r.Map.initializeMap()
	r.Entities["player"] = newEntity(viewWidth/2, viewHeight/2, "@")

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

func newRun() *run {
	return &run{
		Nick:     getRandomNick(lenChars, lenIntegers),
		Token:    getRandomString(tokenLength),
		View:     [viewWidth][viewHeight]int{},
		Entities: newEntities(),
		Map: &gameMap{
			Width:  mapWidth,
			Height: mapHeight,
		},
	}
}

func newRuns() runs {
	return make(map[string]*run)
}
