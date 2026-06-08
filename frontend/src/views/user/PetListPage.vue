<template>
  <div class="pet-list-page">
    <div class="page-inner">
      <div class="page-header animate-fade-in-up">
        <h1>领养宠物</h1>
        <p>选择你心仪的小伙伴，给 TA 一个温暖的家</p>
      </div>
      <div class="filter-bar animate-fade-in-up stagger-1">
        <el-input v-model="keyword" placeholder="搜索宠物名称或品种" prefix-icon="Search"
          clearable size="large" class="search-input" />
        <el-select v-model="speciesFilter" placeholder="物种" clearable size="large">
          <el-option label="猫" value="猫" />
          <el-option label="狗" value="狗" />
          <el-option label="兔子" value="兔子" />
        </el-select>
        <el-select v-model="genderFilter" placeholder="性别" clearable size="large">
          <el-option label="公" value="male" />
          <el-option label="母" value="female" />
        </el-select>
      </div>
      <div v-if="loading" class="loading-state">
        <el-skeleton :rows="3" animated />
        <el-skeleton :rows="3" animated />
      </div>
      <div v-else-if="filteredPets.length" class="pet-grid">
        <PetCard v-for="(pet, i) in filteredPets" :key="pet.id" :pet="pet"
          class="animate-fade-in-up" :class="`stagger-${(i % 6) + 1}`" />
      </div>
      <el-empty v-else description="没有找到匹配的宠物" class="animate-fade-in" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePetStore } from '@/stores/pet'
import PetCard from '@/components/business/PetCard.vue'

const petStore = usePetStore()
const loading = ref(true)

onMounted(() => {
  setTimeout(() => { loading.value = false }, 300)
})
const keyword = ref('')
const speciesFilter = ref('')
const genderFilter = ref('')

const filteredPets = computed(() =>
  petStore.filterPets({
    species: speciesFilter.value || undefined,
    gender: genderFilter.value || undefined,
    keyword: keyword.value || undefined,
  }).filter(p => p.status !== 'adopted')
)
</script>

<style scoped lang="scss">
.pet-list-page {
  padding: var(--space-8) var(--space-6);
}

.page-inner {
  max-width: var(--max-width);
  margin: 0 auto;
}

.page-header {
  margin-bottom: var(--space-6);
  h1 { font-size: var(--text-3xl); margin-bottom: var(--space-2); }
  p { color: var(--color-neutral-500); font-size: var(--text-lg); }
}

.filter-bar {
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
  flex-wrap: wrap;
  .search-input { flex: 1; min-width: 240px; }
  .el-select { width: 140px; }
}

.pet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--space-6);
}

.loading-state {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
}
</style>
