<template>
  <div class="manage-page animate-fade-in-up">
    <el-table :data="userStore.users" stripe style="width: 100%">
      <el-table-column label="头像" width="80">
        <template #default="{ row }">
          <el-avatar :size="40" :src="row.avatar" />
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" width="120" />
      <el-table-column prop="nickname" label="昵称" width="120" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="phone" label="手机号" width="140" />
      <el-table-column label="角色" width="100">
        <template #default="{ row }">
          <el-tag :type="row.role === 'admin' ? 'danger' : ''" size="small">
            {{ row.role === 'admin' ? '管理员' : '普通用户' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
            {{ row.status === 'active' ? '正常' : '已禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="注册时间" width="120" />
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-popconfirm v-if="row.role !== 'admin'"
            :title="`确定${row.status === 'active' ? '禁用' : '启用'}此用户？`"
            confirm-button-text="确定" cancel-button-text="取消"
            @confirm="userStore.toggleUserStatus(row.id)">
            <template #reference>
              <el-button text :type="row.status === 'active' ? 'danger' : 'success'" size="small">
                {{ row.status === 'active' ? '禁用' : '启用' }}
              </el-button>
            </template>
          </el-popconfirm>
          <span v-else class="text-muted">-</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
</script>

<style scoped lang="scss">
.text-muted { color: var(--color-neutral-400); font-size: var(--text-sm); }
</style>
