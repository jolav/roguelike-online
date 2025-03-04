/* */

package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"prologue/lib"
	"slices"
	"time"
)

func (a *app) startHTTPServer() {
	mux := http.NewServeMux()

	mux.HandleFunc("GET /version", a.sendVersion)
	mux.HandleFunc("GET /ping", ping)
	mux.HandleFunc("GET /update", a.updateVersion)
	mux.HandleFunc("/", route404)

	middleware := mw

	server := http.Server{
		Addr:           fmt.Sprintf("localhost:%d", a.Sys.Port),
		Handler:        middleware(mux, a),
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

func ping(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusNoContent)
}

func (a *app) sendVersion(w http.ResponseWriter, r *http.Request) {
	response := struct {
		Version string `json:"version"`
	}{
		Version: a.Cnf.Version,
	}
	lib.SendJSONResponse(w, response, http.StatusOK)
}

func (a *app) updateVersion(w http.ResponseWriter, r *http.Request) {
	token := r.Header.Get("Authorization")
	if token != a.Sys.Token {
		lib.SendError(w, "Unauthorizated", http.StatusUnauthorized)
		log.Printf(`UNAUTHORIZATED IP=%s TOKEN=%s`, lib.GetIP(r), token)
		return
	}
	lib.LoadJSONFile("./conf/version.json", &a.Cnf)
	w.WriteHeader(http.StatusOK)

}

func mw(next http.Handler, a *app) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ip := lib.GetIP(r)
		if !slices.Contains(a.Sys.IPs, ip) {
			log.Printf("IP=%s %s %s", ip, r.Method, r.URL.Path)
		}
		next.ServeHTTP(w, r)
	})
}
