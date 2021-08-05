/* */

package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
)

func (a *app) httpServer() {

	http.DefaultClient.Timeout = 5 * time.Second
	mux := http.NewServeMux()

	mux.HandleFunc("/new", a.newGame)
	mux.HandleFunc("/load", a.loadGame)
	mux.HandleFunc("/action", a.checkValid(
		func(w http.ResponseWriter, r *http.Request) {
			a.action(w, r)
		}))
	mux.HandleFunc("/",
		func(w http.ResponseWriter, r *http.Request) {
			errorResponse(w, "Bad Request !")
		})

	server := &http.Server{
		Addr:           fmt.Sprintf("localhost:%d", a.Sys.Port),
		Handler:        mux,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   30 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	log.Printf("Server up listening %s in mode %s", server.Addr, a.Sys.Mode)
	server.ListenAndServe()
}

func (a *app) newGame(w http.ResponseWriter, r *http.Request) {
	newRunChannel := make(chan run)
	defer close(newRunChannel)
	a.Ch.askGame <- newRunChannel
	var runData run
	runData = <-newRunChannel
	sendJSONToClient(w, runData, 200)
}

func (a *app) loadGame(w http.ResponseWriter, r *http.Request) {
	fmt.Println("LOAD GAME")
}

func (a *app) action(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	t := turn{
		token:  r.Form.Get("token"),
		action: r.Form.Get("action"),
		comm:   make(chan run),
	}
	defer close(t.comm)
	a.Ch.askTurn <- t
	runData := <-t.comm
	sendJSONToClient(w, runData, 200)
}

func (a *app) checkValid(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		//
		var startTime time.Time
		var randomPing time.Duration
		if a.Sys.Mode == "dev" {
			startTime = time.Now()
			randomPing = time.Duration(randomInt(120, 200)) * time.Millisecond
			time.Sleep(randomPing) //simulate network travel
		}
		//
		r.ParseForm()
		token := r.Form.Get("token")
		if !a.Runs.exists(token) {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
		//
		if a.Sys.Mode == "dev" {
			duration := time.Now().Sub(startTime)
			fmt.Println(randomPing, duration-randomPing)
		}
	}
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
	//fmt.Println(string(dataJSON))
	w.Write(dataJSON)
}
