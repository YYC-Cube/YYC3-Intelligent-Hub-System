/**
 * YanYuCloudCube集成中心 - 数据库Schema初始化脚本
 * 独立执行，用于创建所有必要的数据库表和示例数据
 */

import pg from 'pg';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const { Pool } = pg;

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '5434', 10),
  database: process.env.DB_NAME || 'yyc3_integration_center',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
};

const pool = new Pool(dbConfig);

async function query(sql: string, params?: any[]) {
  return pool.query(sql, params);
}

async function initializeDatabase() {
  console.log('🚀 开始初始化数据库Schema...\n');

  try {
    const client = await pool.connect();
    
    try {
      // 1. 集成应用表
      console.log('📦 创建集成应用表 (integrations)...');
      await client.query(`
        CREATE TABLE IF NOT EXISTS integrations (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          description TEXT,
          category VARCHAR(100) NOT NULL,
          icon_url VARCHAR(500),
          version VARCHAR(50) DEFAULT '1.0.0',
          status VARCHAR(20) DEFAULT 'active',
          is_featured BOOLEAN DEFAULT false,
          install_count INTEGER DEFAULT 0,
          rating DECIMAL(3,2) DEFAULT 0.00,
          config_json JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('   ✅ integrations 表创建成功');

      // 2. 用户表
      console.log('👤 创建用户表 (users)...');
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          username VARCHAR(100) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          display_name VARCHAR(100),
          avatar_url VARCHAR(500),
          role VARCHAR(20) DEFAULT 'user',
          is_active BOOLEAN DEFAULT true,
          last_login_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('   ✅ users 表创建成功');

      // 3. 用户收藏表
      console.log('❤️  创建用户收藏表 (user_favorites)...');
      await client.query(`
        CREATE TABLE IF NOT EXISTS user_favorites (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          integration_id INTEGER REFERENCES integrations(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, integration_id)
        )
      `);
      console.log('   ✅ user_favorites 表创建成功');

      // 4. AI对话历史表
      console.log('💬 创建AI对话表 (ai_conversations)...');
      await client.query(`
        CREATE TABLE IF NOT EXISTS ai_conversations (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
          title VARCHAR(255),
          model VARCHAR(50) DEFAULT 'gpt-4o',
          status VARCHAR(20) DEFAULT 'active',
          metadata JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('   ✅ ai_conversations 表创建成功');

      // 5. AI消息表
      console.log('📨 创建AI消息表 (ai_messages)...');
      await client.query(`
        CREATE TABLE IF NOT EXISTS ai_messages (
          id SERIAL PRIMARY KEY,
          conversation_id INTEGER REFERENCES ai_conversations(id) ON DELETE CASCADE,
          role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
          content TEXT NOT NULL,
          token_count INTEGER,
          metadata JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('   ✅ ai_messages 表创建成功');

      // 6. API密钥管理表
      console.log('🔑 创建API密钥表 (api_keys)...');
      await client.query(`
        CREATE TABLE IF NOT EXISTS api_keys (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          key_name VARCHAR(100) NOT NULL,
          key_hash VARCHAR(255) UNIQUE NOT NULL,
          key_prefix VARCHAR(10),
          permissions JSONB DEFAULT '[]'::jsonb,
          is_active BOOLEAN DEFAULT true,
          last_used_at TIMESTAMP WITH TIME ZONE,
          expires_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('   ✅ api_keys 表创建成功');

      // 7. 安装记录表
      console.log('📥 创建安装记录表 (installations)...');
      await client.query(`
        CREATE TABLE IF NOT EXISTS installations (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          integration_id INTEGER REFERENCES integrations(id) ON DELETE CASCADE,
          config JSONB,
          status VARCHAR(20) DEFAULT 'installed',
          installed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          last_used_at TIMESTAMP WITH TIME ZONE,
          UNIQUE(user_id, integration_id)
        )
      `);
      console.log('   ✅ installations 表创建成功');

      // 8. 系统日志表
      console.log('📋 创建系统日志表 (system_logs)...');
      await client.query(`
        CREATE TABLE IF NOT EXISTS system_logs (
          id SERIAL PRIMARY KEY,
          level VARCHAR(20) NOT NULL,
          module VARCHAR(100),
          message TEXT NOT NULL,
          user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
          metadata JSONB,
          ip_address INET,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('   ✅ system_logs 表创建成功');

      // 9. 创建索引
      console.log('\n🔍 创建索引...');
      const indexes = [
        'CREATE INDEX IF NOT EXISTS idx_integrations_category ON integrations(category)',
        'CREATE INDEX IF NOT EXISTS idx_integrations_status ON integrations(status)',
        'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
        'CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation_id ON ai_messages(conversation_id)',
        'CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON ai_conversations(user_id)',
        'CREATE INDEX IF NOT EXISTS idx_system_logs_level ON system_logs(level)',
        'CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON system_logs(created_at)',
      ];

      for (const indexSql of indexes) {
        await client.query(indexSql);
      }
      console.log('   ✅ 所有索引创建成功');

      // 10. 插入示例数据
      console.log('\n🌱 插入示例数据...');
      
      const sampleIntegrations = [
        ['OpenAI GPT-4 Assistant', 'openai-gpt4-assistant', '基于GPT-4的智能助手服务，支持多轮对话和上下文理解', 'AI & Machine Learning', '/icons/openai.svg', '1.0.0', 'active', true, 0, 4.8],
        ['数据同步引擎', 'data-sync-engine', '高性能跨平台数据同步工具，支持实时和定时同步模式', 'Data Integration', '/icons/sync.svg', '2.1.0', 'active', true, 0, 4.6],
        ['加密存储服务', 'encryption-service', '企业级端到端加密解决方案，保护敏感数据安全', 'Security', '/icons/security.svg', '1.2.0', 'active', false, 0, 4.9],
      ];

      for (const [name, slug, description, category, icon_url, version, status, is_featured, install_count, rating] of sampleIntegrations) {
        await client.query(
          `INSERT INTO integrations (name, slug, description, category, icon_url, version, status, is_featured, install_count, rating)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           ON CONFLICT (slug) DO NOTHING`,
          [name, slug, description, category, icon_url, version, status, is_featured, install_count, rating]
        );
      }
      console.log(`   ✅ 已插入 ${sampleIntegrations.length} 条示例集成应用数据`);

      console.log('\n🎉 数据库初始化完成！');
      
      // 显示统计信息
      console.log('\n📊 数据库状态:');
      const tables = ['integrations', 'users', 'user_favorites', 'ai_conversations', 
                      'ai_messages', 'api_keys', 'installations', 'system_logs'];
      
      for (const table of tables) {
        const result = await client.query(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`   ${table}: ${result.rows[0].count} 条记录`);
      }

    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

initializeDatabase()
  .then(() => {
    console.log('\n✨ 初始化流程结束');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 初始化失败:', error.message);
    process.exit(1);
  });
