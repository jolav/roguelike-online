/* */

package main

import (
	"errors"
	"math/rand"
	"net/http"
	"prologue/lib"
	mymap "prologue/map"
	"strconv"
	"strings"
	"time"
)

func (a app) NewRun(re *http.Request) (*Run, string, int) {
	re.ParseForm()
	nick := strings.ToUpper(re.Form.Get("nick"))
	if nick == "" {
		return &Run{}, "Nick is Empty", http.StatusBadRequest
	}
	if !lib.IsAlphanumeric(nick) {
		return &Run{}, "Nick contains invalid characters", http.StatusBadRequest
	}
	token, err := lib.GenerateUUID()
	if err != nil {
		return &Run{}, "Internal error server", http.StatusInternalServerError
	}
	seed := /*int64(1234567890) //*/ time.Now().UnixNano()

	colsString := re.Form.Get("cols")
	rowsString := re.Form.Get("rows")
	cols, err := strconv.Atoi(colsString)
	rows, err := strconv.Atoi(rowsString)
	if rows < 3 || rows > 150 || cols < 3 || cols > 300 {
		err = errors.New("ERROR")
	}
	if err != nil {
		return &Run{}, "Invalid parameters cols,rows", http.StatusBadRequest
	}

	var r = new(Run)
	// Info
	r.Info.Nick = nick
	r.Info.Token = token
	r.Info.Seed = seed
	r.Info.IP = lib.GetIP(re)
	r.Info.Created = time.Now()
	// Control
	r.Control.Counter = 0
	r.Control.Turn = 0
	r.Control.LastTurn = time.Now()

	r.Rnd = rand.New(rand.NewSource(seed))
	r.Level = mymap.NewLevel("shelter", r.Rnd, cols, rows)

	a.Runs.add(*r)
	//fmt.Println(r.Info.created.Format("2006-01-02 15:04:05"))
	//fmt.Println(r)
	return r, "", http.StatusOK
}
