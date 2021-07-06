/* */

package main

type runs map[string]run

func newRuns() runs {
	return make(map[string]run)
}

func (rs *runs) add() run {
	aux := *newRun()
	(*rs)[aux.Token] = aux
	return aux
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
