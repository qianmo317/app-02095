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

    queueMicrotask(() => {
      try {
        const userStore = useUserStore()
        const petStore = usePetStore()
        const pet = petStore.getPetById(data.petId)
        const applicant = userStore.users.find(u => u.id === data.userId)
        if (applicant && pet) {
          userStore.addLog(applicant, '提交', '领养申请', `提交领养申请：${pet.name}`)
        }
      } catch (e) {
        console.warn('[adoption store] submitAdoption side-effect failed:', e)
      }
    })

    return newAdoption
  }

  function approveAdoption(id: number) {
    const adoption = adoptions.value.find(a => a.id === id)
    if (!adoption) return

    const petStore = usePetStore()
    const pet = petStore.getPetById(adoption.petId)

    const snapshot = {
      adoptionStatus: adoption.status,
      adoptionUpdatedAt: adoption.updatedAt,
      petId: adoption.petId,
      petStatus: pet?.status ?? null,
    }

    adoption.status = 'approved'
    adoption.updatedAt = new Date().toISOString().split('T')[0]

    try {
      petStore.updatePet(adoption.petId, { status: 'adopted' }, { silent: true })
    } catch (e) {
      adoption.status = snapshot.adoptionStatus
      adoption.updatedAt = snapshot.adoptionUpdatedAt
      if (snapshot.petStatus) {
        try {
          petStore.updatePet(snapshot.petId, { status: snapshot.petStatus as any }, { silent: true })
        } catch {}
      }
      console.error('[adoption store] approveAdoption core state update failed, rolled back:', e)
      throw e
    }

    queueMicrotask(() => {
      try {
        const userStore = useUserStore()
        const updatedPet = petStore.getPetById(adoption.petId)
        const applicant = userStore.users.find(u => u.id === adoption.userId)
        if (userStore.currentUser && applicant && updatedPet) {
          userStore.addLog(userStore.currentUser, '审批', '领养申请', `通过用户${applicant.nickname}的领养申请（${updatedPet.name}）`)
        }
      } catch (e) {
        console.warn('[adoption store] approveAdoption side-effect failed:', e)
      }
    })
  }

  function rejectAdoption(id: number) {
    const adoption = adoptions.value.find(a => a.id === id)
    if (!adoption) return

    const snapshot = {
      prevStatus: adoption.status,
      prevUpdatedAt: adoption.updatedAt,
    }

    adoption.status = 'rejected'
    adoption.updatedAt = new Date().toISOString().split('T')[0]

    queueMicrotask(() => {
      try {
        const userStore = useUserStore()
        const petStore = usePetStore()
        const pet = petStore.getPetById(adoption.petId)
        const applicant = userStore.users.find(u => u.id === adoption.userId)
        if (userStore.currentUser && pet && applicant) {
          userStore.addLog(userStore.currentUser, '审批', '领养申请', `拒绝用户${applicant.nickname}的领养申请（${pet.name}）`)
        }
      } catch (e) {
        adoption.status = snapshot.prevStatus
        adoption.updatedAt = snapshot.prevUpdatedAt
        console.error('[adoption store] rejectAdoption failed, rolled back:', e)
      }
    })
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
