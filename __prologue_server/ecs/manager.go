/* */

package ecs

import (
	"fmt"
	"prologue/ecs/comps"
)

type ComponentManager[T any] struct {
	Components map[int]T
}

func (cm *ComponentManager[T]) AddComponent(id int, component T) {
	cm.Components[id] = component
}

func (cm *ComponentManager[T]) GetComponent(id int) (T, bool) {
	var zero T
	component, exists := cm.Components[id]
	if !exists {
		return zero, false
	}
	return component, true
}

func (cm *ComponentManager[T]) RemoveComponent(id int) {
	delete(cm.Components, id)
}

type ECS struct {
	counterID int
	Positions ComponentManager[comps.Position]
	Infos     ComponentManager[comps.Info]
	Healths   ComponentManager[comps.Health]
	tags      map[int]map[string]struct{}
}

func NewECS() *ECS {
	return &ECS{
		counterID: 1,
		Positions: ComponentManager[comps.Position]{
			Components: make(map[int]comps.Position),
		},
		Infos: ComponentManager[comps.Info]{
			Components: make(map[int]comps.Info),
		},
		Healths: ComponentManager[comps.Health]{
			Components: make(map[int]comps.Health),
		},
		tags: make(map[int]map[string]struct{}),
	}
}

func (e *ECS) NewEntity() int {
	id := e.counterID
	e.counterID++
	e.tags[id] = make(map[string]struct{})
	return id
}

func (e *ECS) AddTag(id int, tag string) {
	_, exists := e.tags[id]
	if !exists {
		return
	}
	e.tags[id][tag] = struct{}{}
}

func (e *ECS) RemoveTag(id int, tag string) {
	_, exists := e.tags[id]
	if !exists {
		return
	}
	delete(e.tags[id], tag)
}

func (e *ECS) HasTag(id int, tag string) bool {
	_, exists := e.tags[id][tag]
	return exists
}

func (e *ECS) GetEntitiesWithTag(tag string) []int {
	var result []int
	for id, tags := range e.tags {
		_, exists := tags[tag]
		if exists {
			result = append(result, id)
		}
	}
	return result
}

func (e *ECS) PrintEntity(id int) {
	fmt.Printf("Entity %d:\n", id)

	pos, exists := e.Positions.GetComponent(id)
	if exists {
		fmt.Printf("  Position: %+v\n", pos)
	}

	info, exists := e.Infos.GetComponent(id)
	if exists {
		fmt.Printf("  Info: %+v\n", info)
	}

	health, exists := e.Healths.GetComponent(id)
	if exists {
		fmt.Printf("  Health: %+v\n", health)
	}

	tags := []string{}
	for tag := range e.tags[id] {
		tags = append(tags, tag)
	}
	fmt.Println("  Tags:", tags)
}
