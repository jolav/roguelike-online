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
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	u "github.com/jolav/roguelike-online/utils"
)

var version = "0.0.0"
var releaseDate = "undefined"

var iLog *log.Logger

type app struct {
	Conf struct {
		Mode          string `json:"mode"`
		Host          string `json:"host"`
		Port          int    `json:"port"`
		ErrorsLogFile string `json:"errorsLogFile"`
		InfoLogFile   string `json:"infoLogFile"`
	} `json:"config"`
}

func main() {
	checkFlags()

	// Load Conf
	var a app
	loadConfigJSON(&a)
	a.Conf.Mode = u.CheckAppMode()
	u.PrettyPrintStruct(a)

	// Custom Error Log File + Custom Info Log File
	createCustomInfoLogFile(a.Conf.InfoLogFile)
	var mylog *os.File
	if a.Conf.Mode == "production" {
		mylog = createCustomErrorLogFile(a.Conf.ErrorsLogFile)
	}
	defer mylog.Close()

	// Server
	http.DefaultClient.Timeout = 5 * time.Second
	mux := http.NewServeMux()

	mux.HandleFunc("/new", newGame)
	mux.HandleFunc("/load", loadGame)
	mux.HandleFunc("/action", action)
	mux.HandleFunc("/",
		func(w http.ResponseWriter, r *http.Request) {
			u.ErrorResponse(w, "Bad Request !")
		})

	server := http.Server{
		Addr:           fmt.Sprintf("localhost:%d", a.Conf.Port),
		Handler:        mux,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   30 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	log.Printf("Server up listening %s in mode %s", server.Addr, a.Conf.Mode)
	server.ListenAndServe()
}

func newGame(w http.ResponseWriter, r *http.Request) {
	fmt.Println("NEW GAME")
}

func loadGame(w http.ResponseWriter, r *http.Request) {
	fmt.Println("LOAD GAME")
}

func action(w http.ResponseWriter, r *http.Request) {
	fmt.Println("ACTION")
}
