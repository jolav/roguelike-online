/* */

package action

import (
	"prologue/lib"
)

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
