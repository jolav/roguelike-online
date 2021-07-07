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

const (
	tokenLength    int    = 100
	lenChars       int    = 4
	lenIntegers    int    = 2
	configJSONfile string = "./config.json"
	width          int    = 11
	height         int    = 21
)

var (
	version     = "0.0.4"
	releaseDate = "undefined"
	iLog        *log.Logger
)

type config struct {
	Mode          string `json:"mode"`
	Host          string `json:"host"`
	Port          int    `json:"port"`
	ErrorsLogFile string `json:"errorsLogFile"`
	InfoLogFile   string `json:"infoLogFile"`
}

type turn struct {
	comm   chan run
	token  string
	action string
}

type channels struct {
	askNewGame chan chan run
	askNewTurn chan turn
}

type app struct {
	Conf config
	Ch   channels
	Runs runs
}

func main() {
	checkFlags()

	// Load Conf
	var a app
	loadJSONfromFile(configJSONfile, &a.Conf)
	a.Ch = channels{
		askNewGame: make(chan chan run),
		askNewTurn: make(chan turn),
	}
	defer close(a.Ch.askNewGame)
	defer close(a.Ch.askNewTurn)
	a.Runs = newRuns()
	//prettyPrintStruct(a)

	// Custom Error Log File + Custom Info Log File
	createCustomInfoLogFile(a.Conf.InfoLogFile)
	var mylog *os.File
	if a.Conf.Mode == "production" {
		mylog = createCustomErrorLogFile(a.Conf.ErrorsLogFile)
	}
	defer mylog.Close()

	go httpServer(a)
	gameLoop(&a)

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
