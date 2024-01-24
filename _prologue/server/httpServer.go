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

	mux.HandleFunc("/ping", ping)
	mux.HandleFunc("/",
		func(w http.ResponseWriter, r *http.Request) {
			errorResponse(w, "Bad Request !")
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

func ping(w http.ResponseWriter, r *http.Request) {
	start := time.Now()
	elapsed := time.Since(start).Milliseconds()
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

func errorResponse(w http.ResponseWriter, msg string) {
	re := &requestError{
		Message:    msg,
		StatusCode: http.StatusBadRequest,
	}
	log.Printf("ERROR %d - %s\n", re.StatusCode, msg)
	sendJSONToClient(w, re, re.StatusCode)
}
