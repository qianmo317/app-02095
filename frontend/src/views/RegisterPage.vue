<template>
  <div class="register-page bg-pattern">
    <div class="register-container animate-scale-in">
      <div class="register-left">
        <div class="register-image-bg">
          <div class="cat-illustration">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- 猫身体 -->
              <ellipse cx="100" cy="135" rx="50" ry="42" fill="rgba(255,255,255,0.25)"/>
              <!-- 头 -->
              <circle cx="100" cy="82" r="36" fill="rgba(255,255,255,0.3)"/>
              <!-- 耳朵左 -->
              <polygon points="66,56 58,30 82,50" fill="rgba(255,255,255,0.25)"/>
              <!-- 耳朵右 -->
              <polygon points="134,56 142,30 118,50" fill="rgba(255,255,255,0.25)"/>
              <!-- 内耳左 -->
              <polygon points="67,54 61,36 79,50" fill="rgba(255,255,255,0.15)"/>
              <!-- 内耳右 -->
              <polygon points="133,54 139,36 121,50" fill="rgba(255,255,255,0.15)"/>
              <!-- 眼睛 -->
              <ellipse cx="87" cy="77" rx="8" ry="9" fill="rgba(255,255,255,0.9)"/>
              <ellipse cx="113" cy="77" rx="8" ry="9" fill="rgba(255,255,255,0.9)"/>
              <ellipse cx="87" cy="78" rx="4" ry="7" fill="#1a7e4f"/>
              <ellipse cx="113" cy="78" rx="4" ry="7" fill="#1a7e4f"/>
              <circle cx="88" cy="75" r="1.5" fill="white"/>
              <circle cx="114" cy="75" r="1.5" fill="white"/>
              <!-- 鼻子 -->
              <path d="M97 90 L100 87 L103 90 Z" fill="rgba(255,255,255,0.8)"/>
              <!-- 胡须 -->
              <line x1="70" y1="92" x2="92" y2="92" stroke="rgba(255,255,255,0.6)" stroke-width="1.5"/>
              <line x1="70" y1="96" x2="92" y2="94" stroke="rgba(255,255,255,0.6)" stroke-width="1.5"/>
              <line x1="108" y1="92" x2="130" y2="92" stroke="rgba(255,255,255,0.6)" stroke-width="1.5"/>
              <line x1="108" y1="94" x2="130" y2="96" stroke="rgba(255,255,255,0.6)" stroke-width="1.5"/>
              <!-- 嘴巴 -->
              <path d="M95 93 Q100 98 105 93" stroke="rgba(255,255,255,0.7)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
              <!-- 尾巴 -->
              <path d="M148 140 Q175 120 168 90 Q162 70 172 60" stroke="rgba(255,255,255,0.3)" stroke-width="10" fill="none" stroke-linecap="round"/>
              <!-- 爪子 -->
              <ellipse cx="75" cy="168" rx="14" ry="9" fill="rgba(255,255,255,0.2)"/>
              <ellipse cx="125" cy="168" rx="14" ry="9" fill="rgba(255,255,255,0.2)"/>
            </svg>
          </div>
          <div class="deco-circle r1"></div>
          <div class="deco-circle r2"></div>
          <div class="deco-star s1">★</div>
          <div class="deco-star s2">★</div>
          <div class="deco-star s3">✦</div>
        </div>
        <div class="register-overlay">
          <h2>开始你的领养旅程</h2>
          <p>注册账号，寻找你的毛茸茸伙伴</p>
        </div>
      </div>
      <div class="register-right">
        <div class="register-form-wrapper">
          <div class="register-header">
            <el-icon :size="36" color="var(--color-primary)"><HomeFilled /></el-icon>
            <h1>注册账号</h1>
            <p>加入 PetHome 宠物领养平台</p>
          </div>
          <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent="handleRegister">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" prefix-icon="User" size="large" />
            </el-form-item>
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="form.nickname" prefix-icon="Postcard" size="large" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="form.password" type="password" prefix-icon="Lock" size="large" show-password />
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input v-model="form.confirmPassword" type="password" prefix-icon="Lock" size="large" show-password />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="large" native-type="button" :loading="loading" class="register-btn" @click="handleRegister">
                注册
              </el-button>
            </el-form-item>
          </el-form>
          <div class="register-footer">
            <span>已有账号？</span>
            <router-link to="/login">立即登录</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref<FormInstance>()
const loading = ref(false)

const form = reactive({ username: '', nickname: '', password: '', confirmPassword: '' })

const validateConfirm = (_rule: unknown, value: string, callback: (err?: Error) => void) => {
  if (value !== form.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度 3-20 个字符', trigger: 'blur' },
  ],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少 6 个字符', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirm, trigger: 'blur' },
  ],
}

async function handleRegister() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  const exists = userStore.users.some(u => u.username === form.username)
  if (exists) {
    ElMessage.error('该用户名已被注册')
    return
  }
  loading.value = true
  await new Promise(r => setTimeout(r, 600))
  userStore.users.push({
    id: Math.max(...userStore.users.map(u => u.id)) + 1,
    username: form.username,
    password: form.password,
    nickname: form.nickname,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    role: 'user',
    phone: '',
    email: '',
    status: 'active',
    createdAt: new Date().toISOString().split('T')[0],
  })
  loading.value = false
  ElMessage.success('注册成功，请登录')
  router.push('/login')
}
</script>

<style scoped lang="scss">
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
}

.register-container {
  display: flex;
  width: 900px;
  max-width: 100%;
  background: var(--color-bg-card);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-xl);
}

.register-left {
  position: relative;
  width: 360px;
  flex-shrink: 0;
  @media (max-width: 768px) { display: none; }
}

.register-image-bg {
  width: 100%;
  height: 100%;
  min-height: 500px;
  background: linear-gradient(145deg, #059669 0%, #0284c7 50%, #7c3aed 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cat-illustration {
  width: 210px;
  height: 210px;
  filter: drop-shadow(0 8px 24px rgba(0,0,0,0.15));
  animation: float-cat 3.5s ease-in-out infinite;
}

@keyframes float-cat {
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
}

.deco-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  &.r1 { width: 160px; height: 160px; top: -30px; left: -30px; }
  &.r2 { width: 100px; height: 100px; bottom: 50px; right: -20px; }
}

.deco-star {
  position: absolute;
  color: rgba(255, 255, 255, 0.35);
  animation: twinkle 2.5s ease-in-out infinite;
  &.s1 { font-size: 22px; top: 20%; right: 20%; animation-delay: 0s; }
  &.s2 { font-size: 16px; bottom: 30%; left: 18%; animation-delay: 0.8s; }
  &.s3 { font-size: 28px; top: 55%; right: 14%; animation-delay: 1.4s; }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.35; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.3); }
}

.register-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--space-8);
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: #fff;
  h2 { font-family: var(--font-heading); font-size: var(--text-2xl); margin-bottom: var(--space-2); color: #fff; }
  p { opacity: 0.8; font-size: var(--text-sm); }
}

.register-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8) var(--space-12);
}

.register-form-wrapper {
  width: 100%;
  max-width: 360px;
}

.register-header {
  text-align: center;
  margin-bottom: var(--space-6);
  h1 { font-family: var(--font-heading); font-size: var(--text-2xl); margin: var(--space-2) 0; }
  p { color: var(--color-neutral-500); font-size: var(--text-sm); }
}

.register-btn {
  width: 100%;
  height: 44px;
  font-size: var(--text-base);
  border-radius: var(--radius-md);
}

.register-footer {
  text-align: center;
  margin-top: var(--space-4);
  font-size: var(--text-sm);
  color: var(--color-neutral-500);
  a { margin-left: var(--space-1); }
}
</style>
