/* */

package main

import (
	"encoding/json"
	"fmt"
	"strconv"
)

func prettyPrintStruct(s interface{}) {
	result, _ := json.MarshalIndent(s, "", "    ") //"\t")
	fmt.Print(string(result), "\n")
}

// SliceContainsString ... returns true/false
func sliceContainsString(str string, slice []string) bool {
	for _, v := range slice {
		if v == str {
			return true
		}
	}
	return false
}

func stringToInteger(s string, defaultValue int) int {
	res, err := strconv.Atoi(s)
	if err != nil {
		return defaultValue
	}
	return res
}
