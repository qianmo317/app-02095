import { onStoreEvent } from './events'
import { useUserStore } from './user'
import { usePetStore } from './pet'

function safeAddLog(user: ReturnType<typeof useUserStore>['currentUser'], action: string, target: string, detail: string) {
  if (!user) return
  try {
    const userStore = useUserStore()
    userStore.addLog(user, action, target, detail)
  } catch {
    console.warn(`[StoreEvent] 日志记录失败：${action} ${target} ${detail}`)
  }
}

export function setupStoreSubscriptions() {
  onStoreEvent('adoption:submitted', ({ petId }) => {
    const userStore = useUserStore()
    const petStore = usePetStore()
    const pet = petStore.getPetById(petId)
    if (!pet) {
      throw new Error(`宠物不存在（ID: ${petId}），无法提交领养申请`)
    }
    safeAddLog(userStore.currentUser, '提交', '领养申请', `提交领养申请：${pet.name}`)
  })

  onStoreEvent('adoption:approved', ({ petId, applicantId }) => {
    const petStore = usePetStore()
    const pet = petStore.getPetById(petId)
    if (!pet) {
      throw new Error(`宠物不存在（ID: ${petId}），无法完成审批`)
    }
    petStore.updatePet(petId, { status: 'adopted' })
    const userStore = useUserStore()
    const applicant = userStore.users.find(u => u.id === applicantId)
    safeAddLog(userStore.currentUser, '审批', '领养申请', `通过用户${applicant?.nickname || '未知'}的领养申请（${pet.name}）`)
  })

  onStoreEvent('adoption:rejected', ({ petId, applicantId }) => {
    const userStore = useUserStore()
    const petStore = usePetStore()
    const pet = petStore.getPetById(petId)
    const applicant = userStore.users.find(u => u.id === applicantId)
    if (pet && applicant) {
      safeAddLog(userStore.currentUser, '审批', '领养申请', `拒绝用户${applicant.nickname}的领养申请（${pet.name}）`)
    }
  })

  onStoreEvent('pet:added', ({ petName }) => {
    const userStore = useUserStore()
    safeAddLog(userStore.currentUser, '新增', '宠物', `新增宠物：${petName}`)
  })

  onStoreEvent('pet:updated', ({ petName }) => {
    const userStore = useUserStore()
    safeAddLog(userStore.currentUser, '编辑', '宠物', `更新宠物信息：${petName}`)
  })

  onStoreEvent('pet:deleted', ({ petName }) => {
    const userStore = useUserStore()
    safeAddLog(userStore.currentUser, '删除', '宠物', `删除宠物：${petName}`)
  })
}
