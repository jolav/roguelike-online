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
	"flag"
	"fmt"
	"log"
	"os"
)

var (
	version     = "0.0.14"
	releaseDate = "undefined"
	iLog        *log.Logger
)

type system struct {
	Mode          string `json:"mode"`
	Host          string `json:"host"`
	Port          int    `json:"port"`
	ErrorsLogFile string `json:"errorsLogFile"`
	InfoLogFile   string `json:"infoLogFile"`
}

type config struct {
	TokenLength int `json:"tokenLength"`
	LenChars    int `json:"lenChars"`
	LenIntegers int `json:"lenIntegers"`
	MapWidth    int `json:"mapWidth"`
	MapHeight   int `json:"mapHeight"`
	ViewWidth   int `json:"viewWidth"`
	ViewHeight  int `json:"viewHeight"`
}

type turn struct {
	comm   chan *run
	token  string
	action string
}

type channels struct {
	askNewGame chan chan *run
	askNewTurn chan *turn
}

type app struct {
	Syst system `json:"system"`
	Conf config `json:"config"`
	Ch   channels
	Runs runs
}

func main() {
	checkFlags()

	// Load Conf
	var a = new(app)
	loadConfigJSON(a)

	a = &app{
		Syst: a.Syst,
		Conf: a.Conf,
		Ch: channels{
			askNewGame: make(chan chan *run),
			askNewTurn: make(chan *turn),
		},
		Runs: newRuns(),
	}
	defer close(a.Ch.askNewGame)
	defer close(a.Ch.askNewTurn)

	//Custom Error Log File + Custom Info Log File
	createCustomInfoLogFile(a.Syst.InfoLogFile)
	var mylog *os.File
	if a.Syst.Mode == "production" {
		mylog = createCustomErrorLogFile(a.Syst.ErrorsLogFile)
	}
	defer mylog.Close()

	prettyPrintStruct(a)

	go httpServer(a)
	gameLoop(a)
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
