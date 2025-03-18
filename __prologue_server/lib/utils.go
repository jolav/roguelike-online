/* */

package lib

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math"
	"os"
	"regexp"
)

func LoadJSONFile(filePath string, data any) {
	file, err := os.Open(filePath)
	if err != nil {
		log.Fatalln("Cannot open config file", err)
	}
	defer file.Close()
	body, err := io.ReadAll(file) // get file content
	if err != nil {
		log.Fatalln(err)
	}
	err = json.Unmarshal(body, &data)
	if err != nil {
		log.Fatalln(err)
	}
}

func PrettyPrintStructExported(s any) {
	result, _ := json.MarshalIndent(s, "", "    ") //"\t")
	fmt.Print(string(result), "\n")
}

func IsAlphanumeric(input string) bool {
	re := regexp.MustCompile(`^[a-zA-Z0-9]+$`)
	return re.MatchString(input)
}

func RoundFloat(f float64) float64 {
	return math.Floor(f + .5)
}
