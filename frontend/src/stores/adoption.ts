import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockAdoptions, type Adoption } from '@/mock/data'
import { emitStoreEvent } from './events'

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
    const result = emitStoreEvent('adoption:submitted', { userId: data.userId, petId: data.petId })
    if (result.hasErrors) {
      adoptions.value.shift()
      throw new Error(`领养申请副作用执行失败：${result.errors.map(e => e.message).join('; ')}`)
    }
    return newAdoption
  }

  function approveAdoption(id: number) {
    const adoption = adoptions.value.find(a => a.id === id)
    if (!adoption) return
    const prevStatus = adoption.status
    const prevUpdatedAt = adoption.updatedAt
    adoption.status = 'approved'
    adoption.updatedAt = new Date().toISOString().split('T')[0]
    const result = emitStoreEvent('adoption:approved', { applicantId: adoption.userId, petId: adoption.petId })
    if (result.hasErrors) {
      adoption.status = prevStatus
      adoption.updatedAt = prevUpdatedAt
      throw new Error(`审批通过副作用执行失败：${result.errors.map(e => e.message).join('; ')}`)
    }
  }

  function rejectAdoption(id: number) {
    const adoption = adoptions.value.find(a => a.id === id)
    if (!adoption) return
    const prevStatus = adoption.status
    const prevUpdatedAt = adoption.updatedAt
    adoption.status = 'rejected'
    adoption.updatedAt = new Date().toISOString().split('T')[0]
    const result = emitStoreEvent('adoption:rejected', { applicantId: adoption.userId, petId: adoption.petId })
    if (result.hasErrors) {
      adoption.status = prevStatus
      adoption.updatedAt = prevUpdatedAt
      throw new Error(`审批拒绝副作用执行失败：${result.errors.map(e => e.message).join('; ')}`)
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
