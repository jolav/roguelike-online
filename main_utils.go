/* */

package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"os"
)

func getGlobalConfigJSON() (configjson []byte) {
	configjson = []byte(`
	{
		"config": {
			"mode": "production",
			"host": "localhost",
			"port": 6900,
			"errorsLogFile": "logs/errors.log",
			"infoLogFile":"logs/info.log"
		}
	}
	`)
	return
}

func checkFlags() {
	versionFlag := flag.Bool("v", false, "Show current version and exit")
	flag.Parse()
	switch {
	case *versionFlag:
		fmt.Printf("Version:\t: %s\n", version)
		fmt.Printf("Date   :\t: %s\n", releaseDate)
		os.Exit(0)
	}
}

func loadConfigJSON(a *app) {
	err := json.Unmarshal(getGlobalConfigJSON(), a)
	if err != nil {
		log.Fatal("Error parsing JSON config => \n", err)
	}
}

func createCustomInfoLogFile(f string) {
	infoLog, err := os.OpenFile(f, os.O_WRONLY|os.O_CREATE|os.O_APPEND, 0644)
	if err != nil {
		log.Fatalf("ERROR opening Info log file %s\n", err)
	}
	iLog = log.New(infoLog, "INFO :\t", log.Ldate|log.Ltime)
}

func createCustomErrorLogFile(f string) *os.File {
	mylog, err := os.OpenFile(f, os.O_WRONLY|os.O_CREATE|os.O_APPEND, 0644)
	if err != nil {
		log.Fatalf("ERROR opening Error log file %s\n", err)
	}
	log.SetOutput(mylog)
	return mylog
}
