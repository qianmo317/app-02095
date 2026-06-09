<template>
  <div class="manage-page">
    <div class="page-toolbar animate-fade-in-up">
      <el-input v-model="keyword" placeholder="搜索宠物..." prefix-icon="Search" clearable class="toolbar-search" />
      <el-button type="primary" @click="openDialog()">
        <el-icon><Plus /></el-icon>新增宠物
      </el-button>
    </div>

    <el-table :data="filteredPets" stripe border class="animate-fade-in-up stagger-1" style="width: 100%">
      <el-table-column label="照片" width="72" align="center">
        <template #default="{ row }">
          <el-avatar :size="44" :src="row.image" shape="square" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="90" />
      <el-table-column prop="species" label="物种" width="70" align="center" />
      <el-table-column prop="breed" label="品种" min-width="120" show-overflow-tooltip />
      <el-table-column prop="description" label="简介" min-width="160" show-overflow-tooltip>
        <template #default="{ row }">
          <span class="desc-text">{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="age" label="年龄" width="70" align="center">
        <template #default="{ row }">{{ row.age }}岁</template>
      </el-table-column>
      <el-table-column prop="gender" label="性别" width="60" align="center">
        <template #default="{ row }">{{ row.gender === 'male' ? '公' : '母' }}</template>
      </el-table-column>
      <el-table-column label="状态" width="90" align="center">
        <template #default="{ row }">
          <el-tag :type="statusType(row.status)" size="small">{{ statusLabel(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="疫苗" width="64" align="center">
        <template #default="{ row }">
          <el-icon v-if="row.vaccinated" color="var(--color-success)"><CircleCheckFilled /></el-icon>
          <el-icon v-else color="var(--color-neutral-400)"><CircleCloseFilled /></el-icon>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140" fixed="right" align="center">
        <template #default="{ row }">
          <el-button text type="primary" size="small" @click="openDialog(row)">编辑</el-button>
          <el-popconfirm title="确定要删除此宠物吗？" confirm-button-text="确定" cancel-button-text="取消" @confirm="handleDelete(row.id)">
            <template #reference>
              <el-button text type="danger" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="editingPet ? '编辑宠物' : '新增宠物'" width="560px" destroy-on-close>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <div style="display: flex; gap: 16px;">
          <el-form-item label="物种" prop="species" style="flex: 1;">
            <el-select v-model="form.species" placeholder="选择物种">
              <el-option label="猫" value="猫" />
              <el-option label="狗" value="狗" />
              <el-option label="兔子" value="兔子" />
            </el-select>
          </el-form-item>
          <el-form-item label="品种" prop="breed" style="flex: 1;">
            <el-input v-model="form.breed" />
          </el-form-item>
        </div>
        <div style="display: flex; gap: 16px;">
          <el-form-item label="年龄" prop="age" style="flex: 1;">
            <el-input-number v-model="form.age" :min="0" :max="30" />
          </el-form-item>
          <el-form-item label="性别" prop="gender" style="flex: 1;">
            <el-radio-group v-model="form.gender">
              <el-radio value="male">公</el-radio>
              <el-radio value="female">母</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <el-form-item label="体重(kg)" prop="weight">
          <el-input-number v-model="form.weight" :min="0" :precision="1" :step="0.5" />
        </el-form-item>
        <el-form-item label="图片URL" prop="image">
          <el-input v-model="form.image" placeholder="输入宠物照片 URL" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" />
        </el-form-item>
        <div style="display: flex; gap: 16px;">
          <el-form-item label="已疫苗">
            <el-switch v-model="form.vaccinated" />
          </el-form-item>
          <el-form-item label="已绝育">
            <el-switch v-model="form.sterilized" />
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { usePetService } from '@/composables/usePetService'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import type { Pet } from '@/mock/data'

const { petStore, addPet, updatePet, deletePet } = usePetService()
const keyword = ref('')
const dialogVisible = ref(false)
const editingPet = ref<Pet | null>(null)
const formRef = ref<FormInstance>()

const filteredPets = computed(() =>
  keyword.value
    ? petStore.pets.filter(p => p.name.includes(keyword.value) || p.breed.includes(keyword.value))
    : petStore.pets
)

const form = reactive({
  name: '', species: '', breed: '', age: 1, gender: 'male' as 'male' | 'female',
  weight: 3, image: '', description: '', healthStatus: '健康',
  vaccinated: false, sterilized: false, status: 'available' as Pet['status'],
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  species: [{ required: true, message: '请选择物种', trigger: 'change' }],
  breed: [{ required: true, message: '请输入品种', trigger: 'blur' }],
}

function statusLabel(s: string) {
  return { available: '可领养', adopted: '已领养', pending: '审核中' }[s] || s
}
function statusType(s: string) {
  return ({ available: 'success', adopted: 'info', pending: 'warning' }[s] || '') as '' | 'success' | 'info' | 'warning'
}

function openDialog(pet?: Pet) {
  editingPet.value = pet || null
  if (pet) {
    Object.assign(form, pet)
  } else {
    Object.assign(form, {
      name: '', species: '', breed: '', age: 1, gender: 'male',
      weight: 3, image: '', description: '', healthStatus: '健康',
      vaccinated: false, sterilized: false, status: 'available',
    })
  }
  dialogVisible.value = true
}

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  if (editingPet.value) {
    updatePet(editingPet.value.id, { ...form })
    ElMessage.success('宠物信息已更新')
  } else {
    addPet({ ...form })
    ElMessage.success('宠物已添加')
  }
  dialogVisible.value = false
}

function handleDelete(id: number) {
  deletePet(id)
  ElMessage.success('宠物已删除')
}
</script>

<style scoped lang="scss">
.manage-page {
  .page-toolbar {
    display: flex;
    justify-content: space-between;
    gap: var(--space-4);
    margin-bottom: var(--space-6);
  }
  .toolbar-search { width: 280px; }
  .desc-text {
    font-size: var(--text-xs);
    color: var(--color-neutral-500);
  }
}
</style>
