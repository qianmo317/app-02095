<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="sidebar-logo">
        <el-icon :size="24" color="var(--color-primary)"><HomeFilled /></el-icon>
        <span>PetHome 管理</span>
      </div>
      <nav class="sidebar-nav">
        <router-link v-for="item in menuItems" :key="item.path" :to="item.path"
          class="sidebar-item" :class="{ active: isActive(item.path) }">
          <el-icon :size="18"><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </router-link>
      </nav>
      <div class="sidebar-footer">
        <router-link to="/" class="sidebar-item back-link">
          <el-icon :size="18"><Back /></el-icon>
          <span>返回前台</span>
        </router-link>
      </div>
    </aside>
    <div class="admin-body">
      <header class="admin-header">
        <h2 class="page-title">{{ currentTitle }}</h2>
        <div class="header-right">
          <span class="admin-user">
            <el-avatar :size="32" :src="userStore.currentUser?.avatar" />
            <span>{{ userStore.currentUser?.nickname }}</span>
          </span>
          <el-button text @click="handleLogout">
            <el-icon><SwitchButton /></el-icon>
          </el-button>
        </div>
      </header>
      <main class="admin-main">
        <router-view v-slot="{ Component, route }">
          <transition name="admin-fade">
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const menuItems = [
  { path: '/admin', label: '仪表盘', icon: 'DataAnalysis' },
  { path: '/admin/pets', label: '宠物管理', icon: 'Magnet' },
  { path: '/admin/adoptions', label: '领养管理', icon: 'Tickets' },
  { path: '/admin/users', label: '用户管理', icon: 'UserFilled' },
  { path: '/admin/logs', label: '操作日志', icon: 'Document' },
]

function isActive(path: string) {
  if (path === '/admin') return route.path === '/admin'
  return route.path.startsWith(path)
}

const currentTitle = computed(() => {
  const item = menuItems.find(m => isActive(m.path))
  return item?.label || '管理后台'
})

function handleLogout() {
  userStore.logout()
  ElMessage.success('已退出登录')
  router.push('/')
}
</script>

<style scoped lang="scss">
.admin-layout {
  display: flex;
  min-height: 100vh;
}

.admin-sidebar {
  width: var(--sidebar-width);
  background: var(--color-bg-sidebar);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
}

.sidebar-logo {
  padding: var(--space-6);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  span {
    font-family: var(--font-heading);
    font-size: var(--text-lg);
    font-weight: var(--font-bold);
    color: #fff;
  }
}

.sidebar-nav {
  flex: 1;
  padding: var(--space-4) var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  color: rgba(255, 255, 255, 0.6);
  font-size: var(--text-sm);
  text-decoration: none;
  transition: all var(--duration-fast) var(--ease-standard);
  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.06);
  }
  &.active {
    color: #fff;
    background: var(--color-primary);
    box-shadow: 0 2px 8px rgba(255, 140, 66, 0.3);
  }
}

.sidebar-footer {
  padding: var(--space-4) var(--space-3);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.back-link {
  color: rgba(255, 255, 255, 0.4);
  &:hover { color: rgba(255, 255, 255, 0.8); }
}

.admin-body {
  flex: 1;
  margin-left: var(--sidebar-width);
  background: var(--color-bg-page);
  background-image:
    radial-gradient(circle at 10% 20%, rgba(255, 140, 66, 0.03) 0%, transparent 40%),
    radial-gradient(circle at 90% 80%, rgba(78, 205, 196, 0.03) 0%, transparent 40%);
}

.admin-header {
  height: var(--header-height);
  padding: 0 var(--space-8);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--color-neutral-200);
}

.page-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.admin-user {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-neutral-600);
}

.admin-main {
  padding: var(--space-6) var(--space-8);
}

.admin-fade-enter-active {
  transition: opacity 0.18s ease;
}
.admin-fade-leave-active {
  transition: opacity 0.12s ease;
  position: absolute;
  width: 100%;
}
.admin-fade-enter-from,
.admin-fade-leave-to {
  opacity: 0;
}
</style>
