/*
// LINUX
go build -o roguelike -ldflags="-X 'main.releaseDate=$(date -u +%F_%T)'"
//
// WIN 64
GOOS=windows GOARCH=amd64 CGO_ENABLED=1 CC=x86_64-w64-mingw32-gcc go build -ldflags="-X 'main.releaseDate=$(date -u +%F_%T)'" -o roguelike.exe
//
*/

package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"os"
	"strings"
)

var (
	version     = "0.0.10"
	releaseDate = "undefined"
	iLog        *log.Logger
)

type system struct {
	Mode          string   `json:"mode"`
	Host          string   `json:"host"`
	Port          int      `json:"port"`
	ErrorsLogFile string   `json:"errorsLogFile"`
	InfoLogFile   string   `json:"infoLogFile"`
	DevHosts      []string `json:"devHosts"`
}

type config struct {
	TokenLength  int `json:"tokenLength"`
	NickChars    int `json:"nickChars"`
	NickIntegers int `json:"nickIntegers"`
}

type turn struct {
	comm   chan run
	token  string
	action string
}

type channels struct {
	askGame chan chan run
	askTurn chan turn
}

type app struct {
	Sys  system `json:"system"`
	Cnf  config `json:"config"`
	Ch   channels
	Runs runs
}

func main() {
	checkFlags()

	// Load Conf
	var a = new(app)
	loadConfigJSON(a)
	a = &app{
		Sys: checkMode(a.Sys),
		Cnf: a.Cnf,
		Ch: channels{
			askGame: make(chan chan run),
			askTurn: make(chan turn),
		},
		Runs: make(map[string]*run),
	}
	defer close(a.Ch.askGame)
	defer close(a.Ch.askTurn)

	//Custom Error Log File + Custom Info Log File
	createCustomInfoLogFile(a.Sys.InfoLogFile)
	var mylog *os.File
	if a.Sys.Mode != "dev" {
		mylog = createCustomErrorLogFile(a.Sys.ErrorsLogFile)
	}
	defer mylog.Close()

	prettyPrintStruct(a)
	go a.httpServer()
	a.gameLoop()
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

func checkMode(s system) system {
	serverName, _ := os.Hostname()
	serverName = strings.ToLower(serverName)
	if sliceContainsString(serverName, s.DevHosts) {
		s.Mode = "dev"
		s.Port = 3000
	}
	return s
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

func loadConfigJSON(a *app) {
	err := json.Unmarshal(getConfigJSON(), a)
	if err != nil {
		log.Fatal("Error parsing JSON config => \n", err)
	}
}

func FAKE__getGlobalConfigJSON() (configjson []byte) {
	// real getGlobalConfigJSON() in a_private.go file
	configjson = []byte(`
	{
		"system": {
			"mode": "production",
			"host": "X.X.X.X",
			"port": XXXXX,
			"errorsLogFile": "path/to/errors/log/file",
			"infoLogFile": "path/to/info/log/file",
			"devHosts" : [
				"name1",
				"name2",
				"name3",
				"name4"
			]
		},
		"config": {
			"tokenLength" : 60,
			"nickChars"    : 6,
			"nickIntegers" : 3
		}
	}
	`)
	return
}
