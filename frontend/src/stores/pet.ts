import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockPets, type Pet } from '@/mock/data'
import { emitStoreEvent } from './events'

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
    emitStoreEvent('pet:added', { petName: newPet.name })
    return newPet
  }

  function updatePet(id: number, data: Partial<Pet>) {
    const index = pets.value.findIndex(p => p.id === id)
    if (index !== -1) {
      pets.value[index] = { ...pets.value[index], ...data }
      emitStoreEvent('pet:updated', { petName: pets.value[index].name })
    }
  }

  function deletePet(id: number) {
    const pet = pets.value.find(p => p.id === id)
    if (pet) {
      pets.value = pets.value.filter(p => p.id !== id)
      emitStoreEvent('pet:deleted', { petName: pet.name })
    }
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
