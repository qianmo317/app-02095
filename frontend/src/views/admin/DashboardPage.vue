<template>
  <div class="dashboard-page">
    <div v-if="loading" class="loading-state">
      <el-skeleton :rows="2" animated v-for="i in 4" :key="i" style="flex:1" />
    </div>
    <div v-else class="stats-grid">
      <StatsCard v-for="(stat, i) in stats" :key="stat.label" v-bind="stat"
        class="animate-fade-in-up" :class="`stagger-${i + 1}`" />
    </div>

    <div class="charts-grid">
      <div class="chart-card animate-fade-in-up stagger-5">
        <h3>物种分布</h3>
        <div class="species-bars">
          <div v-for="item in speciesData" :key="item.species" class="bar-row">
            <span class="bar-label">{{ item.species }}</span>
            <div class="bar-track">
              <div class="bar-fill" :style="{ width: item.percentage + '%', background: item.color }" />
            </div>
            <span class="bar-value">{{ item.count }} 只 ({{ item.percentage }}%)</span>
          </div>
        </div>
      </div>
      <div class="chart-card animate-fade-in-up stagger-6">
        <h3>最近领养申请</h3>
        <div class="recent-list">
          <div v-for="item in recentAdoptions" :key="item.id" class="recent-item">
            <el-avatar :size="36" :src="item.avatar" />
            <div class="recent-info">
              <span class="recent-name">{{ item.username }}</span>
              <span class="recent-desc">申请领养 {{ item.petName }}</span>
            </div>
            <el-tag :type="tagType(item.status)" size="small">{{ statusMap[item.status] }}</el-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { usePetStore } from '@/stores/pet'
import { useAdoptionStore } from '@/stores/adoption'
import { useUserStore } from '@/stores/user'
import StatsCard from '@/components/ui/StatsCard.vue'

const loading = ref(true)
onMounted(() => { setTimeout(() => { loading.value = false }, 300) })

const petStore = usePetStore()
const adoptionStore = useAdoptionStore()
const userStore = useUserStore()

const stats = computed(() => [
  { icon: 'Magnet', label: '总宠物数', value: petStore.totalCount, color: 'var(--color-primary)' },
  { icon: 'CircleCheck', label: '可领养', value: petStore.availableCount, color: 'var(--color-success)' },
  { icon: 'SuccessFilled', label: '已领养', value: petStore.adoptedCount, color: 'var(--color-secondary)' },
  { icon: 'Clock', label: '待审批', value: adoptionStore.pendingCount, color: 'var(--color-warning)' },
])

const speciesData = computed(() => {
  const groups: Record<string, number> = {}
  petStore.pets.forEach(p => { groups[p.species] = (groups[p.species] || 0) + 1 })
  const total = petStore.totalCount
  const colors = ['var(--color-primary)', 'var(--color-secondary)', 'var(--color-accent)', 'var(--color-info)']
  return Object.entries(groups).map(([species, count], i) => ({
    species, count,
    percentage: Math.round((count / total) * 100),
    color: colors[i % colors.length],
  }))
})

const statusMap: Record<string, string> = { pending: '待审批', approved: '已通过', rejected: '已拒绝' }

function tagType(status: string) {
  const map: Record<string, string> = { pending: 'warning', approved: 'success', rejected: 'danger' }
  return (map[status] || '') as '' | 'warning' | 'success' | 'danger'
}

const recentAdoptions = computed(() =>
  adoptionStore.adoptions.slice(0, 5).map(a => {
    const user = userStore.users.find(u => u.id === a.userId)
    const pet = petStore.getPetById(a.petId)
    return {
      id: a.id, status: a.status,
      username: user?.nickname || '未知',
      avatar: user?.avatar || '',
      petName: pet?.name || '未知',
    }
  })
)
</script>

<style scoped lang="scss">
.loading-state {
  display: flex;
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-6);
  margin-bottom: var(--space-8);
  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
}

.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
  @media (max-width: 768px) { grid-template-columns: 1fr; }
}

.chart-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  h3 {
    font-size: var(--text-lg);
    margin-bottom: var(--space-6);
  }
}

.species-bars {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.bar-row {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.bar-label {
  width: 40px;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}

.bar-track {
  flex: 1;
  height: 12px;
  background: var(--color-neutral-100);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width var(--duration-slow) var(--ease-decelerate);
}

.bar-value {
  width: 100px;
  text-align: right;
  font-size: var(--text-sm);
  color: var(--color-neutral-500);
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.recent-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.recent-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.recent-name {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}

.recent-desc {
  font-size: var(--text-xs);
  color: var(--color-neutral-500);
}
</style>
