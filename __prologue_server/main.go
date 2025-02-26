/* */

package main

import (
	"os"
	"prologue/conf"
	"prologue/lib"
)

var version = "0.4"
var when = "undefined"

type system struct {
	Mode          string `json:"mode"`
	Port          int    `json:"port"`
	ErrorsLogFile string `json:"errorsLogFile"`
	InfoLogFile   string `json:"infoLogFile"`
}

type config struct {
	Tick    int `json:"tick"`
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
	if a.Sys.Mode == "dev" {
		//lib.PrettyPrintStructExported(a)
	}
	a = &app{
		Sys:  fixSystemConfig(a.Sys),
		Runs: NewRuns(),
		Cnf:  a.Cnf,
	}
	a.Cnf.Actions = conf.CreateActionsList()

	//Custom Error Log File
	var mylog *os.File
	if a.Sys.Mode != "dev" {
		mylog = createCustomErrorLogFile(a.Sys.ErrorsLogFile)
	}
	defer mylog.Close()

	go a.startHTTPServer()
	select {}
}
