/* */

package main

import (
	"fmt"
	"log"
	"net/http"
	"time"
)

func (a *app) httpServerUP() {
	http.DefaultClient.Timeout = 5 * time.Second
	mux := http.NewServeMux()

	mux.HandleFunc("/new", a.newGame)
	mux.HandleFunc("/save", a.saveGame)
	mux.HandleFunc("/action", a.checkValid(
		func(w http.ResponseWriter, r *http.Request) {
			a.action(w, r)
		}))
	mux.HandleFunc("/ping", a.ping)
	mux.HandleFunc("/",
		func(w http.ResponseWriter, r *http.Request) {
			errorResponse(w, http.StatusBadRequest, "Bad Request !")
		})

	server := &http.Server{
		Addr:           fmt.Sprintf("%s:%d", a.Sys.Host, a.Sys.Port),
		Handler:        mux,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   30 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	log.Printf("Server up listening %s in mode %s", server.Addr, a.Sys.Mode)
	server.ListenAndServe()
}

func (a *app) newGame(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		errorResponse(w, http.StatusBadRequest, "Bad Request!")
		return
	}
	r.ParseForm()
	d := r.Form.Get("cam")
	t := r.Form.Get("token")
	newRunChannelParams := make(chan string)
	newRunChannel := make(chan run)
	defer close(newRunChannelParams)
	defer close(newRunChannel)
	a.Ch.askGameParams <- d + "-" + t
	a.Ch.askGame <- newRunChannel
	var runData run
	runData = <-newRunChannel
	if runData.issue == "" {
		sendJSONToClient(w, processNewGame(runData), http.StatusOK)
	} else {
		errorResponse(w, http.StatusExpectationFailed, runData.issue)
	}
}

func (a *app) action(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		errorResponse(w, http.StatusBadRequest, "Bad Request!")
		return
	}
	r.ParseForm()
	t := turn{
		token:  r.Form.Get("token"),
		action: r.Form.Get("action"),
		cam:    r.Form.Get("cam"),
		comm:   make(chan run),
	}
	defer close(t.comm)
	a.Ch.askTurn <- t
	runData := <-t.comm
	sendJSONToClient(w, processTurn(runData), http.StatusOK)
}

func (a *app) saveGame(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		errorResponse(w, http.StatusBadRequest, "Bad Request!")
		return
	}
	r.ParseForm()
	t := turn{
		token: r.Form.Get("token"),
	}
	fmt.Println("TOKEN", t.token)
	a.Runs[t.token].save()
	type saveGame struct {
		Status string `json:"status"`
	}
	sg := saveGame{
		"saved",
	}
	sendJSONToClient(w, sg, http.StatusOK)
}

func (a *app) checkValid(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		r.ParseForm()
		token := r.Form.Get("token")
		if !a.Runs.exists(token) {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	}
}

func (a *app) ping(w http.ResponseWriter, r *http.Request) {
	start := time.Now()
	elapsed := time.Since(start).Milliseconds()
	if r.Method != "GET" {
		errorResponse(w, http.StatusBadRequest, "Bad Request!")
		return
	}
	re := responses{
		Message: int(elapsed),
		Version: version,
	}
	sendJSONToClient(w, re, http.StatusOK)
}

type responses struct {
	Version string `json:"version"`
	Message int    `json:"serverResponseTime"`
}

type requestError struct {
	Message    string `json:"error"`
	StatusCode int    `json:"statusCode"`
}

func errorResponse(w http.ResponseWriter, statusCode int, msg string) {
	re := &requestError{
		Message:    msg,
		StatusCode: statusCode,
	}
	log.Printf("ERROR %d - %s\n", re.StatusCode, msg)
	sendJSONToClient(w, re, re.StatusCode)
}
