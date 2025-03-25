/* */

package comps

type Health struct {
	Max int
	HP  int
}

func NewHealth(max, current int) Health {
	return Health{
		Max: max,
		HP:  current,
	}
}
