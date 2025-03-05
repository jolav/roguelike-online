/* */

package comps

type Info struct {
	Name string
	Type string
}

func NewInfo(name, typeof string) Info {
	return Info{
		Name: name,
		Type: typeof,
	}
}
