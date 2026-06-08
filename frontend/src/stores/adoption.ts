import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockAdoptions, type Adoption } from '@/mock/data'
import { useUserStore } from './user'
import { usePetStore } from './pet'

export const useAdoptionStore = defineStore('adoption', () => {
  const adoptions = ref<Adoption[]>([...mockAdoptions])

  const pendingCount = computed(() => adoptions.value.filter(a => a.status === 'pending').length)
  const approvedCount = computed(() => adoptions.value.filter(a => a.status === 'approved').length)
  const rejectedCount = computed(() => adoptions.value.filter(a => a.status === 'rejected').length)

  function submitAdoption(data: Omit<Adoption, 'id' | 'status' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString().split('T')[0]
    const newAdoption: Adoption = {
      ...data,
      id: Math.max(...adoptions.value.map(a => a.id), 0) + 1,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    }
    adoptions.value.unshift(newAdoption)
    const userStore = useUserStore()
    const petStore = usePetStore()
    const pet = petStore.getPetById(data.petId)
    if (userStore.currentUser && pet) {
      userStore.addLog(userStore.currentUser, '提交', '领养申请', `提交领养申请：${pet.name}`)
    }
    return newAdoption
  }

  function approveAdoption(id: number) {
    const adoption = adoptions.value.find(a => a.id === id)
    if (adoption) {
      adoption.status = 'approved'
      adoption.updatedAt = new Date().toISOString().split('T')[0]
      const petStore = usePetStore()
      petStore.updatePet(adoption.petId, { status: 'adopted' })
      const userStore = useUserStore()
      const pet = petStore.getPetById(adoption.petId)
      const applicant = userStore.users.find(u => u.id === adoption.userId)
      if (userStore.currentUser && pet && applicant) {
        userStore.addLog(userStore.currentUser, '审批', '领养申请', `通过用户${applicant.nickname}的领养申请（${pet.name}）`)
      }
    }
  }

  function rejectAdoption(id: number) {
    const adoption = adoptions.value.find(a => a.id === id)
    if (adoption) {
      adoption.status = 'rejected'
      adoption.updatedAt = new Date().toISOString().split('T')[0]
      const userStore = useUserStore()
      const petStore = usePetStore()
      const pet = petStore.getPetById(adoption.petId)
      const applicant = userStore.users.find(u => u.id === adoption.userId)
      if (userStore.currentUser && pet && applicant) {
        userStore.addLog(userStore.currentUser, '审批', '领养申请', `拒绝用户${applicant.nickname}的领养申请（${pet.name}）`)
      }
    }
  }

  function getAdoptionsByUser(userId: number) {
    return adoptions.value.filter(a => a.userId === userId)
  }

  function hasUserApplied(userId: number, petId: number) {
    return adoptions.value.some(a => a.userId === userId && a.petId === petId && a.status === 'pending')
  }

  return {
    adoptions, pendingCount, approvedCount, rejectedCount,
    submitAdoption, approveAdoption, rejectAdoption,
    getAdoptionsByUser, hasUserApplied,
  }
})
