/* */

package _utils

import (
	"encoding/json"
	"log"
	"net/http"
)

type requestError struct {
	Message    string `json:"Error"`
	StatusCode int    `json:"-"`
}

// ErrorResponse ...
func ErrorResponse(w http.ResponseWriter, msg string) {
	re := &requestError{
		Message:    msg,
		StatusCode: 400,
	}
	SendJSONToClient(w, re, re.StatusCode)
}

// SendJSONToClient ...
func SendJSONToClient(w http.ResponseWriter, d interface{}, status int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	var dataJSON = []byte(`{}`)
	dataJSON, err := json.MarshalIndent(d, "", " ")
	if err != nil {
		log.Printf("ERROR Marshaling %s\n", err)
		w.Write([]byte(`{}`))
	}
	w.Write(dataJSON)
}
