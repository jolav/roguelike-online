/* */

package main

import (
	"os"
	"prologue/action"
	"prologue/lib"
)

var version = "0.4a"
var when = "undefined"

type system struct {
	Mode          string `json:"mode"`
	Port          int    `json:"port"`
	ErrorsLogFile string `json:"errorsLogFile"`
	InfoLogFile   string `json:"infoLogFile"`
}

type config struct {
	Tick    int    `json:"tick"`
	Version string `json:"version"`
	Actions *lib.Set
}

type app struct {
	Sys  system `json:"system"`
	Cnf  config `json:"config"`
	Runs *Runs
}

func main() {
	checkFlags(version, when)

	var a = new(app)

	lib.LoadJSONFile("./conf/conf.json", a)
	a = &app{
		Sys:  fixSystemConfig(a.Sys),
		Runs: NewRuns(),
		Cnf:  a.Cnf,
	}
	a.Cnf.Actions = action.CreateList()

	if a.Sys.Mode == "dev" {
		lib.PrettyPrintStructExported(a)
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
