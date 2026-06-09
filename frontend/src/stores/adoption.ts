import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockAdoptions, type Adoption } from '@/mock/data'
import { usePetStore } from './pet'

export const useAdoptionStore = defineStore('adoption', () => {
  const adoptions = ref<Adoption[]>([...mockAdoptions])

  const pendingCount = computed(() => adoptions.value.filter(a => a.status === 'pending').length)
  const approvedCount = computed(() => adoptions.value.filter(a => a.status === 'approved').length)
  const rejectedCount = computed(() => adoptions.value.filter(a => a.status === 'rejected').length)

  function submitAdoption(data: Omit<Adoption, 'id' | 'status' | 'createdAt' | 'updatedAt'>) {
    const petStore = usePetStore()
    const pet = petStore.getPetById(data.petId)
    
    if (!pet) {
      throw new Error('宠物不存在')
    }
    if (pet.status !== 'available') {
      throw new Error('该宠物暂不可领养')
    }
    if (hasUserApplied(data.userId, data.petId)) {
      throw new Error('您已提交过领养申请')
    }

    const now = new Date().toISOString().split('T')[0]
    const newAdoption: Adoption = {
      ...data,
      id: Math.max(...adoptions.value.map(a => a.id), 0) + 1,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    }
    adoptions.value.unshift(newAdoption)
    return newAdoption
  }

  function approveAdoption(id: number) {
    const adoption = adoptions.value.find(a => a.id === id)
    if (!adoption) return null
    
    if (adoption.status !== 'pending') {
      throw new Error('该申请已处理')
    }

    adoption.status = 'approved'
    adoption.updatedAt = new Date().toISOString().split('T')[0]
    return adoption
  }

  function rejectAdoption(id: number) {
    const adoption = adoptions.value.find(a => a.id === id)
    if (!adoption) return null
    
    if (adoption.status !== 'pending') {
      throw new Error('该申请已处理')
    }

    adoption.status = 'rejected'
    adoption.updatedAt = new Date().toISOString().split('T')[0]
    return adoption
  }

  function getAdoptionsByUser(userId: number) {
    return adoptions.value.filter(a => a.userId === userId)
  }

  function hasUserApplied(userId: number, petId: number) {
    return adoptions.value.some(a => a.userId === userId && a.petId === petId && a.status === 'pending')
  }

  function getAdoptionById(id: number) {
    return adoptions.value.find(a => a.id === id)
  }

  return {
    adoptions, pendingCount, approvedCount, rejectedCount,
    submitAdoption, approveAdoption, rejectAdoption,
    getAdoptionsByUser, hasUserApplied, getAdoptionById,
  }
})
