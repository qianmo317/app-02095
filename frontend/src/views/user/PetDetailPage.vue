<template>
  <div class="pet-detail-page" v-if="pet">
    <div class="page-inner">
      <el-breadcrumb separator="/" class="breadcrumb animate-fade-in">
        <el-breadcrumb-item :to="{ path: '/pets' }">领养宠物</el-breadcrumb-item>
        <el-breadcrumb-item>{{ pet.name }}</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="detail-grid">
        <div class="detail-image animate-fade-in-up">
          <div v-if="detailImgLoading" class="detail-img-skeleton" />
          <img :src="pet.image" :alt="pet.name"
            @load="detailImgLoading = false" @error="detailImgLoading = false"
            :style="{ opacity: detailImgLoading ? 0 : 1 }" />
        </div>
        <div class="detail-info animate-fade-in-up stagger-1">
          <div class="info-header">
            <h1>{{ pet.name }}</h1>
            <el-tag :type="statusType" size="large">{{ statusMap[pet.status] }}</el-tag>
          </div>
          <p class="breed-text">{{ pet.breed }}</p>

          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">年龄</span>
              <span class="info-value">{{ pet.age }} 岁</span>
            </div>
            <div class="info-item">
              <span class="info-label">性别</span>
              <span class="info-value">{{ pet.gender === 'male' ? '公' : '母' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">体重</span>
              <span class="info-value">{{ pet.weight }} kg</span>
            </div>
            <div class="info-item">
              <span class="info-label">健康</span>
              <span class="info-value">{{ pet.healthStatus }}</span>
            </div>
          </div>

          <div class="health-tags">
            <el-tag v-if="pet.vaccinated" type="success">已接种疫苗</el-tag>
            <el-tag v-else type="warning">未接种疫苗</el-tag>
            <el-tag v-if="pet.sterilized" type="success">已绝育</el-tag>
            <el-tag v-else type="info">未绝育</el-tag>
          </div>

          <div class="description">
            <h3>关于 {{ pet.name }}</h3>
            <p>{{ pet.description }}</p>
          </div>

          <div class="action-bar">
            <el-button v-if="pet.status === 'available' && userStore.isLoggedIn && !userStore.isAdmin"
              type="primary" size="large" :disabled="hasApplied" @click="showAdoptDialog = true">
              {{ hasApplied ? '已提交申请' : '申请领养' }}
            </el-button>
            <el-button v-else-if="pet.status === 'available' && userStore.isLoggedIn && userStore.isAdmin"
              type="primary" size="large" disabled>
              管理员账号无法申请领养
            </el-button>
            <el-button v-else-if="pet.status === 'available' && !userStore.isLoggedIn" type="primary" size="large"
              @click="$router.push(`/login?redirect=/pets/${pet.id}`)">
              登录后申请领养
            </el-button>
            <el-button size="large" @click="$router.back()">返回</el-button>
          </div>
        </div>
      </div>
    </div>

    <el-dialog v-model="showAdoptDialog" title="领养申请" width="520px" destroy-on-close>
      <el-form ref="adoptFormRef" :model="adoptForm" :rules="adoptRules" label-position="top">
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="adoptForm.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="居住地址" prop="address">
          <el-input v-model="adoptForm.address" placeholder="请输入居住地址" />
        </el-form-item>
        <el-form-item label="养宠经验" prop="experience">
          <el-input v-model="adoptForm.experience" placeholder="请描述您的养宠经验" />
        </el-form-item>
        <el-form-item label="领养理由" prop="reason">
          <el-input v-model="adoptForm.reason" type="textarea" :rows="3" placeholder="请说明您希望领养的理由" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAdoptDialog = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmitAdoption">提交申请</el-button>
      </template>
    </el-dialog>
  </div>
  <el-empty v-else description="宠物不存在" />
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAdoptionService } from '@/composables/useAdoptionService'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

const route = useRoute()
const { petStore, userStore, adoptionStore, submitAdoption } = useAdoptionService()

const detailImgLoading = ref(true)
const pet = computed(() => petStore.getPetById(Number(route.params.id)))
const hasApplied = computed(() => {
  if (!userStore.currentUser || !pet.value) return false
  return adoptionStore.hasUserApplied(userStore.currentUser.id, pet.value.id)
})

const statusMap: Record<string, string> = { available: '可领养', adopted: '已领养', pending: '审核中' }
const statusType = computed(() => {
  const map: Record<string, string> = { available: 'success', adopted: 'info', pending: 'warning' }
  return (map[pet.value?.status || ''] || '') as '' | 'success' | 'info' | 'warning'
})

const showAdoptDialog = ref(false)
const submitting = ref(false)
const adoptFormRef = ref<FormInstance>()
const adoptForm = reactive({ phone: '', address: '', experience: '', reason: '' })
const adoptRules: FormRules = {
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  address: [{ required: true, message: '请输入居住地址', trigger: 'blur' }],
  reason: [{ required: true, message: '请输入领养理由', trigger: 'blur' }],
}

async function handleSubmitAdoption() {
  const valid = await adoptFormRef.value?.validate().catch(() => false)
  if (!valid || !userStore.currentUser || !pet.value) return
  submitting.value = true
  await new Promise(r => setTimeout(r, 600))
  submitAdoption({
    userId: userStore.currentUser.id,
    petId: pet.value.id,
    ...adoptForm,
  })
  submitting.value = false
  showAdoptDialog.value = false
  ElMessage.success('领养申请已提交，请等待审核')
}
</script>

<style scoped lang="scss">
.pet-detail-page {
  padding: var(--space-8) var(--space-6);
}

.page-inner {
  max-width: var(--max-width);
  margin: 0 auto;
}

.breadcrumb { margin-bottom: var(--space-6); }

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-8);
  @media (max-width: 768px) { grid-template-columns: 1fr; }
}

.detail-image {
  position: relative;
}

.detail-image img {
  width: 100%;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  aspect-ratio: 4/3;
  object-fit: cover;
  transition: opacity var(--duration-normal) var(--ease-standard);
}

.detail-img-skeleton {
  position: absolute;
  inset: 0;
  border-radius: var(--radius-xl);
  background: linear-gradient(90deg, var(--color-neutral-100) 25%, var(--color-neutral-200) 50%, var(--color-neutral-100) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  aspect-ratio: 4/3;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.info-header {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-2);
  h1 { font-size: var(--text-3xl); }
}

.breed-text {
  color: var(--color-neutral-500);
  font-size: var(--text-lg);
  margin-bottom: var(--space-6);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.info-item {
  padding: var(--space-4);
  background: var(--color-neutral-50);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.info-label {
  font-size: var(--text-xs);
  color: var(--color-neutral-500);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
}

.health-tags {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
}

.description {
  margin-bottom: var(--space-8);
  h3 { margin-bottom: var(--space-3); font-size: var(--text-lg); }
  p { color: var(--color-neutral-600); line-height: 1.8; }
}

.action-bar {
  display: flex;
  gap: var(--space-4);
}
</style>
