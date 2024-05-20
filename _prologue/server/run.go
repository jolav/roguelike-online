/* */

package main

import (
	cryptoRand "crypto/rand"
	"encoding/base32"
	"fmt"
	"log"
)

type run struct {
	nick  string
	token string
	x     int
	y     int
}

func newRun(nick, cam string) run {
	token, err := generateToken(50)
	if err != nil {
		log.Printf("ERROR generating Token -> %s\n", err)
		// run cant be created because not having token, now manage it
	}
	fmt.Sprintln(cam)
	r := run{
		nick:  nick,
		token: token,
		x:     0,
		y:     0,
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
