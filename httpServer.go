/* */

package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
)

func httpServer(a app) {

	http.DefaultClient.Timeout = 5 * time.Second
	mux := http.NewServeMux()

	mux.HandleFunc("/new", newGame(a.Ch))
	mux.HandleFunc("/load", loadGame)
	mux.HandleFunc("/action", action)
	mux.HandleFunc("/",
		func(w http.ResponseWriter, r *http.Request) {
			errorResponse(w, "Bad Request !")
		})

	server := &http.Server{
		Addr:           fmt.Sprintf("localhost:%d", a.Conf.Port),
		Handler:        mux,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   30 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	log.Printf("Server up listening %s in mode %s", server.Addr, a.Conf.Mode)
	server.ListenAndServe()
}

func newGame(ch channels) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		getToken := make(chan run)
		defer close(getToken)
		ch.askNewGame <- getToken
		runData := <-getToken
		sendJSONToClient(w, runData, 200)
	}
}

func loadGame(w http.ResponseWriter, r *http.Request) {
	fmt.Println("LOAD GAME")
}

func action(w http.ResponseWriter, r *http.Request) {
	fmt.Println("ACTION")
}

type requestError struct {
	Message    string `json:"Error"`
	StatusCode int    `json:"StatusCode"`
}

func errorResponse(w http.ResponseWriter, msg string) {
	re := &requestError{
		Message:    msg,
		StatusCode: 400,
	}
	log.Printf("ERROR %s\n", msg)
	sendJSONToClient(w, re, re.StatusCode)
}

func sendJSONToClient(w http.ResponseWriter, d interface{}, status int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	var dataJSON = []byte(`{}`)
	dataJSON, err := json.MarshalIndent(d, "", " ")
	if err != nil {
		log.Printf("ERROR Marshaling %s\n", err)
		w.Write([]byte(`{}`))
	}
	fmt.Println(string(dataJSON))
	w.Write(dataJSON)
}