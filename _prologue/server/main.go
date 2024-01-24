/*
go build -ldflags="-X 'main.releaseDate=$(date -u +%F_%T)'" -o prologue
*/

package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"os/user"
	"strings"
)

var (
	version     = "0.1.0"
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

type app struct {
	Sys system `json:"system"`
}

func main() {
	checkFlags()

	// Load Conf
	var a = new(app)
	LoadJSONFile("./private.json", a)
	a = &app{
		Sys: checkMode(a.Sys),
	}

	//Custom Error Log File + Custom Info Log File
	createCustomInfoLogFile(a.Sys.InfoLogFile)
	var mylog *os.File
	if a.Sys.Mode != "dev" {
		mylog = createCustomErrorLogFile(a.Sys.ErrorsLogFile)
	}
	defer mylog.Close()

	prettyPrintStruct(a)

	go a.httpServerUP()
	gameLoop()
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
