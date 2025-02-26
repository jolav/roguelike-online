/* */

package comps

type Health struct {
	maxHp     int
	currentHP int
}

func NewHealth(max, current int) Health {
	return Health{
		maxHp:     max,
		currentHP: current,
	}
}
