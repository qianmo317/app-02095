<template>
  <div class="pet-card" @click="$router.push(`/pets/${pet.id}`)">
    <div class="card-image">
      <div v-if="imgLoading" class="image-skeleton" />
      <img :src="pet.image" :alt="pet.name" loading="lazy"
        @load="imgLoading = false" @error="imgLoading = false"
        :style="{ opacity: imgLoading ? 0 : 1 }" />
      <span class="status-badge" :class="badgeClass">
        {{ badgeText }}
      </span>
    </div>
    <div class="card-body">
      <div class="card-header">
        <h3 class="pet-name">{{ pet.name }}</h3>
        <span class="pet-gender" :class="pet.gender">
          <el-icon v-if="pet.gender === 'male'"><Male /></el-icon>
          <el-icon v-else><Female /></el-icon>
        </span>
      </div>
      <p class="pet-breed">{{ pet.breed }}</p>
      <div class="card-tags">
        <span class="tag">{{ pet.age }}岁</span>
        <span class="tag">{{ pet.weight }}kg</span>
        <span v-if="pet.vaccinated" class="tag tag-success">已疫苗</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Pet } from '@/mock/data'
import { useUserStore } from '@/stores/user'
import { useAdoptionStore } from '@/stores/adoption'

const props = defineProps<{ pet: Pet }>()
const imgLoading = ref(true)

const userStore = useUserStore()
const adoptionStore = useAdoptionStore()

const statusMap: Record<string, string> = {
  available: '可领养',
  adopted: '已领养',
  pending: '审核中',
}

const hasApplied = computed(() => {
  if (!userStore.currentUser || props.pet.status !== 'available') return false
  return adoptionStore.hasUserApplied(userStore.currentUser.id, props.pet.id)
})

const badgeClass = computed(() => hasApplied.value ? 'applied' : props.pet.status)
const badgeText = computed(() => hasApplied.value ? '已申请' : statusMap[props.pet.status])
</script>

<style scoped lang="scss">
.pet-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-standard);
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    .card-image img { transform: scale(1.05); }
  }
}

.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--duration-slow) var(--ease-standard), opacity var(--duration-normal) var(--ease-standard);
  }
}

.image-skeleton {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, var(--color-neutral-100) 25%, var(--color-neutral-200) 50%, var(--color-neutral-100) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.status-badge {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  &.available { background: var(--color-success); color: #fff; }
  &.adopted { background: var(--color-neutral-400); color: #fff; }
  &.pending { background: var(--color-warning); color: #fff; }
  &.applied { background: var(--color-info); color: #fff; }
}

.card-body {
  padding: var(--space-4);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-1);
}

.pet-name {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
}

.pet-gender {
  &.male { color: var(--color-info); }
  &.female { color: var(--color-accent); }
}

.pet-breed {
  font-size: var(--text-sm);
  color: var(--color-neutral-500);
  margin-bottom: var(--space-3);
}

.card-tags {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.tag {
  padding: 2px var(--space-2);
  background: var(--color-neutral-100);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  color: var(--color-neutral-600);
  &.tag-success {
    background: rgba(39, 174, 96, 0.1);
    color: var(--color-success);
  }
}
</style>
