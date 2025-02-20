/* */

package main

import "fmt"

type Runs map[string]*Run

func (rs Runs) add(r Run) bool {
	if rs.exists(r.Info.Token) {
		return false
	}
	rs[r.Info.Token] = &r
	//rs.list()
	return true
}

func (rs Runs) delete(token string) {
	if rs.exists(token) {
		delete(rs, token)
	}
}

func (rs Runs) exists(token string) bool {
	_, ok := rs[token]
	if ok {
		return true
	}
	return false
}

func (rs Runs) list() {
	for token, r := range rs {
		fmt.Println(token, ":", r.Info.Nick)
	}
	fmt.Println("")
}

func (rs Runs) autoClean() {
	// cron job to remove/save inactive Runs
}

func NewRuns() *Runs {
	return &Runs{}
}
