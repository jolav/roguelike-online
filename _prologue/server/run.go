/* */

package main

import (
	cryptoRand "crypto/rand"
	"encoding/base32"
	"log"
)

type run struct {
	nick  string
	token string
	x     int
	y     int
	cam   camera
}

func (r run) turn(action string) {

}

func newRun(nick string, cols, rows int) run {
	token, err := generateToken(50)
	if err != nil {
		log.Printf("ERROR generating Token -> %s\n", err)
		// run cant be created because not having token, now manage it
	}
	r := run{
		nick:  nick,
		token: token,
		x:     0,
		y:     0,
		cam:   newCamera(cols, rows),
	}
	return r
}

func generateToken(n int) (string, error) {
	randomBytes := make([]byte, n)
	_, err := cryptoRand.Read(randomBytes)
	if err != nil {
		return "", err
	}
	token := base32.StdEncoding.WithPadding(base32.NoPadding).EncodeToString(randomBytes)
	return token, nil
}
