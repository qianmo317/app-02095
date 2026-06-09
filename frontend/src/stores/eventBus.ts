import type { Pet, Adoption } from '@/mock/data'

// 跨 store 通信事件契约：store 仅负责发布业务事件，
// 不直接调用其它 store 的 action，副作用由 storeBridge 集中处理。
//
// 每个事件 payload 都携带 rollback：用于在订阅端联动失败时
// 由 bus 的发布方提供"补偿事务"——回退到 emit 之前的状态，
// 避免出现"adoption 已通过、但 pet 状态未更新"这种部分成功。
export interface StoreEventMap {
  'pet:added': { pet: Pet; rollback: () => void }
  'pet:updated': { pet: Pet; rollback: () => void }
  'pet:deleted': { pet: Pet; rollback: () => void }
  'adoption:submitted': { adoption: Adoption; rollback: () => void }
  'adoption:approved': { adoption: Adoption; rollback: () => void }
  'adoption:rejected': { adoption: Adoption; rollback: () => void }
}

type EventName = keyof StoreEventMap
type Handler<E extends EventName> = (payload: StoreEventMap[E]) => void

interface QueuedEvent {
  event: EventName
  payload: StoreEventMap[EventName]
}

const handlers: { [E in EventName]?: Set<Handler<E>> } = {}

// 启动时序防丢：在 storeBridge 注册订阅前发出的事件
// 会先进入 pendingQueue，待 activate() 调用后按 FIFO 顺序回放。
const pendingQueue: QueuedEvent[] = []
let active = false

function dispatch<E extends EventName>(event: E, payload: StoreEventMap[E]): void {
  const set = handlers[event] as Set<Handler<E>> | undefined
  if (!set || set.size === 0) return
  // 复制一份避免 handler 中触发增删导致的迭代异常
  const snapshot = Array.from(set)
  for (const h of snapshot) {
    try {
      h(payload)
    } catch (err) {
      // 单个 handler 抛错不影响其它 handler 的执行
      console.error(`[eventBus] handler for "${event}" threw, isolated:`, err)
    }
  }
}

export const eventBus = {
  on<E extends EventName>(event: E, handler: Handler<E>): () => void {
    let set = handlers[event] as Set<Handler<E>> | undefined
    if (!set) {
      set = new Set<Handler<E>>()
      handlers[event] = set as never
    }
    set.add(handler)
    return () => set!.delete(handler)
  },
  off<E extends EventName>(event: E, handler: Handler<E>): void {
    const set = handlers[event] as Set<Handler<E>> | undefined
    set?.delete(handler)
  },
  emit<E extends EventName>(event: E, payload: StoreEventMap[E]): void {
    if (!active) {
      pendingQueue.push({ event, payload } as QueuedEvent)
      return
    }
    dispatch(event, payload)
  },
  // 由 setupStoreBridge 在所有订阅完成后调用，
  // 切换为 active 并回放此前积压的事件。
  activate(): void {
    if (active) return
    active = true
    while (pendingQueue.length > 0) {
      const item = pendingQueue.shift()!
      dispatch(item.event, item.payload)
    }
  },
  isActive(): boolean {
    return active
  },
  // 仅用于测试 / 热更新场景下的清理。
  reset(): void {
    active = false
    pendingQueue.length = 0
    ;(Object.keys(handlers) as EventName[]).forEach(k => delete handlers[k])
  },
}
