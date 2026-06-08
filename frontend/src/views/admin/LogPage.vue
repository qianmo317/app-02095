<template>
  <div class="manage-page animate-fade-in-up">
    <div class="page-toolbar">
      <el-select v-model="actionFilter" placeholder="操作类型" clearable>
        <el-option label="新增" value="新增" />
        <el-option label="编辑" value="编辑" />
        <el-option label="删除" value="删除" />
        <el-option label="审批" value="审批" />
        <el-option label="提交" value="提交" />
        <el-option label="登录" value="登录" />
        <el-option label="禁用" value="禁用" />
      </el-select>
    </div>
    <el-table :data="filteredLogs" stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="username" label="操作人" width="120" />
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-tag :type="actionTagType(row.action)" size="small">{{ row.action }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="target" label="目标" width="120" />
      <el-table-column prop="detail" label="详情" show-overflow-tooltip />
      <el-table-column prop="createdAt" label="时间" width="180" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const actionFilter = ref('')

const filteredLogs = computed(() =>
  actionFilter.value
    ? userStore.logs.filter(l => l.action === actionFilter.value)
    : userStore.logs
)

function actionTagType(action: string) {
  const map: Record<string, string> = {
    '新增': 'success', '编辑': '', '删除': 'danger',
    '审批': 'warning', '提交': 'info', '登录': '', '登出': '', '禁用': 'danger', '启用': 'success',
  }
  return (map[action] || '') as '' | 'success' | 'warning' | 'danger' | 'info'
}
</script>

<style scoped lang="scss">
.page-toolbar { margin-bottom: var(--space-6); }
</style>
