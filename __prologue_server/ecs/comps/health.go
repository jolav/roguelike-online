/* */

package comps

type Health struct {
	MaxHp     int
	CurrentHP int
}

func NewHealth(max, current int) Health {
	return Health{
		MaxHp:     max,
		CurrentHP: current,
	}
}
