# PetHome - 宠物领养平台

基于 Vue 3 + Element Plus 构建的宠物领养平台前端应用，包含用户浏览端和管理后台双端架构。

## 1. How to Run

### 使用 Docker（推荐）

```bash
docker-compose up --build -d
```

访问 http://localhost:8081

### 本地开发

```bash
cd frontend
npm install
npm run dev
```

访问 http://localhost:8081

## 2. Services

| 服务 | 地址 | 说明 |
|------|------|------|
| 前端应用 | http://localhost:8081 | 用户端 + 管理后台 |

## 3. 测试账号

| 角色 | 用户名 | 密码 | 说明 |
|------|--------|------|------|
| 管理员 | admin | admin123 | 拥有所有权限，可访问管理后台 |
| 普通用户 | user | user123 | 基本功能权限，可浏览宠物、提交领养申请 |

## 4. 题目内容

用vue框架写一个宠物领养平台的前端框架

## 5. 项目结构

```
label-02095/
├── frontend/                 # 前端项目
│   ├── src/
│   │   ├── components/       # 可复用组件
│   │   │   ├── ui/           # 基础 UI 组件
│   │   │   └── business/     # 业务组件
│   │   ├── composables/      # 组合式函数
│   │   ├── layouts/          # 布局组件
│   │   ├── mock/             # Mock 数据
│   │   ├── router/           # 路由配置
│   │   ├── stores/           # Pinia 状态管理
│   │   ├── styles/           # 全局样式 + Design Tokens
│   │   ├── views/            # 页面视图
│   │   │   ├── user/         # 用户端页面
│   │   │   └── admin/        # 管理后台页面
│   │   ├── App.vue
│   │   └── main.ts
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.ts
├── docs/                     # 设计文档
│   └── project_design.md
├── docker-compose.yml
└── README.md
```

## 6. 功能清单

**用户端**
- [x] 首页展示：平台介绍、精选宠物、领养流程、统计数据
- [x] 宠物列表：卡片展示、物种/性别筛选、关键词搜索
- [x] 宠物详情：信息展示、健康状况、领养申请
- [x] 用户登录：表单验证、模拟认证

**管理后台**
- [x] 仪表盘：宠物统计、物种分布、最近申请
- [x] 宠物管理：新增/编辑/删除宠物信息
- [x] 领养管理：审批领养申请（通过/拒绝）
- [x] 用户管理：用户列表、启用/禁用
- [x] 操作日志：所有操作记录查看

## 7. 开发与数据说明

本项目当前使用本地 Mock 数据用于演示与开发：
- **数据来源**：`frontend/src/mock/data.ts`
- **用途**：开发调试、演示展示
- **生产环境**：接入真实后端 API 后替换即可
- **数据内容**：8 只宠物、4 个用户、6 条领养申请、8 条操作日志

## 编码说明

本项目所有文件使用 UTF-8 编码，确保中文正常显示：
- 源代码：UTF-8 without BOM
- HTML：`<meta charset="UTF-8">`
- 配置文件：UTF-8
