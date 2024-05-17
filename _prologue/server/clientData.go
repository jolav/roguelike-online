/* */

package main

type clientDataNewRun struct {
	Nick  string `json:"nick"`
	Token string `json:"token"`
}

func processNewRun(r run) clientDataNewRun {
	cd := clientDataNewRun{
		Nick:  r.nick,
		Token: r.token,
	}
	return cd
}
