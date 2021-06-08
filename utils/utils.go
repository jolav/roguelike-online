/* */

package _utils

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strings"
)

// LoadJSONConfig ...
func LoadJSONConfig(configjson []byte, c interface{}) {
	err := json.Unmarshal(configjson, &c)
	if err != nil {
		log.Printf("ERROR LoadConfig %s\n", err)
	}
}

// SliceContainsString ... returns true/false
func SliceContainsString(str string, slice []string) bool {
	for _, v := range slice {
		if v == str {
			return true
		}
	}
	return false
}

// PrettyPrintStruct ...
func PrettyPrintStruct(s interface{}) {
	result, _ := json.MarshalIndent(s, "", "    ") //"\t")
	fmt.Print(string(result), "\n")
}

const (
	validChars string = "abcdefghijklmnopqrstuvwxyz0123456789"
)

// CheckValidCharacters ...
func CheckValidCharacters(str string) bool {
	str = strings.ToLower(str)
	for _, char := range str {
		if !strings.Contains(validChars, string(char)) {
			return false
		}
	}
	return true
}

// CheckAppMode ...
func CheckAppMode() (mode string) {
	serverName, _ := os.Hostname()
	serverName = strings.ToLower(serverName)
	for _, value := range envsDev {
		if value == serverName {
			return "dev"
		}
	}
	return "production"
}

// CheckModeForCookieDomain ...
func CheckModeForCookieDomain() (domain string) {
	if CheckAppMode() == "dev" {
		return "localhost"
	}
	return domainNameForCookie
}

// CheckModeForCookieHTTPOnly ...
func CheckModeForCookieHTTPOnly() (httpOnly bool) {
	if CheckAppMode() == "dev" {
		return false
	}
	return true
}
