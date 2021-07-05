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
	_, ok := (*rs)[token]
	if ok {
		delete(*rs, token)
	}
}
