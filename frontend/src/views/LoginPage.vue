<template>
  <div class="login-page bg-pattern">
    <div class="login-container animate-scale-in">
      <div class="login-left">
        <div class="login-image-bg">
          <div class="pet-illustration">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- 狗狗身体 -->
              <ellipse cx="100" cy="130" rx="55" ry="45" fill="rgba(255,255,255,0.25)"/>
              <!-- 头 -->
              <circle cx="100" cy="78" r="38" fill="rgba(255,255,255,0.3)"/>
              <!-- 耳朵左 -->
              <ellipse cx="70" cy="52" rx="16" ry="22" fill="rgba(255,255,255,0.2)" transform="rotate(-15 70 52)"/>
              <!-- 耳朵右 -->
              <ellipse cx="130" cy="52" rx="16" ry="22" fill="rgba(255,255,255,0.2)" transform="rotate(15 130 52)"/>
              <!-- 眼睛 -->
              <circle cx="88" cy="74" r="7" fill="rgba(255,255,255,0.9)"/>
              <circle cx="112" cy="74" r="7" fill="rgba(255,255,255,0.9)"/>
              <circle cx="90" cy="75" r="4" fill="#7c3aed"/>
              <circle cx="114" cy="75" r="4" fill="#7c3aed"/>
              <circle cx="91" cy="73" r="1.5" fill="white"/>
              <circle cx="115" cy="73" r="1.5" fill="white"/>
              <!-- 鼻子 -->
              <ellipse cx="100" cy="88" rx="7" ry="5" fill="rgba(255,255,255,0.8)"/>
              <!-- 嘴巴 -->
              <path d="M95 93 Q100 99 105 93" stroke="rgba(255,255,255,0.8)" stroke-width="2" fill="none" stroke-linecap="round"/>
              <!-- 尾巴 -->
              <path d="M150 130 Q175 100 165 80" stroke="rgba(255,255,255,0.3)" stroke-width="12" fill="none" stroke-linecap="round"/>
              <!-- 爪子 -->
              <ellipse cx="72" cy="165" rx="16" ry="10" fill="rgba(255,255,255,0.2)"/>
              <ellipse cx="128" cy="165" rx="16" ry="10" fill="rgba(255,255,255,0.2)"/>
            </svg>
          </div>
          <!-- 装饰圆点 -->
          <div class="deco-circle c1"></div>
          <div class="deco-circle c2"></div>
          <div class="deco-circle c3"></div>
          <!-- 爱心 -->
          <div class="deco-heart h1">♥</div>
          <div class="deco-heart h2">♥</div>
        </div>
        <div class="login-overlay">
          <h2>让每一个生命都有家</h2>
          <p>加入 PetHome，给流浪动物一个温暖的归宿</p>
        </div>
      </div>
      <div class="login-right">
        <div class="login-form-wrapper">
          <div class="login-header">
            <el-icon :size="36" color="var(--color-primary)"><HomeFilled /></el-icon>
            <h1>PetHome</h1>
            <p>宠物领养平台</p>
          </div>
          <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent="handleLogin">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" prefix-icon="User" size="large" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="form.password" type="password" prefix-icon="Lock" size="large" show-password />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="large" native-type="button" :loading="loading" class="login-btn" @click="handleLogin">
                登录
              </el-button>
            </el-form-item>
          </el-form>
          <div class="login-footer">
            <span>没有账号？<router-link to="/register">立即注册</router-link></span>
            <router-link to="/" class="back-link">返回首页</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const formRef = ref<FormInstance>()
const loading = ref(false)

const form = reactive({ username: '', password: '' })
const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

async function handleLogin() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  loading.value = true
  await new Promise(r => setTimeout(r, 500))
  const result = userStore.login(form.username, form.password)
  loading.value = false
  if (result.success) {
    ElMessage.success(result.message)
    const redirect = (route.query.redirect as string) || (userStore.isAdmin ? '/admin' : '/')
    router.push(redirect)
  } else {
    ElMessage.error(result.message)
  }
}
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
}

.login-container {
  display: flex;
  width: 900px;
  max-width: 100%;
  background: var(--color-bg-card);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-xl);
}

.login-left {
  position: relative;
  width: 400px;
  min-height: 540px;
  flex-shrink: 0;
  @media (max-width: 768px) { display: none; }
}

.login-image-bg {
  width: 100%;
  height: 100%;
  min-height: 540px;
  background: linear-gradient(145deg, var(--color-primary) 0%, #7c3aed 50%, #db2777 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pet-illustration {
  width: 220px;
  height: 220px;
  filter: drop-shadow(0 8px 24px rgba(0,0,0,0.15));
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

.deco-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  &.c1 { width: 180px; height: 180px; top: -40px; right: -40px; }
  &.c2 { width: 120px; height: 120px; bottom: 60px; left: -30px; }
  &.c3 { width: 60px; height: 60px; top: 40%; right: 20px; background: rgba(255,255,255,0.12); }
}

.deco-heart {
  position: absolute;
  color: rgba(255, 255, 255, 0.3);
  font-size: 24px;
  animation: pulse 2s ease-in-out infinite;
  &.h1 { top: 25%; left: 18%; font-size: 20px; animation-delay: 0.5s; }
  &.h2 { bottom: 28%; right: 16%; font-size: 28px; animation-delay: 1s; }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.2); opacity: 0.6; }
}

.login-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--space-8);
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: #fff;
  h2 {
    font-family: var(--font-heading);
    font-size: var(--text-2xl);
    margin-bottom: var(--space-2);
    color: #fff;
  }
  p { opacity: 0.8; font-size: var(--text-sm); }
}

.login-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-12);
}

.login-form-wrapper {
  width: 100%;
  max-width: 360px;
}

.login-header {
  text-align: center;
  margin-bottom: var(--space-8);
  h1 {
    font-family: var(--font-heading);
    font-size: var(--text-3xl);
    margin: var(--space-2) 0;
  }
  p {
    color: var(--color-neutral-500);
    font-size: var(--text-sm);
  }
}

.login-btn {
  width: 100%;
  height: 44px;
  font-size: var(--text-base);
  border-radius: var(--radius-md);
}

.login-footer {
  text-align: center;
  margin-top: var(--space-6);
  font-size: var(--text-sm);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  color: var(--color-neutral-500);
  .back-link { font-size: var(--text-xs); color: var(--color-neutral-400); }
}
</style>
