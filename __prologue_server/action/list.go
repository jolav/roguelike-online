/* */

package action

import (
	"prologue/lib"
)

func CreateList() *lib.Set {
	actions := lib.NewSet()
	actions.Add("DOWNLEFT")
	actions.Add("DOWN")
	actions.Add("DOWNRIGHT")
	actions.Add("LEFT")
	actions.Add("SKIP")
	actions.Add("RIGHT")
	actions.Add("UPLEFT")
	actions.Add("UP")
	actions.Add("UPRIGHT")
	actions.Add("INVENTORY")
	actions.Add("LOOT")
	actions.Add("EAT")
	actions.Add("HEAL")
	actions.Add("FIRE")
	actions.Add("SELECT")
	return actions
}
