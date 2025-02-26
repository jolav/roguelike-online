/* */

package ecs

import (
	"prologue/ecs/comps"
)

type ECS struct {
	nextEntityID  int
	entities      map[int][]string
	positionIndex map[int]int
	healthIndex   map[int]int
	positions     []comps.Position
	healths       []comps.Health
}

func NewECS() *ECS {
	return &ECS{
		nextEntityID:  1,
		entities:      make(map[int][]string),
		positionIndex: make(map[int]int),
		healthIndex:   make(map[int]int),
		positions:     []comps.Position{},
		healths:       []comps.Health{},
	}
}

func (ecs *ECS) NewEntity() int {
	id := ecs.nextEntityID
	ecs.nextEntityID++
	ecs.entities[id] = []string{}
	return id
}

func (ecs *ECS) AddComponent(entity int, componentType string, component interface{}) {
	ecs.entities[entity] = append(ecs.entities[entity], componentType)

	switch componentType {
	case "Position":
		index := len(ecs.positions) // Índice donde se agregará
		ecs.positions = append(ecs.positions, *(component.(*comps.Position)))
		ecs.positionIndex[entity] = index // Se guarda el índice en el mapa
	case "Health":
		index := len(ecs.healths)
		ecs.healths = append(ecs.healths, *(component.(*comps.Health)))
		ecs.healthIndex[entity] = index
	}
}

func (ecs *ECS) RemoveComponent(entity int, componentType string) {
	switch componentType {
	case "Position":
		index, exists := ecs.positionIndex[entity]
		if !exists {
			return // No tiene este componente
		}

		lastIndex := len(ecs.positions) - 1             // Último elemento del slice
		ecs.positions[index] = ecs.positions[lastIndex] // Swap
		ecs.positions = ecs.positions[:lastIndex]       // Eliminar último

		// Actualizar el índice de la entidad que movimos
		for ent, idx := range ecs.positionIndex {
			if idx == lastIndex {
				ecs.positionIndex[ent] = index
				break
			}
		}

		delete(ecs.positionIndex, entity) // Remover la entidad del mapa

	case "Health":
		index, exists := ecs.healthIndex[entity]
		if !exists {
			return
		}

		lastIndex := len(ecs.healths) - 1
		ecs.healths[index] = ecs.healths[lastIndex]
		ecs.healths = ecs.healths[:lastIndex]

		for ent, idx := range ecs.healthIndex {
			if idx == lastIndex {
				ecs.healthIndex[ent] = index
				break
			}
		}

		delete(ecs.healthIndex, entity)
	}
}
