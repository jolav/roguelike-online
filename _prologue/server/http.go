/* */

package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
)

func (a app) httpServerLaunch() {
	mux := http.NewServeMux()

	mux.HandleFunc("GET /ping", ping)
	mux.HandleFunc("POST /run/new", a.runNew)
	mux.HandleFunc("POST /run/save", runSave)
	mux.HandleFunc("POST /run/action", a.runAction)
	mux.HandleFunc("/", badRequest)

	server := http.Server{
		Addr:           fmt.Sprintf("localhost:%d", a.Cnf.Port),
		Handler:        mux,
		IdleTimeout:    time.Minute,
		ReadTimeout:    5 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	log.Printf("INFO -> Server up listening %s in mode %s",
		server.Addr,
		a.Cnf.Mode,
	)
	err := server.ListenAndServe()
	log.Fatalf("ERROR Server cannot launch -> %s", err)
}

func ping(w http.ResponseWriter, r *http.Request) {
	response := struct {
		Version string `json:"version"`
	}{
		Version: version,
	}
	sendJSONToClient(w, response, http.StatusOK)
}

func (a app) runNew(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	cols := stringToInteger(r.Form.Get("cols"), 20)
	rows := stringToInteger(r.Form.Get("rows"), 20)
	nick := r.Form.Get("nick")
	if nick == "" || nick == "undefined" {
		nick = "PLAYER"
	}
	rn := newRun(nick, cols, rows)
	a.Runs[rn.token] = rn
	sendJSONToClient(w, processNewRun(rn), http.StatusOK)
}

func (a app) runAction(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	cols := stringToInteger(r.Form.Get("cols"), 20)
	rows := stringToInteger(r.Form.Get("rows"), 20)
	token := r.Form.Get("token")
	action := r.Form.Get("action")
	rn := a.Runs[token]
	if rn.nick == "" {
		badRequest(w, r)
		return
	}
	rn.turn(action)
	sendJSONToClient(
		w,
		processNewTurn(a.Runs[token], action, cols, rows),
		http.StatusOK)
}

func runSave(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("save"))
}

func badRequest(w http.ResponseWriter, r *http.Request) {
	clientError(w, r, http.StatusBadRequest)
}

func serverError(w http.ResponseWriter, r *http.Request, err error) {
	var method = r.Method
	var uri = r.URL.RequestURI()
	log.Printf("ERROR serverError -> %s \n%s - %s\n", err, method, uri)
	response := struct {
		Message string `json:"statusText"`
		Version string `json:"version"`
	}{
		Message: http.StatusText(http.StatusInternalServerError),
		Version: version,
	}
	sendJSONToClient(w, response, http.StatusInternalServerError)
}

func clientError(w http.ResponseWriter, r *http.Request, status int) {
	var method = r.Method
	var uri = r.URL.RequestURI()
	log.Printf("INFO -> clientError %s %s\n", method, uri)
	response := struct {
		Message string `json:"statusText"`
		Version string `json:"version"`
	}{
		Message: http.StatusText(status),
		Version: version,
	}
	sendJSONToClient(w, response, status)
}

func sendJSONToClient(w http.ResponseWriter, d any, status int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	var dataJSON = []byte(`{}`)
	dataJSON, err := json.MarshalIndent(d, "", " ")
	if err != nil {
		log.Printf("ERROR Marshaling JSON for client -> %s\n", err)
		w.Write([]byte(`{}`))
		return
	}
	w.Write(dataJSON)
}
