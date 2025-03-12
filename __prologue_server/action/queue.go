/* */

package action

import (
	"fmt"
	"math/rand"
	"prologue/lib"
	"slices"
	"sort"
)

type Queue []Event

type Event struct {
	ID    int
	Value int
}

func (q Queue) Insert(id, value int, standard bool) Queue {
	for _, e := range q {
		if e.ID == id {
			return q
		}
	}
	idx := sort.Search(len(q),
		func(i int) bool {
			if standard {
				return q[i].Value > value
			}
			return q[i].Value >= value
		},
	)
	return slices.Insert(q, idx, Event{id, value})
}

func (q Queue) Next() int {
	if q.IsEmpty() {
		return -2
	}
	nextEntity := q[0]
	return nextEntity.ID
}

func (q Queue) Remove(id int) Queue {
	for k, v := range q {
		if v.ID == id {
			return slices.Delete(q, k, k+1)
		}
	}
	return q
}

func (q Queue) UpdateEntity(eID, value int) Queue {
	for _, v := range q {
		if v.ID == eID {
			q = q.Remove(eID)
			q = q.Insert(eID, value+v.Value, true)
			return q
		}
	}
	return q
}

func (q Queue) UpdateTurn(turnValue int) Queue {
	for k := range q {
		if q[k].ID != -1 { // -1 is always 100
			q[k].Value -= turnValue
		}
	}
	q = q.Remove(-1)
	q = q.Insert(-1, 100, true) // add turn
	return q
}

func (q Queue) IsEmpty() bool {
	return len(q) == 0
}

func (q Queue) Show() {
	fmt.Println("QUEUE LIST =>", len(q))
	for k, v := range q {
		fmt.Println(k, " = ", v)
	}
	fmt.Println("############################################3####")
}

func NewQueue(es []int, playerID int, x *rand.Rand) Queue {
	q := Queue{}
	q = q.Insert(-1, 100, true) // add turn
	for _, eID := range es {
		if eID == playerID {
			q = q.Insert(playerID, 0, true) // add player
			continue
		}
		q = q.Insert(eID, 95+lib.RandomInt(0, 10, x), true)
	}
	//q.Show()
	return q
}
