/* */

package main

import (
	"encoding/json"
	"fmt"
	"math"
	"math/rand"
)

func sliceContainsString(str string, slice []string) bool {
	for _, v := range slice {
		if v == str {
			return true
		}
	}
	return false
}

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

func round(f float64) float64 {
	return math.Floor(f + .5)
}

func printMap(m [][]tile) {
	for y := 0; y < len(m); y++ {
		for x := 0; x < len(m[0]); x++ {
			fmt.Print(" ", m[y][x].Terrain, " ")
		}
		fmt.Println()
	}
}

func reversePointsArray(reverse []point) []point {
	for i, j := 0, len(reverse)-1; i < j; i, j = i+1, j-1 {
		reverse[i], reverse[j] = reverse[j], reverse[i]
	}
	return reverse
}
