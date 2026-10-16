// API Mock服务
// 用于模拟后端API响应，支持前端开发独立进行

import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import { Integration } from '../app/data/integrations';
import { Zap, MessageSquareText, Mic } from 'lucide-react';

const app = express();
const PORT = 4000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 用户类型定义
interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

// 导入实际的集成数据
import { integrations } from '../app/data/integrations';

// 模拟数据
const users: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123', // 实际应用中应该是加密的密码
    role: 'admin',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    username: 'user1',
    email: 'user1@example.com',
    password: 'user123',
    role: 'user',
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
  },
];

// Mock数据存储
let mockUsers = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    token: 'admin-token-123',
  },
  {
    id: '2',
    username: 'user',
    email: 'user@example.com',
    role: 'user',
    token: 'user-token-456',
  },
];

let mockIntegrations: Integration[] = integrations;

// 模拟收藏数据
const favorites: { userId: string; integrationId: string; createdAt: string }[] = [
  {
    userId: '2',
    integrationId: '1',
    createdAt: '2023-06-15T00:00:00Z'
  },
  {
    userId: '2',
    integrationId: '3',
    createdAt: '2023-06-20T00:00:00Z'
  },
  {
    userId: '2',
    integrationId: '5',
    createdAt: '2023-06-25T00:00:00Z'
  }
];

// Auth路由
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  
  // 简单的验证逻辑（实际项目中应该使用更安全的方法）
  const user = mockUsers.find(u => u.username === username);
  
  if (user) {
    // 在实际应用中，这里应该验证密码
    // 为了演示，我们假设任何密码都能登录
    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: user.token,
      },
      message: '登录成功',
    });
  } else {
    res.status(401).json({
      success: false,
      message: '用户名或密码错误',
    });
  }
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  
  // 检查用户名是否已存在
  if (mockUsers.some(u => u.username === username || u.email === email)) {
    return res.status(400).json({
      success: false,
      message: '用户名或邮箱已被注册',
    });
  }
  
  const newUser = {
    id: uuidv4(),
    username,
    email,
    role: 'user',
    token: `user-${uuidv4().substring(0, 8)}`,
  };
  
  mockUsers.push(newUser);
  
  res.status(201).json({
    success: true,
    data: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      token: newUser.token,
    },
    message: '注册成功',
  });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: '未提供认证信息',
    });
  }
  
  const token = authHeader.replace('Bearer ', '');
  const user = mockUsers.find(u => u.token === token);
  
  if (user) {
    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } else {
    res.status(401).json({
      success: false,
      message: '无效的认证信息',
    });
  }
});

// Integrations路由
app.get('/api/integrations', (req: Request, res: Response) => {
  const { category, search, featured, page = '1', limit = '10' } = req.query;
  
  let filteredIntegrations = [...mockIntegrations];
  
  // 按分类过滤
  if (category && typeof category === 'string') {
    filteredIntegrations = filteredIntegrations.filter(
      integration => integration.category === category
    );
  }
  
  // 按关键词搜索
  if (search && typeof search === 'string') {
    const searchLower = search.toLowerCase();
    filteredIntegrations = filteredIntegrations.filter(
      integration =>
        integration.name.toLowerCase().includes(searchLower) ||
        integration.description.toLowerCase().includes(searchLower) ||
        integration.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }
  
  // 只显示精选项目
  if (featured === 'true') {
    filteredIntegrations = filteredIntegrations.filter(
      integration => integration.featured
    );
  }
  
  // 分页
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  const paginatedIntegrations = filteredIntegrations.slice(startIndex, endIndex);
  
  res.status(200).json({
    success: true,
    data: {
      items: paginatedIntegrations,
      total: filteredIntegrations.length,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(filteredIntegrations.length / limitNum),
    },
  });
});

app.get('/api/integrations/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const integration = mockIntegrations.find(i => i.id === id);
  
  if (integration) {
    res.status(200).json({
      success: true,
      data: integration,
    });
  } else {
    res.status(404).json({
      success: false,
      message: '未找到集成项',
    });
  }
});

app.post('/api/integrations/:id/install', (req: Request, res: Response) => {
  const { id } = req.params;
  const integration = mockIntegrations.find(i => i.id === id);
  
  if (!integration) {
    return res.status(404).json({
      success: false,
      message: '未找到集成项',
    });
  }
  
  // 模拟安装过程
  setTimeout(() => {
    res.status(200).json({
      success: true,
      data: {
        integrationId: id,
        integrationName: integration.name,
        status: 'installed',
        installationDate: new Date().toISOString(),
        configuration: req.body,
      },
      message: `${integration.name} 安装成功`,
    });
  }, 1000);
});

// Favorites路由
app.get('/api/favorites', (req: Request, res: Response) => {
  // 模拟获取收藏的集成
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: '未提供认证信息',
    });
  }
  
  // 为了演示，假设当前用户ID为2
  const userId = '2';
  const userFavorites = favorites.filter(fav => fav.userId === userId);
  const favoriteIntegrations = mockIntegrations
    .filter(integ => userFavorites.some(fav => fav.integrationId === integ.id))
    .map(integ => ({ ...integ, isFavorite: true }));
  
  res.status(200).json({
    success: true,
    data: favoriteIntegrations,
  });
});

app.post('/api/favorites/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const integration = mockIntegrations.find(i => i.id === id);
  
  if (!integration) {
    return res.status(404).json({
      success: false,
      message: '未找到集成项',
    });
  }
  
  // 为了演示，假设当前用户ID为2
  const userId = '2';
  
  // 检查是否已经收藏
  const existingFavorite = favorites.find(
    fav => fav.userId === userId && fav.integrationId === id
  );
  
  if (existingFavorite) {
    return res.status(400).json({
      success: false,
      message: '该集成已在收藏列表中',
    });
  }
  
  // 添加收藏
  const newFavorite = {
    userId,
    integrationId: String(id),
    createdAt: new Date().toISOString(),
  };
  favorites.push(newFavorite);
  
  res.status(200).json({
    success: true,
    data: { ...integration, isFavorite: true },
    message: '添加收藏成功',
  });
});

app.delete('/api/favorites/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const integration = mockIntegrations.find(i => i.id === id);
  
  if (!integration) {
    return res.status(404).json({
      success: false,
      message: '未找到集成项',
    });
  }
  
  // 为了演示，假设当前用户ID为2
  const userId = '2';
  
  // 查找并删除收藏
  const favoriteIndex = favorites.findIndex(
    fav => fav.userId === userId && fav.integrationId === id
  );
  
  if (favoriteIndex === -1) {
    return res.status(400).json({
      success: false,
      message: '该集成不在收藏列表中',
    });
  }
  
  favorites.splice(favoriteIndex, 1);
  
  res.status(200).json({
    success: true,
    data: { id },
    message: '取消收藏成功',
  });
});

// Admin路由
app.get('/api/admin/dashboard', (req: Request, res: Response) => {
  // 模拟管理员仪表盘数据
  res.status(200).json({
    success: true,
    data: {
      totalUsers: 1253,
      activeUsers: 892,
      totalIntegrations: 56,
      activeIntegrations: 48,
      systemStatus: 'healthy',
      recentActivities: [
        { id: '1', type: 'install', user: 'user123', integration: '言语云智能客服', time: '10分钟前' },
        { id: '2', type: 'register', user: 'newuser456', time: '30分钟前' },
        { id: '3', type: 'update', integration: '言语云语音识别', time: '2小时前' },
      ],
    },
  });
});

// 系统健康检查
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'UP',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
    },
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`API Mock服务启动成功，运行在 http://localhost:${PORT}`);
  console.log('可用的API端点：');
  console.log('  认证:');
  console.log('    POST   /api/auth/login       - 用户登录');
  console.log('    POST   /api/auth/register    - 用户注册');
  console.log('    GET    /api/auth/me          - 获取当前用户信息');
  console.log('  集成:');
  console.log('    GET    /api/integrations     - 获取集成列表');
  console.log('    GET    /api/integrations/:id - 获取单个集成详情');
  console.log('    POST   /api/integrations/:id/install - 安装集成');
  console.log('  收藏:');
  console.log('    GET    /api/favorites        - 获取收藏列表');
  console.log('    POST   /api/favorites/:id    - 添加收藏');
  console.log('    DELETE /api/favorites/:id    - 取消收藏');
  console.log('  管理员:');
  console.log('    GET    /api/admin/dashboard  - 管理员仪表盘');
  console.log('  健康检查:');
  console.log('    GET    /api/health           - 系统健康状态');
});