/* */

package ecs

import (
	"fmt"
	"prologue/ecs/comps"
)

type ECS struct {
	CounterID     int
	Entities      map[int][]string
	Tags          map[int]map[string]struct{}
	InfoIndex     map[int]int
	PositionIndex map[int]int
	HealthIndex   map[int]int
	Infos         []comps.Info
	Positions     []comps.Position
	Healths       []comps.Health
}

func NewECS() *ECS {
	return &ECS{
		CounterID:     1,
		Entities:      make(map[int][]string),
		Tags:          make(map[int]map[string]struct{}),
		InfoIndex:     make(map[int]int),
		PositionIndex: make(map[int]int),
		HealthIndex:   make(map[int]int),
		Infos:         []comps.Info{},
		Positions:     []comps.Position{},
		Healths:       []comps.Health{},
	}
}

func (ecs *ECS) NewEntity() int {
	id := ecs.CounterID
	ecs.CounterID++
	ecs.Entities[id] = []string{}
	ecs.Tags[id] = make(map[string]struct{})
	return id
}

func (ecs *ECS) List() {
	for k, v := range ecs.Entities {
		fmt.Println(k, v, ecs.Tags[k])
	}
}

func (ecs *ECS) AddTag(id int, tag string) {
	_, exists := ecs.Tags[id]
	if exists {
		ecs.Tags[id][tag] = struct{}{}
	}
}

func (ecs *ECS) RemoveTag(id int, tag string) {
	_, exists := ecs.Tags[id]
	if exists {
		delete(ecs.Tags[id], tag)
	}
}

func (ecs *ECS) HasTag(id int, tag string) bool {
	_, exists := ecs.Tags[id][tag]
	return exists
}

func (ecs *ECS) AddComponent(id int, compType string, comp interface{}) {
	ecs.Entities[id] = append(ecs.Entities[id], compType)

	switch compType {
	case "info":
		index := len(ecs.Infos)
		ecs.Infos = append(ecs.Infos, *comp.(*comps.Info))
		ecs.InfoIndex[id] = index
	case "position":
		index := len(ecs.Positions)
		ecs.Positions = append(ecs.Positions, *(comp.(*comps.Position)))
		ecs.PositionIndex[id] = index
	case "health":
		index := len(ecs.Healths)
		ecs.Healths = append(ecs.Healths, *(comp.(*comps.Health)))
		ecs.HealthIndex[id] = index
	}
}

func (ecs *ECS) RemoveComponent(id int, compType string) {
	switch compType {
	case "info":
		index, exists := ecs.InfoIndex[id]
		if !exists {
			return
		}
		lastIndex := len(ecs.Infos) - 1
		ecs.Infos[index] = ecs.Infos[lastIndex]
		ecs.Infos = ecs.Infos[:lastIndex]
		for ent, idx := range ecs.InfoIndex {
			if idx == lastIndex {
				ecs.InfoIndex[ent] = index
				break
			}
		}
		delete(ecs.InfoIndex, id)
	case "position":
		index, exists := ecs.PositionIndex[id]
		if !exists {
			return
		}
		lastIndex := len(ecs.Positions) - 1
		ecs.Positions[index] = ecs.Positions[lastIndex]
		ecs.Positions = ecs.Positions[:lastIndex]
		for ent, idx := range ecs.PositionIndex {
			if idx == lastIndex {
				ecs.PositionIndex[ent] = index
				break
			}
		}
		delete(ecs.PositionIndex, id)
	case "health":
		index, exists := ecs.HealthIndex[id]
		if !exists {
			return
		}
		lastIndex := len(ecs.Healths) - 1
		ecs.Healths[index] = ecs.Healths[lastIndex]
		ecs.Healths = ecs.Healths[:lastIndex]
		for ent, idx := range ecs.HealthIndex {
			if idx == lastIndex {
				ecs.HealthIndex[ent] = index
				break
			}
		}
		delete(ecs.HealthIndex, id)
	}
}

func (ecs *ECS) PrintEntity(id int) {
	components, exists := ecs.Entities[id]
	if !exists {
		fmt.Printf("Entity %d does not exist.\n", id)
		return
	}

	fmt.Printf("Entity %d:\n", id)
	fmt.Printf("  Components: %v\n", components)
	fmt.Printf("  Tags: %v\n", ecs.Tags[id])

	for _, comp := range components {
		switch comp {
		case "info":
			infoID, hasInfo := ecs.InfoIndex[id]
			if hasInfo {
				i := ecs.Infos[infoID]
				fmt.Printf("  info: Name=%s, Type=%s\n", i.Name, i.Type)
			}
		case "position":
			posID, hasPos := ecs.PositionIndex[id]
			if hasPos {
				p := ecs.Positions[posID]
				fmt.Printf("  position: X=%d, Y=%d\n", p.Current.X, p.Current.Y)
			}
		case "health":
			healthID, hasHealth := ecs.HealthIndex[id]
			if hasHealth {
				h := ecs.Healths[healthID]
				fmt.Printf("  health: MaxHP=%d, CurrentHP=%d\n", h.MaxHp, h.CurrentHP)
			}
		default:
			fmt.Printf("  Unknown component: %s\n", comp)
		}
	}
}
