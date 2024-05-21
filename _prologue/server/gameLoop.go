/* */

package main

import (
	"fmt"
	"time"
)

func (a app) gameLoop() {
	fmt.Println("gameLoop")
	//setInterval(listRuns, a, 2*time.Second)
	for {
		select {}
	}
}

func listRuns(a app) {
	fmt.Println("Runs --> ", len(a.Runs))
	fmt.Println(a.Runs)
}

func setInterval(f func(app), a app, t time.Duration) {
	ticker := time.NewTicker(t)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			f(a)
		}
	}
}
