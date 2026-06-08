<template>
  <div class="home-page">
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-content animate-fade-in-up">
          <h1>给流浪动物<br/><span class="highlight">一个温暖的家</span></h1>
          <p>PetHome 宠物领养平台，连接爱与被爱。每一次领养，都是一次生命的重生。</p>
          <div class="hero-actions">
            <el-button type="primary" size="large" @click="$router.push('/pets')">
              <el-icon><Search /></el-icon>浏览宠物
            </el-button>
            <el-button size="large" plain @click="$router.push(userStore.isLoggedIn ? '/pets' : '/login')">了解更多</el-button>
          </div>
          <div class="hero-stats">
            <div class="stat-item">
              <strong>{{ petStore.totalCount }}</strong>
              <span>在册宠物</span>
            </div>
            <div class="stat-item">
              <strong>{{ petStore.adoptedCount }}</strong>
              <span>成功领养</span>
            </div>
            <div class="stat-item">
              <strong>{{ petStore.availableCount }}</strong>
              <span>等待领养</span>
            </div>
          </div>
        </div>
        <div class="hero-image animate-fade-in-up stagger-2">
          <img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=500&fit=crop" alt="宠物" />
        </div>
      </div>
    </section>

    <section class="featured-section">
      <div class="section-inner">
        <div class="section-header animate-fade-in-up">
          <h2>精选宠物</h2>
          <p>这些小可爱正在等待一个温暖的家</p>
        </div>
        <div class="pet-grid">
          <PetCard v-for="(pet, i) in featuredPets" :key="pet.id" :pet="pet"
            class="animate-fade-in-up" :class="`stagger-${i + 1}`" />
        </div>
        <div class="section-action animate-fade-in-up">
          <el-button type="primary" size="large" plain @click="$router.push('/pets')">
            查看全部宠物 <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
      </div>
    </section>

    <section class="process-section">
      <div class="section-inner">
        <div class="section-header animate-fade-in-up">
          <h2>领养流程</h2>
          <p>简单四步，带 TA 回家</p>
        </div>
        <div class="process-steps">
          <div v-for="(step, i) in steps" :key="i" class="process-step animate-fade-in-up" :class="`stagger-${i + 1}`">
            <div class="step-number">{{ i + 1 }}</div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePetStore } from '@/stores/pet'
import { useUserStore } from '@/stores/user'
import PetCard from '@/components/business/PetCard.vue'

const petStore = usePetStore()
const userStore = useUserStore()
const featuredPets = computed(() => petStore.availablePets.slice(0, 4))

const steps = [
  { title: '浏览宠物', desc: '在平台上查看待领养宠物的详细信息和照片' },
  { title: '提交申请', desc: '选择心仪的宠物，填写领养申请表' },
  { title: '审核通过', desc: '工作人员审核申请，确认领养条件' },
  { title: '接回家', desc: '签署协议，将小可爱带回温暖的新家' },
]
</script>

<style scoped lang="scss">
.home-page {
  overflow: hidden;
}

.hero {
  padding: var(--space-16) var(--space-6) var(--space-12);
}

.hero-inner {
  max-width: var(--max-width);
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: var(--space-12);
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
}

.hero-content {
  flex: 1;
  h1 {
    font-size: var(--text-4xl);
    line-height: 1.2;
    margin-bottom: var(--space-4);
    .highlight {
      color: var(--color-primary);
      position: relative;
    }
  }
  > p {
    font-size: var(--text-lg);
    color: var(--color-neutral-500);
    max-width: 480px;
    margin-bottom: var(--space-8);
  }
}

.hero-actions {
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
  @media (max-width: 768px) { justify-content: center; }
}

.hero-stats {
  display: flex;
  gap: var(--space-8);
  @media (max-width: 768px) { justify-content: center; }
}

.stat-item {
  display: flex;
  flex-direction: column;
  strong {
    font-family: var(--font-heading);
    font-size: var(--text-2xl);
    font-weight: var(--font-bold);
    color: var(--color-primary);
  }
  span {
    font-size: var(--text-sm);
    color: var(--color-neutral-500);
  }
}

.hero-image {
  width: 480px;
  flex-shrink: 0;
  img {
    width: 100%;
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-xl);
  }
  @media (max-width: 768px) {
    width: 100%;
    max-width: 400px;
  }
}

.featured-section, .process-section {
  padding: var(--space-12) var(--space-6);
}

.section-inner {
  max-width: var(--max-width);
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: var(--space-8);
  h2 {
    font-size: var(--text-3xl);
    margin-bottom: var(--space-2);
  }
  p {
    color: var(--color-neutral-500);
    font-size: var(--text-lg);
  }
}

.pet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--space-6);
}

.section-action {
  text-align: center;
  margin-top: var(--space-8);
}

.process-steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-6);
  @media (max-width: 768px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 480px) { grid-template-columns: 1fr; }
}

.process-step {
  text-align: center;
  padding: var(--space-8) var(--space-4);
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--duration-normal) var(--ease-standard);
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
  }
}

.step-number {
  width: 48px;
  height: 48px;
  margin: 0 auto var(--space-4);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
  color: #fff;
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  border-radius: var(--radius-full);
}

.process-step h3 {
  font-size: var(--text-lg);
  margin-bottom: var(--space-2);
}

.process-step p {
  font-size: var(--text-sm);
  color: var(--color-neutral-500);
}
</style>
