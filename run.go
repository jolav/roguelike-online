/* */
package main

type run struct {
	Nick  string             `json:"nick"`
	Token string             `json:"token"`
	Cols  int                `json:"cols"`
	Rows  int                `json:"rows"`
	Grid  [width][height]int `json:"grid"`
	X     int                `json:"x"`
	Y     int                `json:"y"`
}

func newRun() *run {
	return &run{
		Nick:  getRandomNick(lenChars, lenIntegers),
		Token: getRandomString(tokenLength),
		Cols:  width,
		Rows:  height,
		Grid:  [width][height]int{},
		X:     width / 2,
		Y:     height / 2,
	}
}
