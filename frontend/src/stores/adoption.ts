import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockAdoptions, type Adoption } from '@/mock/data'
import { eventBus } from './eventBus'

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
    // 回退策略：若关键订阅者失败，从列表中移除刚插入的申请
    const rollback = () => {
      adoptions.value = adoptions.value.filter(a => a.id !== newAdoption.id)
    }
    eventBus.emit('adoption:submitted', { adoption: newAdoption, rollback })
    return newAdoption
  }

  function approveAdoption(id: number) {
    const adoption = adoptions.value.find(a => a.id === id)
    if (!adoption) return
    // 在变更前保存快照，作为关键联动（pet 状态更新）失败时的回退依据
    const prevStatus = adoption.status
    const prevUpdatedAt = adoption.updatedAt
    adoption.status = 'approved'
    adoption.updatedAt = new Date().toISOString().split('T')[0]
    const rollback = () => {
      const cur = adoptions.value.find(a => a.id === id)
      if (cur) {
        cur.status = prevStatus
        cur.updatedAt = prevUpdatedAt
      }
    }
    eventBus.emit('adoption:approved', { adoption, rollback })
  }

  function rejectAdoption(id: number) {
    const adoption = adoptions.value.find(a => a.id === id)
    if (!adoption) return
    const prevStatus = adoption.status
    const prevUpdatedAt = adoption.updatedAt
    adoption.status = 'rejected'
    adoption.updatedAt = new Date().toISOString().split('T')[0]
    const rollback = () => {
      const cur = adoptions.value.find(a => a.id === id)
      if (cur) {
        cur.status = prevStatus
        cur.updatedAt = prevUpdatedAt
      }
    }
    eventBus.emit('adoption:rejected', { adoption, rollback })
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
