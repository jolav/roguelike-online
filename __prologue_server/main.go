/* */

package main

import (
	"os"
	"prologue/lib"
)

var version = "0.1"
var when = "undefined"

type system struct {
	Mode          string   `json:"mode"`
	Port          int      `json:"port"`
	ErrorsLogFile string   `json:"errorsLogFile"`
	InfoLogFile   string   `json:"infoLogFile"`
	Token         string   `json:"token"`
	IPs           []string `json:"ips"`
}

type config struct {
	Version string `json:"version"`
}

type app struct {
	Sys system `json:"system"`
	Cnf config `json:"config"`
}

func main() {
	checkFlags(version, when)

	var a = new(app)

	lib.LoadJSONFile("./conf/conf.json", a)
	lib.LoadJSONFile("./conf/version.json", &a.Cnf)
	a = &app{
		Sys: fixSystemConfig(a.Sys),
		Cnf: a.Cnf,
	}

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
