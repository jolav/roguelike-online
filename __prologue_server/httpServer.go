/* */

package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"prologue/lib"
	"slices"
	"strings"
	"time"
)

func (a *app) startHTTPServer() {
	mux := http.NewServeMux()

	mux.HandleFunc("GET /version", a.sendVersion)
	mux.HandleFunc("GET /ping", ping)
	mux.HandleFunc("GET /run", a.doRun)
	mux.HandleFunc("GET /turn", a.doTurn)
	mux.HandleFunc("/", route404)

	middleware := mw

	server := http.Server{
		Addr:           fmt.Sprintf("localhost:%d", a.Sys.Port),
		Handler:        middleware(mux, *a),
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   30 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	pid := os.Getpid()
	log.Printf(
		"\n#####################################################\n"+
			" process.pid => %d\n"+
			" mode => %s\n"+
			" %s version %s running on port %d\n"+
			"#####################################################\n",
		pid, a.Sys.Mode, "PROLOGUE", version, a.Sys.Port)

	log.Fatal(server.ListenAndServe())
}

func route404(w http.ResponseWriter, r *http.Request) {
	lib.SendError(w, "Route not valid", http.StatusNotFound)
}

func (a app) sendVersion(w http.ResponseWriter, r *http.Request) {
	response := struct {
		Version string `json:"version"`
	}{
		Version: version,
	}
	lib.SendJSONResponse(w, response, http.StatusOK)
}

func ping(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusNoContent)
}

func mw(next http.Handler, a app) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ip := lib.GetIP(r)
		if !slices.Contains(a.Sys.IPs, ip) {
			log.Printf("IP=%s %s %s", ip, r.Method, r.URL.Path)
		}
		next.ServeHTTP(w, r)
	})
}

func (a app) doRun(w http.ResponseWriter, r *http.Request) {
	newRun, msg, statusCode := a.NewRun(r)
	if statusCode != http.StatusOK {
		lib.SendError(w, msg, statusCode)
		return
	}
	response := prepareDataNew(*newRun)
	lib.SendJSONResponse(w, response, http.StatusOK)

}

func (a app) doTurn(w http.ResponseWriter, r *http.Request) {
	token := r.Header.Get("Authorization")
	run, ok := (*a.Runs)[token]
	if !ok {
		lib.SendError(w, "Unauthorizated", http.StatusUnauthorized)
		log.Print(token, ok, "Unauthorizated")
		return
	}
	r.ParseForm()
	task := strings.ToUpper(r.Form.Get("action"))
	if !a.Cnf.Actions.Has(task) {
		lib.SendError(w, "Not Valid Action", http.StatusBadRequest)
		return
	}

	elapsedTime := time.Now().Sub(run.Control.LastTurn)
	if elapsedTime < time.Duration(a.Cnf.Tick)*time.Millisecond {
		lib.SendError(w, "Too Early", http.StatusTooEarly)
		return
	}

	run.Control.LastTurn = time.Now()
	run.DoTurn(task)

	response := prepareDataTurn(*run)
	lib.SendJSONResponse(w, response, http.StatusOK)
}
