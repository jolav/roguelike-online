/*
go build -ldflags="-X 'main.releaseDate=$(date -u +%F_%T)'" -o prologueBin
*/

package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"os"
	"os/user"
	"strings"
)

var version = "0.0.3"
var releaseDate = "undefined"

type config struct {
	Mode     string
	Port     int
	LogsFile string
	DevHosts []string
}

type app struct {
	Cnf  config
	Runs runs
}

func main() {
	checkFlags()

	a := &app{
		Cnf:  setupConfig(),
		Runs: make(map[string]run),
	}
	prettyPrintStruct(a)
	// Custom Error Log File
	var mylog *os.File
	if a.Cnf.Mode == "production" {
		mylog = createCustomLogsFile(a.Cnf.LogsFile)
	}
	defer mylog.Close()

	go a.httpServerLaunch()
	a.gameLoop()
	log.Print("Exit")
}

///// Config Functions /////

func setupConfig() config {
	var c config
	err := json.Unmarshal(getGlobalConfigJSON(), &c)
	if err != nil {
		log.Fatalf("ERROR Loading Global Config -> %s\n", err)
	}

	serverName, err := os.Hostname()
	if err != nil {
		log.Fatalf("ERROR Reading Servername -> %s\n", err)
	}
	serverName = strings.ToLower(serverName)
	if sliceContainsString(serverName, c.DevHosts) {
		c.Mode = "dev"
		c.Port = 3000
	}

	return c
}

// getGlobalConfigJSON example
func FAKE_getGlobalConfigJSON() []byte {
	configjson := []byte(`
	{
		"mode": "production",
		"port": 17135,
		"logsFile": "path/to/logs/file/logsfile.log",
		"devHosts" : [
			"a",
			"b",
			"c",
		]
		}
	`)

	return configjson
}

func createCustomLogsFile(f string) *os.File {
	usernow, err := user.Current()
	if err != nil {
		log.Fatalf("ERROR Reading usernow -> %s\n", err)
	}
	f = usernow.HomeDir + f
	mylog, err := os.OpenFile(f, os.O_WRONLY|os.O_CREATE|os.O_APPEND, 0644)
	if err != nil {
		log.Fatalf("ERROR Opening Logs File %s\n", err)
	}
	log.SetOutput(mylog)
	return mylog
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
