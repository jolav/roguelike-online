/* */

package lib

type Set struct {
	elements map[string]struct{}
}

func NewSet() *Set {
	return &Set{
		elements: make(map[string]struct{}),
	}
}

func (s *Set) Add(element string) {
	s.elements[element] = struct{}{}
}

func (s *Set) Remove(element string) {
	delete(s.elements, element)
}

func (s *Set) Has(element string) bool {
	_, exists := s.elements[element]
	return exists
}

func (s *Set) Size() int {
	return len(s.elements)
}

func (s *Set) Clear() {
	s.elements = make(map[string]struct{})
}
