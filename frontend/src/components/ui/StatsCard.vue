<template>
  <div class="stats-card" :style="{ '--accent': color }">
    <div class="stats-icon">
      <el-icon :size="24"><component :is="icon" /></el-icon>
    </div>
    <div class="stats-info">
      <span class="stats-value">{{ value }}</span>
      <span class="stats-label">{{ label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
  label: string
  value: number | string
  color: string
}>()
</script>

<style scoped lang="scss">
.stats-card {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  border-left: 4px solid var(--accent);
  transition: all var(--duration-normal) var(--ease-standard);
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
}

.stats-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--accent) 10%, transparent);
  color: var(--accent);
}

.stats-info {
  display: flex;
  flex-direction: column;
}

.stats-value {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-neutral-900);
  line-height: 1;
}

.stats-label {
  font-size: var(--text-sm);
  color: var(--color-neutral-500);
  margin-top: var(--space-1);
}
</style>
