/**
 * YanYuCloudCube集成中心 - PostgreSQL 数据库服务
 * 基于pg连接池的生产级数据库访问层
 */

import pg from 'pg';
import { config } from 'dotenv';
import { resolve } from 'path';

// 加载环境变量（仅在Node.js环境）
if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'test') {
  config({ path: resolve(process.cwd(), '.env.local') });
}

const { Pool } = pg;

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  max?: number;
  min?: number;
  idleTimeoutMillis?: number;
  connectionTimeoutMillis?: number;
  ssl?: boolean | object;
}

interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
  fields: any[];
}

class DatabaseService {
  private pool: pg.Pool | null = null;
  private isConnected: boolean = false;
  private config: DatabaseConfig;

  constructor() {
    this.config = {
      host: process.env.DB_HOST || '127.0.0.1',
      port: parseInt(process.env.DB_PORT || '5434', 10),
      database: process.env.DB_NAME || 'yyc3_integration_center',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      max: parseInt(process.env.DB_POOL_MAX || '20', 10),
      idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10),
      connectionTimeoutMillis: parseInt(process.env.DB_CONNECT_TIMEOUT || '10000', 10),
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    };
  }

  async initialize(): Promise<void> {
    if (this.isConnected && this.pool) {
      console.log('⚠️  数据库已连接，跳过初始化');
      return;
    }

    try {
      console.log('🔗 正在初始化数据库连接池...');
      
      this.pool = new Pool(this.config);
      
      // 监听连接池事件
      this.pool.on('error', (err) => {
        console.error('❌ 数据库连接池发生意外错误:', err.message);
        this.isConnected = false;
      });

      // 测试连接
      const client = await this.pool.connect();
      
      const result = await client.query('SELECT NOW() as current_time, version() as db_version');
      console.log(`✅ 数据库连接成功!`);
      console.log(`   📅 服务器时间: ${result.rows[0].current_time}`);
      console.log(`   🔧 版本信息: ${result.rows[0].db_version.split(',')[0]}`);
      
      client.release();
      this.isConnected = true;
      
    } catch (error: any) {
      console.error('❌ 数据库初始化失败:', error.message);
      this.isConnected = false;
      throw error;
    }
  }

  async query<T = any>(sql: string, params?: any[]): Promise<QueryResult<T>> {
    if (!this.pool || !this.isConnected) {
      await this.initialize();
    }

    try {
      const result = await this.pool!.query(sql, params);
      return result as QueryResult<T>;
    } catch (error: any) {
      console.error(`❌ SQL查询执行失败 [${sql.substring(0, 50)}...]:`, error.message);
      throw handleDbError(error, 'query');
    }
  }

  async getOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
    const result = await this.query<T>(sql, params);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async getAll<T = any>(sql: string, params?: any[]): Promise<T[]> {
    const result = await this.query<T>(sql, params);
    return result.rows;
  }

  async transaction<T>(callback: (client: pg.PoolClient) => Promise<T>): Promise<T> {
    if (!this.pool || !this.isConnected) {
      await this.initialize();
    }

    const client = await this.pool!.connect();
    
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async insert(table: string, data: Record<string, any>): Promise<any> {
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
    
    const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`;
    const result = await this.query(sql, values);
    
    return result.rows[0];
  }

  async update(
    table: string,
    data: Record<string, any>,
    whereClause: string,
    whereParams: any[] = []
  ): Promise<any> {
    const setClause = Object.keys(data)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ');
    
    const values = [...Object.values(data), ...whereParams];
    const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause} RETURNING *`;
    
    const result = await this.query(sql, values);
    return result.rows[0];
  }

  async delete(table: string, whereClause: string, whereParams: any[] = []): Promise<boolean> {
    const sql = `DELETE FROM ${table} WHERE ${whereClause}`;
    const result = await this.query(sql, whereParams);
    return result.rowCount > 0;
  }

  async count(table: string, whereClause?: string, whereParams?: any[]): Promise<number> {
    let sql = `SELECT COUNT(*) as count FROM ${table}`;
    if (whereClause) {
      sql += ` WHERE ${whereClause}`;
    }
    
    const result = await this.getOne<{count: string | number}>(sql, whereParams);
    return parseInt(result?.count?.toString() || '0', 10);
  }

  getPoolStatus(): object {
    return {
      status: this.pool ? (this.isConnected ? 'connected' : 'disconnected') : 'not_initialized',
      totalCount: this.pool?.totalCount || 0,
      idleCount: this.pool?.idleCount || 0,
      waitingCount: this.pool?.waitingCount || 0,
      config: this.config,
    };
  }

  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      this.isConnected = false;
      console.log('🔒 数据库连接池已关闭');
    }
  }
}

function handleDbError(error: any, operation: string): Error {
  const errorCode = error.code || 'UNKNOWN';
  
  let userMessage = '数据库操作失败';
  
  switch (errorCode) {
    case 'ECONNREFUSED':
      userMessage = '无法连接到数据库服务器，请检查数据库是否启动';
      break;
    case '28P01':
      userMessage = '数据库认证失败，请检查用户名和密码';
      break;
    case '3D000':
      userMessage = '数据库不存在，请先创建数据库';
      break;
    case '23505':
      userMessage = '数据已存在，违反唯一约束';
      break;
    case '23503':
      userMessage = '外键约束违反，关联数据不存在';
      break;
    case '42P01':
      userMessage = '表不存在，请检查表名是否正确';
      break;
    default:
      userMessage = error.message || '未知数据库错误';
  }

  console.error(`数据库操作失败 (${operation}):`, {
    code: errorCode,
    message: error.message,
    detail: error.detail,
    hint: error.hint,
  });

  return new Error(userMessage);
}

const db = new DatabaseService();

export { db, DatabaseService, handleDbError };
export default db;
