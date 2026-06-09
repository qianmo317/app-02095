import { usePetStore } from '@/stores/pet'
import { useUserStore } from '@/stores/user'
import type { Pet } from '@/mock/data'

export function usePetService() {
  const petStore = usePetStore()
  const userStore = useUserStore()

  function addPet(pet: Omit<Pet, 'id' | 'createdAt'>) {
    const newPet = petStore.addPet(pet)
    if (userStore.currentUser) {
      userStore.addLog(userStore.currentUser, '新增', '宠物', `新增宠物：${newPet.name}`)
    }
    return newPet
  }

  function updatePet(id: number, data: Partial<Pet>) {
    const updatedPet = petStore.updatePet(id, data)
    if (updatedPet && userStore.currentUser) {
      userStore.addLog(userStore.currentUser, '编辑', '宠物', `更新宠物信息：${updatedPet.name}`)
    }
    return updatedPet
  }

  function deletePet(id: number) {
    const deletedPet = petStore.deletePet(id)
    if (deletedPet && userStore.currentUser) {
      userStore.addLog(userStore.currentUser, '删除', '宠物', `删除宠物：${deletedPet.name}`)
    }
    return deletedPet
  }

  return {
    petStore,
    addPet,
    updatePet,
    deletePet,
  }
}
