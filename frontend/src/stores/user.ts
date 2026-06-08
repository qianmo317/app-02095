import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockUsers, type User } from '@/mock/data'
import type { OperationLog } from '@/mock/data'
import { mockLogs } from '@/mock/data'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const users = ref<User[]>([...mockUsers])
  const logs = ref<OperationLog[]>([...mockLogs])

  const isLoggedIn = computed(() => !!token.value && !!currentUser.value)
  const isAdmin = computed(() => currentUser.value?.role === 'admin')

  function login(username: string, password: string): { success: boolean; message: string } {
    const user = users.value.find(u => u.username === username && u.password === password)
    if (!user) return { success: false, message: '用户名或密码错误' }
    if (user.status === 'disabled') return { success: false, message: '该账号已被禁用，请联系管理员' }
    currentUser.value = user
    token.value = `mock-token-${user.id}-${Date.now()}`
    localStorage.setItem('token', token.value)
    localStorage.setItem('userId', String(user.id))
    addLog(user, '登录', '系统', `${user.nickname} 登录系统`)
    return { success: true, message: '登录成功' }
  }

  function logout() {
    if (currentUser.value) {
      addLog(currentUser.value, '登出', '系统', `${currentUser.value.nickname} 退出系统`)
    }
    currentUser.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
  }

  function restoreSession() {
    const savedId = localStorage.getItem('userId')
    if (token.value && savedId) {
      const user = users.value.find(u => u.id === Number(savedId))
      if (user && user.status === 'active') {
        currentUser.value = user
      } else {
        logout()
      }
    }
  }

  function toggleUserStatus(userId: number) {
    const user = users.value.find(u => u.id === userId)
    if (user) {
      user.status = user.status === 'active' ? 'disabled' : 'active'
      const action = user.status === 'active' ? '启用' : '禁用'
      addLog(currentUser.value!, action, '用户', `${action}用户：${user.nickname}`)
    }
  }

  function addLog(user: User, action: string, target: string, detail: string) {
    logs.value.unshift({
      id: logs.value.length + 1,
      userId: user.id,
      username: user.nickname,
      action, target, detail,
      createdAt: new Date().toLocaleString('zh-CN'),
    })
  }

  return {
    currentUser, token, users, logs,
    isLoggedIn, isAdmin,
    login, logout, restoreSession, toggleUserStatus, addLog,
  }
})
