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

var (
	version        = "0.9.0"
	releaseDate    = "undefined"
	iLog           *log.Logger
	configJSONFile = "./private.json"
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
	SurnameFile  string `json:"surnameFile"`
	TokenLength  int    `json:"tokenLength"`
	NickChars    int    `json:"nickChars"`
	NickIntegers int    `json:"nickIntegers"`
}

type turn struct {
	comm   chan run
	cam    string
	token  string
	action string
}

type channels struct {
	askGame       chan chan run
	askGameParams chan string
	askTurn       chan turn
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
	//loadJSONFile(configJSONFile, a)
	loadConfigJSON(a)

	a = &app{
		Sys: checkMode(a.Sys),
		Cnf: a.Cnf,
		Ch: channels{
			askGame:       make(chan chan run),
			askGameParams: make(chan string),
			askTurn:       make(chan turn),
		},
		Runs: make(map[string]*run),
	}
	defer close(a.Ch.askGame)
	defer close(a.Ch.askGameParams)
	defer close(a.Ch.askTurn)

	//Custom Error Log File + Custom Info Log File
	createCustomInfoLogFile(a.Sys.InfoLogFile)
	var mylog *os.File
	if a.Sys.Mode != "dev" {
		mylog = createCustomErrorLogFile(a.Sys.ErrorsLogFile)
	}
	defer mylog.Close()

	//prettyPrintStruct(a)

	go a.httpServerUP()
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
	var serverName, _ = os.Hostname()
	serverName = strings.ToLower(serverName)
	if sliceContainsString(serverName, s.DevHosts) {
		s.Mode = "dev"
		s.Port = 3000
	}
	usernow, err := user.Current()
	if err != nil {
		log.Fatal(err)
	}
	s.ErrorsLogFile = usernow.HomeDir + s.ErrorsLogFile
	s.InfoLogFile = usernow.HomeDir + s.InfoLogFile
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

func ExamplegetConfigJSON() (configjson []byte) {
	configjson = []byte(`
	{
		"system": {
			"mode": "dev",
			"host": "localhost",
			"port": 3000,
			"errorsLogFile": "/path/to/errors.log",
			"infoLogFile": "/path/to/info.log",
			"devHosts": [
				"dev1",
				"dev2"
			]
		},
		"config": {
			"surnameFile": "./aux/surname.txt",
			"tokenLength": 10,
			"nickChars": 8,
			"nickIntegers": 4
		}
	}
	`)
	return
}
