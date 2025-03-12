/* */

package action

import (
	"math/rand"
	"testing"
)

func TestInsert(t *testing.T) {
	q := Queue{}
	q = q.Insert(1, 10, true)
	q = q.Insert(2, 5, true)
	q = q.Insert(-1, 100, true)
	q = q.Insert(2, 0, true)
	if len(q) != 3 {
		t.Errorf("Expected queue length to be 2, got %d", len(q))
	}
}

func TestNext(t *testing.T) {
	q := Queue{}
	q = q.Insert(-1, 100, true)
	q = q.Insert(2, 0, true)
	q = q.Insert(1, 10, true)
	q = q.Insert(2, 5, true)
	nextID := q.Next()
	if nextID != 2 {
		t.Errorf("Expected next ID to be 1, got %d", nextID)
	}
}

func TestRemove(t *testing.T) {
	q := Queue{}
	q = q.Insert(1, 10, true)
	q = q.Insert(-1, 100, true)
	q = q.Insert(2, 500, true)
	q = q.Insert(2, 0, true)
	q = q.Remove(2)
	q = q.Insert(2, 500, true)
	if len(q) != 3 {
		t.Errorf("Expected queue length to be 3 after removal, got %d", len(q))
	}
	nextID := q.Next()
	if nextID != 1 && q[nextID].Value != 5 {
		t.Errorf("Expected next ID to be 1, got %d", nextID)
	}
}

func TestUpdateEntity(t *testing.T) {
	q := Queue{}
	q = q.Insert(-1, 100, true)
	q = q.Insert(2, 0, true)
	q = q.Insert(1, 10, true)
	q = q.UpdateEntity(1, 5)
	if len(q) != 3 {
		t.Errorf("Expected queue length to remain 3 after update, got %d", len(q))
	}
	for _, e := range q {
		if e.ID == 1 && e.Value != 15 {
			t.Errorf("Expected value to be 15, got %d", e.Value)
		}
	}
}

func TestUpdateTurn(t *testing.T) {
	q := Queue{}
	q = q.Insert(1, 210, true)
	q = q.Insert(-1, 100, true)
	q = q.Insert(2, 500, true)
	q = q.Insert(2, 0, true)
	q = q.Remove(2)
	q = q.Insert(2, 150, true)
	q = q.UpdateTurn(100)
	for _, e := range q {
		if e.ID == -1 && e.Value != 100 {
			t.Errorf("Expected value to be 100, got %d", e.Value)
		}
		if e.ID == 1 && e.Value != 110 {
			t.Errorf("Expected value to be 7, got %d", e.Value)
		}
		if e.ID == 2 && e.Value != 50 {
			t.Errorf("Expected value to be 2, got %d", e.Value)
		}
	}
}

func TestIsEmpty(t *testing.T) {
	q := Queue{}
	if !q.IsEmpty() {
		t.Errorf("Expected queue to be empty")
	}
	q = q.Insert(2, 0, true)
	q = q.Insert(1, 10, true)
	q = q.Insert(-1, 100, true)
	if q.IsEmpty() {
		t.Errorf("Expected queue not to be empty")
	}
}

func TestNewQueue(t *testing.T) {
	x := rand.New(rand.NewSource(42))
	es := []int{1, 2, 3}
	q := NewQueue(es, 1, x)
	if len(q) != 4 {
		t.Errorf("Expected queue length to be 4, got %d", len(q))
	}
}

func TestShow(t *testing.T) {
	q := Queue{}
	q = q.Insert(1, 10, true)
	q = q.Insert(-1, 100, true)
	q = q.Insert(2, 0, true)
	//q.Show()
}
