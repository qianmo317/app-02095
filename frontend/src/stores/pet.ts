import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockPets, type Pet } from '@/mock/data'
import { useUserStore } from './user'

interface MutateOptions {
  silent?: boolean
}

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

  function addPet(pet: Omit<Pet, 'id' | 'createdAt'>, opts?: MutateOptions): Pet {
    const newPet: Pet = {
      ...pet,
      id: Math.max(...pets.value.map(p => p.id)) + 1,
      createdAt: new Date().toISOString().split('T')[0],
    }
    pets.value.unshift(newPet)

    if (!opts?.silent) {
      queueMicrotask(() => {
        try {
          const userStore = useUserStore()
          if (userStore.currentUser) {
            userStore.addLog(userStore.currentUser, '新增', '宠物', `新增宠物：${newPet.name}`)
          }
        } catch (e) {
          console.warn('[pet store] addPet side-effect failed:', e)
        }
      })
    }

    return newPet
  }

  function updatePet(id: number, data: Partial<Pet>, opts?: MutateOptions): void {
    const index = pets.value.findIndex(p => p.id === id)
    if (index === -1) return

    pets.value[index] = { ...pets.value[index], ...data }
    const updatedName = pets.value[index].name

    if (!opts?.silent) {
      queueMicrotask(() => {
        try {
          const userStore = useUserStore()
          if (userStore.currentUser) {
            userStore.addLog(userStore.currentUser, '编辑', '宠物', `更新宠物信息：${updatedName}`)
          }
        } catch (e) {
          console.warn('[pet store] updatePet side-effect failed:', e)
        }
      })
    }
  }

  function deletePet(id: number, opts?: MutateOptions): string | null {
    const pet = pets.value.find(p => p.id === id)
    if (!pet) return null

    const name = pet.name
    pets.value = pets.value.filter(p => p.id !== id)

    if (!opts?.silent) {
      queueMicrotask(() => {
        try {
          const userStore = useUserStore()
          if (userStore.currentUser) {
            userStore.addLog(userStore.currentUser, '删除', '宠物', `删除宠物：${name}`)
          }
        } catch (e) {
          console.warn('[pet store] deletePet side-effect failed:', e)
        }
      })
    }

    return name
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
