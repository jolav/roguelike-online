/* */

package main

import (
	"encoding/json"
	"log"
)

func getConfigJSON() (configjson []byte) {

	configjson = []byte(`
	{
		"system": {
			"mode": "dev",
			"host": "localhost",
			"port": 3000,
			"errorsLogFile": "logs/errors.log",
			"infoLogFile": "logs/info.log"
		},
		"config": {
			"tokenLength" : 100,
			"lenChars"    : 4,
			"lenIntegers" : 2,
			"mapWidth"    : 100,
			"mapHeight"   : 100,
			"viewWidth"   : 31,
			"viewHeight"  : 25
		}
	}
	`)

	return
}

func loadConfigJSON(a *app) {
	err := json.Unmarshal(getConfigJSON(), a)
	if err != nil {
		log.Fatal("Error parsing JSON config => \n", err)
	}
}
