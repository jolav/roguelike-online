/* */

package main

import (
	"encoding/json"
	"fmt"
	"math"
	"math/rand"
	"time"
)

func prettyPrintStruct(s interface{}) {
	result, _ := json.MarshalIndent(s, "", "    ") //"\t")
	fmt.Print(string(result), "\n")
}

func getRandomString(length int) string {
	const chars = "abcdefghijklmnopqrstuvwxyz" + "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "0123456789"
	var seed = rand.New(rand.NewSource(time.Now().UnixNano()))

	b := make([]byte, length)
	for i := range b {
		b[i] = chars[seed.Intn(len(chars))]
	}
	return string(b)
}

func getRandomNick(nameLength, numbersLength int) string {
	const chars = "abcdefghijklmnopqrstuvwxyz"
	const nums = "0123456789"
	var seed = rand.New(rand.NewSource(time.Now().UnixNano()))
	var nick = ""
	b := make([]byte, nameLength)
	for i := range b {
		b[i] = chars[seed.Intn(len(chars))]
	}
	nick += string(b)
	c := make([]byte, numbersLength)
	for i := range c {
		c[i] = nums[seed.Intn(len(nums))]
	}
	nick += string(c)
	return nick
}

func randomInt(min, max int) int {
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	return r.Intn(max-min+1) + min
}

func get2dArray(rows, cols int) [][]string {
	a := make([][]string, rows)
	for i := range a {
		a[i] = make([]string, cols)
	}
	return a
}

func round(f float64) float64 {
	return math.Floor(f + .5)
}
