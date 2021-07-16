/* */

package main

import (
	"encoding/json"
	"fmt"
	"math"
	"math/rand"
)

func prettyPrintStruct(s interface{}) {
	result, _ := json.MarshalIndent(s, "", "    ") //"\t")
	fmt.Print(string(result), "\n")
}

func getRandomString(length int) string {
	const chars = "abcdefghijklmnopqrstuvwxyz" + "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "0123456789"

	b := make([]byte, length)
	for i := range b {
		b[i] = chars[rand.Intn(len(chars))]
	}
	return string(b)
}

func getRandomNick(nameLength, numbersLength int) string {
	const chars = "abcdefghijklmnopqrstuvwxyz"
	const nums = "0123456789"
	var nick = ""
	b := make([]byte, nameLength)
	for i := range b {
		b[i] = chars[rand.Intn(len(chars))]
	}
	nick += string(b)
	c := make([]byte, numbersLength)
	for i := range c {
		c[i] = nums[rand.Intn(len(nums))]
	}
	nick += string(c)
	return nick
}

func randomInt(min, max int) int {
	return rand.Intn(max-min+1) + min
}

func get2dArray(cols, rows int) [][]string {
	a := make([][]string, cols)
	for i := range a {
		a[i] = make([]string, rows)
	}
	// a = array of size cols whose elements are array of size rows of string
	// [cols][rows]string
	return a
}

func round(f float64) float64 {
	return math.Floor(f + .5)
}
