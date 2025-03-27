/* */

package main

type entry struct {
	eID  int
	text string
}

type history []entry

func NewHistory() history {
	return history{
		{eID: -1, text: "20"},
		{eID: -1, text: "19"},
		{eID: -1, text: "18"},
		{eID: -1, text: "17"},
		{eID: -1, text: "16"},
		{eID: -1, text: "15"},
		{eID: -1, text: "14"},
		{eID: -1, text: "13"},
		{eID: -1, text: "12"},
		{eID: -1, text: "11"},
		{eID: -1, text: "10 En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y galgo corredor."},
		{eID: -1, text: "9"},
		{eID: -1, text: "8"},
		{eID: -1, text: "7"},
		{eID: -1, text: "6"},
		{eID: -1, text: "5"},
		{eID: -1, text: "4"},
		{eID: -1, text: "3"},
		{eID: -1, text: "2"},
		{eID: -1, text: "1"},
		{eID: -1, text: "Adventure begins..."},
	}
}

func (h history) ForClient() []string {
	res := []string{}
	for _, v := range h {
		res = append(res, v.text)
	}
	return res
}

func (h history) Add(eID int, msg string) history {
	e := entry{
		eID:  eID,
		text: msg,
	}
	h = append(h, e)
	return h
}

func (h history) Clean() history {
	return history{}
}
