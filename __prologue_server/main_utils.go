/* */

package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"os/user"
)

func checkFlags(version, when string) {
	versionFlag := flag.Bool("v", false, "Show current Version and exit")
	flag.Parse()

	if *versionFlag {
		fmt.Printf("Version ->\t%s\n", version)
		fmt.Printf("Date    ->\t%s\n", when)
		os.Exit(0)
	}
}

func fixSystemConfig(s system) system {
	usernow, err := user.Current()
	if err != nil {
		log.Fatal(err)
	}
	s.ErrorsLogFile = usernow.HomeDir + s.ErrorsLogFile
	s.InfoLogFile = usernow.HomeDir + s.InfoLogFile
	return s
}

func createCustomErrorLogFile(f string) *os.File {
	mylog, err := os.OpenFile(f, os.O_WRONLY|os.O_CREATE|os.O_APPEND, 0644)
	if err != nil {
		log.Fatalf("ERROR opening Error log file %s\n", err)
	}
	log.SetOutput(mylog)
	return mylog
}
