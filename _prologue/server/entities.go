/* */

package main

import (
	"roguelike-online/_prologue/server/components"
)

type entities map[int]*entity

func (es entities) atPoint(p components.Point) []entity {
	var resp = []entity{}
	for _, e := range es {
		if e.Current == p {
			resp = append(resp, *e)
		}
	}
	return resp
}

func (es entities) isPointEmpty(p components.Point) bool {
	var resp = es.atPoint(p)
	for _, v := range resp {
		//fmt.Println(v)
		if v.isBlocking() {
			return false
		}
	}
	return true
}
