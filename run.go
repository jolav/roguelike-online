/* */

package main

import (
	"math/rand"
	"time"
)

type runs map[string]*run

type run struct {
	Nick           string            `json:"nick"`
	Token          string            `json:"token"`
	GameOver       bool              `json:"gameOver"`
	Seed           int64             `json:"-"`
	View           [][]string        `json:"view"`
	History        []string          `json:"history"`
	Legend         map[string]string `json:"legend"`
	Entities       entities          `json:"-"`
	PublicEntities []entity          `json:"entities"`
	Map            *gameMap          `json:"-"`
	Fov            *fieldOfVision    `json:"-"`
}

func (rs *runs) newRun(c *config) *run {
	seed := time.Now().UnixNano()
	rand.Seed(seed)
	r := newRunCreator(c)
	(*rs)[r.Token] = r
	r.Seed = seed
	r.Fov.initFOV()
	r.Map.initializeRandom()
	//r.Map.initializeRandomFIXED()
	r.Map.populate(r)
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
		Nick:           getRandomNick(c.LenChars, c.LenIntegers),
		Token:          getRandomString(c.TokenLength),
		GameOver:       false,
		View:           get2dArray(c.ViewWidth, c.ViewHeight),
		History:        make([]string, 0),
		Legend:         getLegend(),
		Entities:       newEntities(),
		PublicEntities: newPublicEntities(),
		Map: &gameMap{
			Width:  c.MapWidth,
			Height: c.MapHeight,
		},
		Fov: &fieldOfVision{},
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
	legend["wallVisited"] = "##"
	legend["floorVisited"] = ".."
	legend["path"] = "="
	return legend
}
