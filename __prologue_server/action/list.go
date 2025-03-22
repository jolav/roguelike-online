/* */

package action

import (
	"prologue/lib"
	"slices"
	"strings"
)

var diagonalMovements = []string{
	"UPRIGHT",
	"UPLEFT",
	"DOWNRIGHT",
	"DOWNLEFT",
}

var movements = []string{
	"UP",
	"DOWN",
	"LEFT",
	"RIGHT",
	"UPRIGHT",
	"UPLEFT",
	"DOWNRIGHT",
	"DOWNLEFT",
}

func CreateList() *lib.Set {
	tasks := lib.NewSet()
	tasks.Add("DOWNLEFT")
	tasks.Add("DOWN")
	tasks.Add("DOWNRIGHT")
	tasks.Add("LEFT")
	tasks.Add("SKIP")
	tasks.Add("RIGHT")
	tasks.Add("UPLEFT")
	tasks.Add("UP")
	tasks.Add("UPRIGHT")
	tasks.Add("INVENTORY")
	tasks.Add("LOOT")
	tasks.Add("EAT")
	tasks.Add("HEAL")
	tasks.Add("FIRE")
	tasks.Add("SELECT")
	return tasks
}

func GetType(task string) string {
	if isAMovement(task) {
		return "MOVE"
	}
	return strings.ToUpper(task)
}

func IsDiagonalMovement(task string) bool {
	return slices.Contains(diagonalMovements, task)
}

func isAMovement(task string) bool {
	return slices.Contains(movements, task)
}
