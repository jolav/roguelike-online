/* */

package lib

import (
	"encoding/json"
	"log"
	"net/http"
)

func SendJSONResponse(w http.ResponseWriter, d any, s int) {
	dataJSON, err := json.MarshalIndent(d, "", " ")
	if err != nil {
		log.Printf("ERROR LIB-RESPONSES 1 %v\n", err)
		SendError(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(s)

	_, err = w.Write(dataJSON)
	if err != nil {
		log.Printf("ERROR LIB-RESPONSES 2 %v\n", err)
	}
}

func SendError(w http.ResponseWriter, msg string, statusCode int) {
	switch statusCode {
	case http.StatusBadRequest:
		msg = "Bad Request! -> " + msg
	}
	response := struct {
		Error string `json:"error"`
	}{
		Error: msg,
	}
	SendJSONResponse(w, response, statusCode)
}
