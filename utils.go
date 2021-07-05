/* */

package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math/rand"
	"os"
	"time"
)

func prettyPrintStruct(s interface{}) {
	result, _ := json.MarshalIndent(s, "", "    ") //"\t")
	fmt.Print(string(result), "\n")
}

func loadJSONfromFile(filePath string, data interface{}) {
	file, err := os.Open(filePath)
	if err != nil {
		log.Fatalln("Cannot open config file", err)
	}
	defer file.Close()
	body, err := ioutil.ReadAll(file)
	if err != nil {
		log.Fatalln(err)
	}
	err = json.Unmarshal(body, &data)
	if err != nil {
		log.Fatalln(err)
	}
}

func getRandomString(length int) string {
	const chars = "abcdefghijklmnopqrstuvwxyz" + "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "0123456789"
	var seed = rand.New(rand.NewSource(time.Now().UnixNano()))

	b := make([]byte, length)
	for i := range b {
		b[i] = chars[seed.Intn(len(chars))]
	}
	return string(b)

}

func getRandomNick(lenChars, lenIntegers int) string {
	const chars = "abcdefghijklmnopqrstuvwxyz"
	const nums = "0123456789"
	var seed = rand.New(rand.NewSource(time.Now().UnixNano()))
	var nick = ""
	b := make([]byte, lenChars)
	for i := range b {
		b[i] = chars[seed.Intn(len(chars))]
	}
	nick += string(b)
	c := make([]byte, lenIntegers)
	for i := range c {
		c[i] = nums[seed.Intn(len(nums))]
	}
	nick += string(c)
	fmt.Println("NICK =>", nick)
	return nick

}
