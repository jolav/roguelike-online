/* */

package main

import (
	"bytes"
	"encoding/json"
	"io"
	"os"
	"sync"
)

var lock sync.Mutex

func SaveJSON(path string, rawData interface{}) error {
	lock.Lock()
	defer lock.Unlock()
	f, err := os.Create(path)
	if err != nil {
		return err
	}
	defer f.Close()
	jsonData, err := json.MarshalIndent(rawData, "", "\t")
	if err != nil {
		return err
	}
	_, err = io.Copy(f, bytes.NewReader(jsonData))

	return err
}

func LoadJSON(path string, data interface{}) error {
	lock.Lock()
	defer lock.Unlock()
	file, err := os.Open(path)
	if err != nil {
		return err
	}
	defer file.Close()
	return json.NewDecoder(file).Decode(data)
}
