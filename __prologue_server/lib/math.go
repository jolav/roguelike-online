/* */

package lib

import (
	"math"
)

func RoundFloat(f float64) float64 {
	return math.Floor(f + .5)
}
