/* */

package main

type entities map[int]*entity

func (es entities) atPoint(p point) []entity {
	var resp = []entity{}
	for _, e := range es {
		if e.Pos == p {
			resp = append(resp, *e)
		}
	}
	return resp
}
