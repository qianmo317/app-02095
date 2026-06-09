<template>
  <div class="manage-page">
    <div class="page-toolbar animate-fade-in-up">
      <el-radio-group v-model="statusFilter" @change="() => {}">
        <el-radio-button value="">全部 ({{ adoptionStore.adoptions.length }})</el-radio-button>
        <el-radio-button value="pending">待审批 ({{ adoptionStore.pendingCount }})</el-radio-button>
        <el-radio-button value="approved">已通过 ({{ adoptionStore.approvedCount }})</el-radio-button>
        <el-radio-button value="rejected">已拒绝 ({{ adoptionStore.rejectedCount }})</el-radio-button>
      </el-radio-group>
    </div>

    <el-table :data="filteredAdoptions" stripe class="animate-fade-in-up stagger-1" style="width: 100%">
      <el-table-column label="申请人" width="140">
        <template #default="{ row }">
          <div style="display: flex; align-items: center; gap: 8px;">
            <el-avatar :size="32" :src="getUser(row.userId)?.avatar" />
            <span>{{ getUser(row.userId)?.nickname }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="宠物" width="120">
        <template #default="{ row }">
          <div style="display: flex; align-items: center; gap: 8px;">
            <el-avatar :size="32" :src="getPet(row.petId)?.image" shape="square" />
            <span>{{ getPet(row.petId)?.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="reason" label="领养理由" show-overflow-tooltip />
      <el-table-column prop="experience" label="养宠经验" width="140" show-overflow-tooltip />
      <el-table-column prop="phone" label="电话" width="130" />
      <el-table-column prop="createdAt" label="申请时间" width="120" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="tagType(row.status)" size="small">{{ statusMap[row.status] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <template v-if="row.status === 'pending'">
            <el-popconfirm title="确定通过此领养申请？" confirm-button-text="确定" cancel-button-text="取消" @confirm="handleApprove(row.id)">
              <template #reference>
                <el-button text type="success" size="small">通过</el-button>
              </template>
            </el-popconfirm>
            <el-popconfirm title="确定拒绝此领养申请？" confirm-button-text="确定" cancel-button-text="取消" @confirm="handleReject(row.id)">
              <template #reference>
                <el-button text type="danger" size="small">拒绝</el-button>
              </template>
            </el-popconfirm>
          </template>
          <span v-else class="text-muted">已处理</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAdoptionStore } from '@/stores/adoption'
import { useUserStore } from '@/stores/user'
import { usePetStore } from '@/stores/pet'
import { ElMessage } from 'element-plus'

const adoptionStore = useAdoptionStore()
const userStore = useUserStore()
const petStore = usePetStore()
const statusFilter = ref('')

const statusMap: Record<string, string> = { pending: '待审批', approved: '已通过', rejected: '已拒绝' }

function tagType(s: string) {
  return ({ pending: 'warning', approved: 'success', rejected: 'danger' }[s] || '') as '' | 'warning' | 'success' | 'danger'
}

const filteredAdoptions = computed(() =>
  statusFilter.value
    ? adoptionStore.adoptions.filter(a => a.status === statusFilter.value)
    : adoptionStore.adoptions
)

function getUser(id: number) { return userStore.users.find(u => u.id === id) }
function getPet(id: number) { return petStore.getPetById(id) }

function handleApprove(id: number) {
  try {
    adoptionStore.approveAdoption(id)
    ElMessage.success('已通过领养申请')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '审批操作失败')
  }
}

function handleReject(id: number) {
  try {
    adoptionStore.rejectAdoption(id)
    ElMessage.success('已拒绝领养申请')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '审批操作失败')
  }
}
</script>

<style scoped lang="scss">
.manage-page {
  .page-toolbar { margin-bottom: var(--space-6); }
  .text-muted { color: var(--color-neutral-400); font-size: var(--text-sm); }
}
</style>
