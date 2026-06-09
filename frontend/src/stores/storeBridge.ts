import { eventBus } from './eventBus'
import { useUserStore } from './user'
import { usePetStore } from './pet'
import type { Pet } from '@/mock/data'

// storeBridge 集中订阅业务事件，处理需要跨 store 协调的副作用
// （如操作日志记录、领养通过后联动宠物状态）。
//
// 错误回退策略分两档：
//   critical：影响业务一致性的联动（例如 adoption:approved 联动 pet 状态）。
//             一旦失败，立即调用 payload.rollback() 撤销发布方的状态变更，
//             并主动撤销本 handler 内已经完成的部分变更，避免"半成功"。
//   advisory：仅作为附属副作用（操作日志）。失败时只 warn，不触发回退，
//             因为日志缺失不应导致业务流程被撤回。
//
// 时序：setupStoreBridge 在所有订阅注册完毕后调用 eventBus.activate()，
// 此前由 store 发出的事件会进入 pendingQueue，激活时按 FIFO 回放，
// 不会丢失。重复调用 setupStoreBridge 是幂等的。
let installed = false
const disposers: Array<() => void> = []

function safeAddLog(action: string, target: string, detail: string): void {
  try {
    const userStore = useUserStore()
    if (userStore.currentUser) {
      userStore.addLog(userStore.currentUser, action, target, detail)
    }
  } catch (err) {
    // advisory：日志失败不影响主流程
    console.warn('[storeBridge] addLog failed:', err)
  }
}

export function setupStoreBridge(): void {
  if (installed) return
  installed = true

  // ---- 宠物领域事件：仅触发 advisory 日志 ----
  disposers.push(eventBus.on('pet:added', ({ pet }) => {
    safeAddLog('新增', '宠物', `新增宠物：${pet.name}`)
  }))
  disposers.push(eventBus.on('pet:updated', ({ pet }) => {
    safeAddLog('编辑', '宠物', `更新宠物信息：${pet.name}`)
  }))
  disposers.push(eventBus.on('pet:deleted', ({ pet }) => {
    safeAddLog('删除', '宠物', `删除宠物：${pet.name}`)
  }))

  // ---- 领养领域事件 ----
  disposers.push(eventBus.on('adoption:submitted', ({ adoption }) => {
    // advisory：仅记录日志
    try {
      const petStore = usePetStore()
      const pet = petStore.getPetById(adoption.petId)
      if (pet) {
        safeAddLog('提交', '领养申请', `提交领养申请：${pet.name}`)
      }
    } catch (err) {
      console.warn('[storeBridge] adoption:submitted advisory failed:', err)
    }
  }))

  disposers.push(eventBus.on('adoption:approved', ({ adoption, rollback }) => {
    // critical：联动更新宠物为 adopted；失败时回退 adoption 自身状态
    let petPrev: Pet | undefined
    let petUpdated = false
    try {
      const petStore = usePetStore()
      petPrev = petStore.getPetById(adoption.petId)
      if (!petPrev) {
        // 找不到宠物，视为关键失败
        throw new Error(`pet ${adoption.petId} not found`)
      }
      petStore.updatePet(adoption.petId, { status: 'adopted' })
      petUpdated = true
    } catch (err) {
      console.error('[storeBridge] adoption:approved critical step failed, rolling back:', err)
      // 撤销本 handler 已经完成的 pet 变更
      if (petUpdated && petPrev) {
        try {
          const petStore = usePetStore()
          petStore.updatePet(adoption.petId, { status: petPrev.status })
        } catch (innerErr) {
          console.error('[storeBridge] compensating pet update failed:', innerErr)
        }
      }
      // 撤销发布方（adoption）的状态变更
      try {
        rollback()
      } catch (rbErr) {
        console.error('[storeBridge] adoption rollback failed:', rbErr)
      }
      return
    }

    // advisory：日志
    try {
      const petStore = usePetStore()
      const userStore = useUserStore()
      const pet = petStore.getPetById(adoption.petId)
      const applicant = userStore.users.find(u => u.id === adoption.userId)
      if (userStore.currentUser && pet && applicant) {
        safeAddLog('审批', '领养申请', `通过用户${applicant.nickname}的领养申请（${pet.name}）`)
      }
    } catch (err) {
      console.warn('[storeBridge] adoption:approved advisory failed:', err)
    }
  }))

  disposers.push(eventBus.on('adoption:rejected', ({ adoption }) => {
    // advisory：仅日志
    try {
      const petStore = usePetStore()
      const userStore = useUserStore()
      const pet = petStore.getPetById(adoption.petId)
      const applicant = userStore.users.find(u => u.id === adoption.userId)
      if (userStore.currentUser && pet && applicant) {
        safeAddLog('审批', '领养申请', `拒绝用户${applicant.nickname}的领养申请（${pet.name}）`)
      }
    } catch (err) {
      console.warn('[storeBridge] adoption:rejected advisory failed:', err)
    }
  }))

  // 所有订阅注册完成，激活并回放 pending 队列
  eventBus.activate()
}

export function teardownStoreBridge(): void {
  while (disposers.length) {
    const dispose = disposers.pop()
    try {
      dispose?.()
    } catch (err) {
      console.warn('[storeBridge] disposer failed:', err)
    }
  }
  installed = false
}
