/* */

package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
)

func httpServerLaunch(c config) {
	mux := http.NewServeMux()

	mux.HandleFunc("GET /ping", ping)
	mux.HandleFunc("POST /run/new", runNew)
	mux.HandleFunc("POST /run/save", runSave)
	mux.HandleFunc("POST /run/action", runAction)
	mux.HandleFunc("/", badRequest)

	server := http.Server{
		Addr:           fmt.Sprintf("localhost:%d", c.Port),
		Handler:        mux,
		IdleTimeout:    time.Minute,
		ReadTimeout:    5 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	log.Printf("INFO -> Server up listening %s in mode %s", server.Addr, c.Mode)
	err := server.ListenAndServe()
	log.Fatalf("ERROR Server cannot launch -> %s", err)
}

func ping(w http.ResponseWriter, r *http.Request) {
	response := struct {
		Message string `json:"statusText"`
	}{
		Message: http.StatusText(http.StatusOK),
	}
	sendJSONToClient(w, response, http.StatusOK)
}

func runNew(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("new"))
}

func runSave(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("save"))
}

func runAction(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("action"))
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
	}{
		Message: http.StatusText(http.StatusInternalServerError),
	}
	sendJSONToClient(w, response, http.StatusInternalServerError)
}

func clientError(w http.ResponseWriter, r *http.Request, status int) {
	var method = r.Method
	var uri = r.URL.RequestURI()
	log.Printf("INFO -> clientError %s %s\n", method, uri)
	response := struct {
		Message string `json:"statusText"`
	}{
		Message: http.StatusText(status),
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
