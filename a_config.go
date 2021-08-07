/* */

package main

const (
	camWidth  int = 19
	camHeight int = 13

	width             int = 25 //25
	height            int = 21 //21
	roomTries         int = 5000
	rooms             int = 5 //200
	minSizeRoom       int = 4
	maxSizeRoom       int = 8 //25
	minLengthCorridor int = 2
	maxLengthCorridor int = 6 //25
	corridorPercent   int = 15
	foesTries         int = roomTries
	maxFoes           int = rooms / 4
)

type mapConfig struct {
	roomTries         int
	rooms             int
	minSizeRoom       int
	maxSizeRoom       int
	minLengthCorridor int
	maxLengthCorridor int
	corridorPercent   int
	foesTries         int
	maxFoes           int
}
