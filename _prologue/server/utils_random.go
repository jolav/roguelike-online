/* */

package main

import (
	cryptoRand "crypto/rand"
	"encoding/base32"
	"math/rand"
	"strings"
)

func randomInt(min, max int, x rand.Rand) int {
	return x.Intn(max-min+1) + min
}

func randomInt2(min, max int) int {
	return rand.Intn(max-min+1) + min
}

func randomNick(nameLength, numbersLength int, file string) string {
	const chars = "abcdefghijklmnopqrstuvwxyz"
	const nums = "0123456789"
	var nick = "guest_"
	var b = searchLineInFile(file, randomInt2(1, 88799))
	if b == "" {
		aux := make([]byte, nameLength)
		for i := range aux {
			aux[i] = chars[rand.Intn(len(chars))]
		}
		b = string(aux)
		b = strings.ToUpper(string(aux))

	}
	nick += string(b) + "_"
	c := make([]byte, numbersLength)
	for i := range c {
		c[i] = nums[rand.Intn(len(nums))]
	}
	nick += string(c)
	return nick
}

func generateToken(n int) (string, error) {
	randomBytes := make([]byte, n)
	_, err := cryptoRand.Read(randomBytes)
	if err != nil {
		return "", err
	}
	token := base32.StdEncoding.WithPadding(base32.NoPadding).EncodeToString(randomBytes)
	return token, nil
}
