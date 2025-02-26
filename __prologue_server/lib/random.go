/* */

package lib

import (
	cryptoRand "crypto/rand"
	"fmt"
	"io"
	"math/rand"
)

func GenerateUUID() (string, error) {
	uuid := make([]byte, 16)
	_, err := io.ReadFull(cryptoRand.Reader, uuid)
	if err != nil {
		return "", err
	}

	uuid[6] = (uuid[6] & 0x0f) | 0x40 // v4
	uuid[8] = (uuid[8] & 0x3f) | 0x80 // RFC 4122

	return fmt.Sprintf("%08x-%04x-%04x-%04x-%012x",
		uuid[0:4],
		uuid[4:6],
		uuid[6:8],
		uuid[8:10],
		uuid[10:]), nil
}

func RandomInt(min, max int, x *rand.Rand) int {
	return x.Intn(max-min+1) + min
}

func RandomInt2(min, max int) int {
	return rand.Intn(max-min+1) + min
}
