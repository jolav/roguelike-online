/* */

package main

import (
	"fmt"
)

func gameLoop(a app) {

	for {
		select {

		case sendToken := <-a.Ch.askNewGame:
			fullToken := a.Runs.add()
			sendToken <- fullToken
		}
		prettyPrintStruct(len(a.Runs))

	}

	// UNREACHABLE CODE
	fmt.Println("UNREACHABLE CODE")

}
