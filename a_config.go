/* */

package main

import (
	"encoding/json"
	"log"
)

const (
	tokenLength int = 100
	lenChars    int = 4
	lenIntegers int = 2
	mapWidth    int = 100
	mapHeight   int = 100
	viewWidth   int = 31
	viewHeight  int = 31
)

func getConfigJSON() (configjson []byte) {

	configjson = []byte(`
	{
		"mode": "dev",
		"host": "localhost",
		"port": 3000,
		"errorsLogFile": "logs/errors.log",
		"infoLogFile": "logs/info.log"
	}
	`)

	return
}

func loadConfigJSON(c *config) {
	err := json.Unmarshal(getConfigJSON(), c)
	if err != nil {
		log.Fatal("Error parsing JSON config => \n", err)
	}
}
