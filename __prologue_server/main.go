/* */

package main

import (
	"os"
	"prologue/lib"
)

var version = "0.3"
var when = "undefined"

type system struct {
	Mode          string `json:"mode"`
	Port          int    `json:"port"`
	ErrorsLogFile string `json:"errorsLogFile"`
	InfoLogFile   string `json:"infoLogFile"`
}

type config struct {
	Tick int `json:"tick"`
}

type app struct {
	Sys  system `json:"system"`
	Cnf  config `json:"config"`
	Runs *Runs
}

func main() {
	checkFlags(version, when)

	var a = new(app)

	switch getMode() {
	case "prod":
		lib.LoadJSONFile("./conf/conf_private.json", a)
	case "dev":
		lib.LoadJSONFile("./conf/conf.json", a)
		lib.PrettyPrintStructExported(a)
	}
	a = &app{
		Sys:  fixSystemConfig(a.Sys),
		Runs: NewRuns(),
	}

	//Custom Error Log File
	var mylog *os.File
	if a.Sys.Mode != "dev" {
		mylog = createCustomErrorLogFile(a.Sys.ErrorsLogFile)
	}
	defer mylog.Close()

	go a.startHTTPServer()
	select {}
}
