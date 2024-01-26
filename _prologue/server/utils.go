/* */

package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
)

func sliceContainsString(str string, slice []string) bool {
	for _, v := range slice {
		if v == str {
			return true
		}
	}
	return false
}

func prettyPrintStructExported(s interface{}) {
	result, _ := json.MarshalIndent(s, "", "    ") //"\t")
	fmt.Print(string(result), "\n")
}

func prettyPrintStruct(s interface{}) {
	fmt.Printf("%+v\n", s)
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
	w.Write(dataJSON)
}

func loadJSONFile(filePath string, data interface{}) {
	file, err := os.Open(filePath)
	if err != nil {
		log.Fatalln("Cannot open config file", err)
	}
	defer file.Close()
	body, err := io.ReadAll(file) // get file content
	if err != nil {
		log.Fatalln(err)
	}
	err = json.Unmarshal(body, &data)
	if err != nil {
		log.Fatalln(err)
	}
}

func searchLineInFile(filePath string, searching int) (line string) {
	file, err := os.Open(filePath)
	if err != nil {
		log.Fatal("ERROR FILE 1 = ", err)
	}
	defer file.Close()
	var actual = 1
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		if actual == searching {
			return scanner.Text()
		}
		actual++
	}
	if err := scanner.Err(); err != nil {
		log.Fatal("ERROR FILE 2 = ", err)
	}
	return ""
}
