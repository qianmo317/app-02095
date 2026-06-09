import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockPets, type Pet } from '@/mock/data'
import { eventBus } from './eventBus'

export const usePetStore = defineStore('pet', () => {
  const pets = ref<Pet[]>([...mockPets])

  const availablePets = computed(() => pets.value.filter(p => p.status === 'available'))
  const totalCount = computed(() => pets.value.length)
  const availableCount = computed(() => pets.value.filter(p => p.status === 'available').length)
  const adoptedCount = computed(() => pets.value.filter(p => p.status === 'adopted').length)
  const pendingCount = computed(() => pets.value.filter(p => p.status === 'pending').length)

  function getPetById(id: number) {
    return pets.value.find(p => p.id === id)
  }

  function addPet(pet: Omit<Pet, 'id' | 'createdAt'>) {
    const newPet: Pet = {
      ...pet,
      id: Math.max(...pets.value.map(p => p.id)) + 1,
      createdAt: new Date().toISOString().split('T')[0],
    }
    pets.value.unshift(newPet)
    const rollback = () => {
      pets.value = pets.value.filter(p => p.id !== newPet.id)
    }
    eventBus.emit('pet:added', { pet: newPet, rollback })
    return newPet
  }

  function updatePet(id: number, data: Partial<Pet>) {
    const index = pets.value.findIndex(p => p.id === id)
    if (index === -1) return
    // 保存原始字段快照用于回退（仅恢复被改动的字段）
    const original = pets.value[index]
    const snapshot: Partial<Pet> = {}
    ;(Object.keys(data) as Array<keyof Pet>).forEach(k => {
      ;(snapshot as Record<string, unknown>)[k as string] = (original as Record<string, unknown>)[k as string]
    })
    const updated = { ...original, ...data }
    pets.value[index] = updated
    const rollback = () => {
      const cur = pets.value.findIndex(p => p.id === id)
      if (cur !== -1) {
        pets.value[cur] = { ...pets.value[cur], ...snapshot }
      }
    }
    eventBus.emit('pet:updated', { pet: updated, rollback })
  }

  function deletePet(id: number) {
    const index = pets.value.findIndex(p => p.id === id)
    if (index === -1) return
    const removed = pets.value[index]
    pets.value = pets.value.filter(p => p.id !== id)
    const rollback = () => {
      // 还原到原位置，保持视图顺序稳定
      if (!pets.value.some(p => p.id === removed.id)) {
        const next = pets.value.slice()
        next.splice(Math.min(index, next.length), 0, removed)
        pets.value = next
      }
    }
    eventBus.emit('pet:deleted', { pet: removed, rollback })
  }

  function filterPets(filters: { species?: string; gender?: string; status?: string; keyword?: string }) {
    return pets.value.filter(p => {
      if (filters.species && p.species !== filters.species) return false
      if (filters.gender && p.gender !== filters.gender) return false
      if (filters.status && p.status !== filters.status) return false
      if (filters.keyword) {
        const kw = filters.keyword.toLowerCase()
        return p.name.toLowerCase().includes(kw) || p.breed.toLowerCase().includes(kw)
      }
      return true
    })
  }

  return {
    pets, availablePets,
    totalCount, availableCount, adoptedCount, pendingCount,
    getPetById, addPet, updatePet, deletePet, filterPets,
  }
})
