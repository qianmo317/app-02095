type Handler<T = any> = (payload: T) => void

export interface StoreEventMap {
  'adoption:submitted': { userId: number; petId: number }
  'adoption:approved': { applicantId: number; petId: number }
  'adoption:rejected': { applicantId: number; petId: number }
  'pet:added': { petName: string }
  'pet:updated': { petName: string }
  'pet:deleted': { petName: string }
}

type EventKey = keyof StoreEventMap

export interface EmitResult {
  errors: Error[]
  hasErrors: boolean
}

const handlers = new Map<EventKey, Set<Handler>>()

export function onStoreEvent<K extends EventKey>(
  event: K,
  handler: Handler<StoreEventMap[K]>
): () => void {
  if (!handlers.has(event)) {
    handlers.set(event, new Set())
  }
  handlers.get(event)!.add(handler as Handler)
  return () => {
    handlers.get(event)?.delete(handler as Handler)
  }
}

export function emitStoreEvent<K extends EventKey>(
  event: K,
  payload: StoreEventMap[K]
): EmitResult {
  const errors: Error[] = []
  handlers.get(event)?.forEach(h => {
    try {
      h(payload)
    } catch (e) {
      errors.push(e instanceof Error ? e : new Error(String(e)))
    }
  })
  return { errors, hasErrors: errors.length > 0 }
}
