import { useAdoptionStore } from '@/stores/adoption'
import { usePetStore } from '@/stores/pet'
import { useUserStore } from '@/stores/user'
import type { Adoption } from '@/mock/data'

export function useAdoptionService() {
  const adoptionStore = useAdoptionStore()
  const petStore = usePetStore()
  const userStore = useUserStore()

  function submitAdoption(data: Omit<Adoption, 'id' | 'status' | 'createdAt' | 'updatedAt'>) {
    const newAdoption = adoptionStore.submitAdoption(data)
    const pet = petStore.getPetById(data.petId)
    if (userStore.currentUser && pet) {
      userStore.addLog(userStore.currentUser, '提交', '领养申请', `提交领养申请：${pet.name}`)
    }
    return newAdoption
  }

  function approveAdoption(id: number) {
    const adoption = adoptionStore.approveAdoption(id)
    if (!adoption) return null

    petStore.updatePet(adoption.petId, { status: 'adopted' })
    
    const pet = petStore.getPetById(adoption.petId)
    const applicant = userStore.users.find(u => u.id === adoption.userId)
    if (userStore.currentUser && pet && applicant) {
      userStore.addLog(userStore.currentUser, '审批', '领养申请', `通过用户${applicant.nickname}的领养申请（${pet.name}）`)
    }

    return adoption
  }

  function rejectAdoption(id: number) {
    const adoption = adoptionStore.rejectAdoption(id)
    if (!adoption) return null

    const pet = petStore.getPetById(adoption.petId)
    const applicant = userStore.users.find(u => u.id === adoption.userId)
    if (userStore.currentUser && pet && applicant) {
      userStore.addLog(userStore.currentUser, '审批', '领养申请', `拒绝用户${applicant.nickname}的领养申请（${pet.name}）`)
    }

    return adoption
  }

  return {
    adoptionStore,
    petStore,
    userStore,
    submitAdoption,
    approveAdoption,
    rejectAdoption,
  }
}
