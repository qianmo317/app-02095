export interface Pet {
  id: number
  name: string
  species: string
  breed: string
  age: number
  gender: 'male' | 'female'
  weight: number
  description: string
  image: string
  status: 'available' | 'adopted' | 'pending'
  healthStatus: string
  vaccinated: boolean
  sterilized: boolean
  createdAt: string
}

export interface User {
  id: number
  username: string
  password: string
  nickname: string
  avatar: string
  role: 'admin' | 'user'
  phone: string
  email: string
  status: 'active' | 'disabled'
  createdAt: string
}

export interface Adoption {
  id: number
  userId: number
  petId: number
  status: 'pending' | 'approved' | 'rejected'
  reason: string
  phone: string
  address: string
  experience: string
  createdAt: string
  updatedAt: string
}

export interface OperationLog {
  id: number
  userId: number
  username: string
  action: string
  target: string
  detail: string
  createdAt: string
}

export const mockPets: Pet[] = [
  {
    id: 1, name: '橘子', species: '猫', breed: '中华田园猫', age: 2, gender: 'male',
    weight: 4.5, description: '性格温顺，喜欢被抚摸，已完成所有疫苗接种。和其他猫咪相处融洽，适合有经验的家庭。',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=400&fit=crop',
    status: 'available', healthStatus: '健康', vaccinated: true, sterilized: true, createdAt: '2025-12-15',
  },
  {
    id: 2, name: '小白', species: '猫', breed: '英国短毛猫', age: 1, gender: 'female',
    weight: 3.2, description: '活泼好动，对人非常亲近。喜欢玩逗猫棒，是一只充满活力的小可爱。',
    image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&h=400&fit=crop',
    status: 'available', healthStatus: '健康', vaccinated: true, sterilized: false, createdAt: '2026-01-03',
  },
  {
    id: 3, name: '大黄', species: '狗', breed: '金毛寻回犬', age: 3, gender: 'male',
    weight: 28, description: '忠诚友善，非常喜欢户外活动和游泳。对小朋友特别有耐心，是理想的家庭伴侣犬。',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop',
    status: 'available', healthStatus: '健康', vaccinated: true, sterilized: true, createdAt: '2025-11-20',
  },
  {
    id: 4, name: '豆豆', species: '狗', breed: '柯基犬', age: 2, gender: 'female',
    weight: 12, description: '短腿小可爱，性格开朗。喜欢在院子里奔跑，擅长各种表情包动作。',
    image: 'https://images.unsplash.com/photo-1612536057832-2ff7ead58194?w=600&h=400&fit=crop',
    status: 'pending', healthStatus: '健康', vaccinated: true, sterilized: true, createdAt: '2026-01-10',
  },
  {
    id: 5, name: '雪球', species: '兔子', breed: '荷兰垂耳兔', age: 1, gender: 'female',
    weight: 1.8, description: '毛茸茸的小天使，性格安静温和。喜欢被轻轻抚摸耳朵，适合安静的家庭环境。',
    image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&h=400&fit=crop',
    status: 'available', healthStatus: '健康', vaccinated: true, sterilized: false, createdAt: '2026-01-18',
  },
  {
    id: 6, name: '阿福', species: '狗', breed: '拉布拉多', age: 4, gender: 'male',
    weight: 30, description: '训练有素的导盲犬退役，性格沉稳可靠。非常听话且温柔，适合各类家庭。',
    image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600&h=400&fit=crop',
    status: 'adopted', healthStatus: '健康', vaccinated: true, sterilized: true, createdAt: '2025-10-05',
  },
  {
    id: 7, name: '咪咪', species: '猫', breed: '布偶猫', age: 1, gender: 'female',
    weight: 3.8, description: '蓝眼睛的美丽猫咪，性格温柔粘人。喜欢趴在主人腿上睡觉，需要定期梳毛。',
    image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=600&h=400&fit=crop',
    status: 'available', healthStatus: '健康', vaccinated: true, sterilized: false, createdAt: '2026-02-01',
  },
  {
    id: 8, name: '旺财', species: '猫', breed: '橘猫', age: 3, gender: 'male',
    weight: 5.5, description: '圆滚滚的橘猫，食欲旺盛。性格独立但也喜欢和人互动，是一只有趣的猫。',
    image: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=600&h=400&fit=crop',
    status: 'available', healthStatus: '轻微超重', vaccinated: true, sterilized: true, createdAt: '2025-12-28',
  },
]

export const mockUsers: User[] = [
  {
    id: 1, username: 'admin', password: 'admin123', nickname: '管理员',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    role: 'admin', phone: '13800138000', email: 'admin@pethome.com', status: 'active', createdAt: '2025-06-01',
  },
  {
    id: 2, username: 'user', password: 'user123', nickname: '张三',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    role: 'user', phone: '13900139000', email: 'zhangsan@email.com', status: 'active', createdAt: '2025-08-15',
  },
  {
    id: 3, username: 'lisi', password: 'lisi123', nickname: '李四',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    role: 'user', phone: '13700137000', email: 'lisi@email.com', status: 'active', createdAt: '2025-09-20',
  },
  {
    id: 4, username: 'wangwu', password: 'wangwu123', nickname: '王五',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    role: 'user', phone: '13600136000', email: 'wangwu@email.com', status: 'disabled', createdAt: '2025-10-10',
  },
]

export const mockAdoptions: Adoption[] = [
  { id: 1, userId: 2, petId: 3, status: 'pending', reason: '我非常喜欢金毛犬，家里有大院子适合它奔跑。',
    phone: '13900139000', address: '北京市朝阳区幸福小区', experience: '养过一只泰迪3年',
    createdAt: '2026-02-10', updatedAt: '2026-02-10' },
  { id: 2, userId: 3, petId: 1, status: 'pending', reason: '想养一只橘猫作伴，工作之余需要一个毛茸茸的朋友。',
    phone: '13700137000', address: '上海市浦东新区阳光花园', experience: '第一次养宠物',
    createdAt: '2026-02-08', updatedAt: '2026-02-08' },
  { id: 3, userId: 2, petId: 6, status: 'approved', reason: '家里有老人需要陪伴，拉布拉多很适合。',
    phone: '13900139000', address: '北京市朝阳区幸福小区', experience: '养过一只泰迪3年',
    createdAt: '2026-01-15', updatedAt: '2026-01-20' },
  { id: 4, userId: 3, petId: 5, status: 'rejected', reason: '想给孩子一只兔子作为生日礼物。',
    phone: '13700137000', address: '上海市浦东新区阳光花园', experience: '没有养宠物经验',
    createdAt: '2026-01-22', updatedAt: '2026-01-25' },
  { id: 5, userId: 4, petId: 4, status: 'pending', reason: '柯基太可爱了，一直想养一只。',
    phone: '13600136000', address: '广州市天河区星光大道', experience: '养过猫2年',
    createdAt: '2026-02-12', updatedAt: '2026-02-12' },
  { id: 6, userId: 2, petId: 7, status: 'pending', reason: '布偶猫是我最喜欢的品种。',
    phone: '13900139000', address: '北京市朝阳区幸福小区', experience: '养过一只泰迪3年',
    createdAt: '2026-02-15', updatedAt: '2026-02-15' },
]

export const mockLogs: OperationLog[] = [
  { id: 1, userId: 1, username: '管理员', action: '新增', target: '宠物', detail: '新增宠物：橘子', createdAt: '2025-12-15 09:30:00' },
  { id: 2, userId: 1, username: '管理员', action: '新增', target: '宠物', detail: '新增宠物：小白', createdAt: '2026-01-03 14:20:00' },
  { id: 3, userId: 1, username: '管理员', action: '审批', target: '领养申请', detail: '通过用户张三的领养申请（阿福）', createdAt: '2026-01-20 10:15:00' },
  { id: 4, userId: 1, username: '管理员', action: '审批', target: '领养申请', detail: '拒绝用户李四的领养申请（雪球）', createdAt: '2026-01-25 16:45:00' },
  { id: 5, userId: 2, username: '张三', action: '提交', target: '领养申请', detail: '提交领养申请：大黄', createdAt: '2026-02-10 08:00:00' },
  { id: 6, userId: 1, username: '管理员', action: '编辑', target: '宠物', detail: '更新宠物信息：旺财（状态→轻微超重）', createdAt: '2026-02-05 11:30:00' },
  { id: 7, userId: 3, username: '李四', action: '提交', target: '领养申请', detail: '提交领养申请：橘子', createdAt: '2026-02-08 13:00:00' },
  { id: 8, userId: 1, username: '管理员', action: '禁用', target: '用户', detail: '禁用用户：王五', createdAt: '2026-02-11 09:00:00' },
]
