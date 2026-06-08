<template>
  <div class="user-layout bg-pattern">
    <header class="user-header">
      <div class="header-inner">
        <router-link to="/" class="logo">
          <el-icon :size="28" color="var(--color-primary)"><HomeFilled /></el-icon>
          <span class="logo-text">PetHome</span>
        </router-link>
        <nav class="nav-links">
          <router-link to="/" class="nav-item" :class="{ active: route.path === '/' }">首页</router-link>
          <router-link to="/pets" class="nav-item" :class="{ active: route.path.startsWith('/pets') }">领养宠物</router-link>
        </nav>
        <div class="header-actions">
          <template v-if="userStore.isLoggedIn">
            <span class="user-greeting">你好，{{ userStore.currentUser?.nickname }}</span>
            <el-button v-if="userStore.isAdmin" type="primary" size="small" @click="$router.push('/admin')">
              <el-icon><Setting /></el-icon>管理后台
            </el-button>
            <el-button size="small" @click="handleLogout">退出</el-button>
          </template>
          <el-button v-else type="primary" @click="$router.push('/login')">
            <el-icon><User /></el-icon>登录
          </el-button>
        </div>
      </div>
    </header>
    <main class="user-main">
      <router-view v-slot="{ Component, route }">
        <transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>
    <footer class="user-footer">
      <p>&copy; 2026 PetHome 宠物领养平台 — 让每一个生命都有家</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

function handleLogout() {
  userStore.logout()
  ElMessage.success('已退出登录')
  router.push('/')
}
</script>

<style scoped lang="scss">
.user-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.user-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-neutral-200);
  box-shadow: var(--shadow-sm);
}

.header-inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--space-6);
  height: var(--header-height);
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  text-decoration: none;
  .logo-text {
    font-family: var(--font-heading);
    font-size: var(--text-xl);
    font-weight: var(--font-bold);
    color: var(--color-neutral-900);
  }
}

.nav-links {
  display: flex;
  gap: var(--space-6);
  flex: 1;
}

.nav-item {
  position: relative;
  font-size: var(--text-base);
  color: var(--color-neutral-600);
  padding: var(--space-2) 0;
  transition: color var(--duration-fast) var(--ease-standard);
  text-decoration: none;
  &:hover, &.active {
    color: var(--color-primary);
  }
  &.active::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--color-primary);
    border-radius: var(--radius-full);
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.user-greeting {
  font-size: var(--text-sm);
  color: var(--color-neutral-600);
}

.user-main {
  flex: 1;
}

.user-footer {
  text-align: center;
  padding: var(--space-8) var(--space-6);
  color: var(--color-neutral-500);
  font-size: var(--text-sm);
  border-top: 1px solid var(--color-neutral-200);
}
</style>
