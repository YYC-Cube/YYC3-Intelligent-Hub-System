/**
 * 数据库服务单元测试
 * 测试DatabaseService的核心功能
 */

import { DatabaseService, handleDbError } from '../app/services/database';

describe('DatabaseService', () => {
  let db: DatabaseService;

  beforeEach(() => {
    db = new DatabaseService();
  });

  describe('构造函数和初始化', () => {
    test('应该使用环境变量正确初始化配置', () => {
      const status = db.getPoolStatus() as any;
      expect(status).toHaveProperty('config');
      expect(status.config.host).toBe('127.0.0.1');
      expect(status.config.port).toBe(5434);
      expect(status.config.database).toBe('yyc3_integration_center');
    });

    test('未初始化时状态应为not_initialized', () => {
      const status = db.getPoolStatus() as any;
      expect(status.status).toBe('not_initialized');
    });
  });

  describe('错误处理函数', () => {
    test('应该处理ECONNREFUSED错误', () => {
      const error = { code: 'ECONNREFUSED', message: 'Connection refused' };
      const result = handleDbError(error, 'connect');
      expect(result.message).toContain('无法连接到数据库服务器');
    });

    test('应该处理认证失败错误 (28P01)', () => {
      const error = { code: '28P01', message: 'password authentication failed' };
      const result = handleDbError(error, 'query');
      expect(result.message).toContain('数据库认证失败');
    });

    test('应该处理数据库不存在错误 (3D000)', () => {
      const error = { code: '3D000', message: 'database does not exist' };
      const result = handleDbError(error, 'query');
      expect(result.message).toContain('数据库不存在');
    });

    test('应该处理唯一约束违反错误 (23505)', () => {
      const error = { code: '23505', message: 'duplicate key value' };
      const result = handleDbError(error, 'insert');
      expect(result.message).toContain('数据已存在');
    });

    test('应该处理外键约束违反错误 (23503)', () => {
      const error = { code: '23503', message: 'foreign key violation' };
      const result = handleDbError(error, 'delete');
      expect(result.message).toContain('外键约束违反');
    });

    test('应该处理表不存在错误 (42P01)', () => {
      const error = { code: '42P01', message: 'relation does not exist' };
      const result = handleDbError(error, 'query');
      expect(result.message).toContain('表不存在');
    });

    test('应该处理未知错误代码', () => {
      const error = { code: 'UNKNOWN', message: 'unknown error occurred' };
      const result = handleDbError(error, 'update');
      expect(result.message).toBe('unknown error occurred');
    });
  });
});

/**
 * 集成测试依赖外部 PostgreSQL（127.0.0.1:5434），默认不执行。
 *
 * 通过 `DB_INTEGRATION_TEST=1 npx jest` 显式开启，避免默认测试套件
 * 因为本地/CI 没有数据库而长期处于红灯状态（原先仅在 beforeAll 中
 * 打印一行警告但并不真正跳过，7 个用例必然失败）。
 */
const describeIntegration: jest.Describe =
  process.env.DB_INTEGRATION_TEST === '1' ? describe : describe.skip;

describeIntegration('数据库集成测试（需要真实的PostgreSQL连接）', () => {
  let db: DatabaseService;

  beforeAll(async () => {
    db = new DatabaseService();
    
    try {
      await db.initialize();
    } catch (error: any) {
      console.warn('⚠️  无法连接到数据库，跳过集成测试:', error?.message);
    }
  });

  afterAll(async () => {
    if (db) {
      await db.close();
    }
  });

  test('应该成功连接到数据库', async () => {
    if (!db) return;
    
    const status = db.getPoolStatus() as any;
    expect(status.status).toBe('connected');
  }, 10000);

  test('应该能够执行基本查询', async () => {
    if (!db) return;
    
    const result = await db.query('SELECT NOW() as current_time');
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0]).toHaveProperty('current_time');
  }, 10000);

  test('getOne方法应该返回单条记录或null', async () => {
    if (!db) return;
    
    const result = await db.getOne('SELECT COUNT(*) as count FROM integrations');
    expect(result).toBeTruthy();
    expect(result).toHaveProperty('count');
  }, 10000);

  test('getAll方法应该返回数组', async () => {
    if (!db) return;
    
    const results = await db.getAll('SELECT * FROM integrations LIMIT 10');
    expect(Array.isArray(results)).toBe(true);
  }, 10000);

  test('insert方法应该插入数据并返回记录', async () => {
    if (!db) return;
    
    const testData = {
      name: 'Test Integration',
      slug: `test-${Date.now()}`,
      description: 'Test description',
      category: 'Testing',
      version: '1.0.0',
      status: 'active',
      is_featured: false,
      install_count: 0,
      rating: 0,
    };

    const inserted = await db.insert('integrations', testData);
    expect(inserted).toBeTruthy();
    expect(inserted.name).toBe(testData.name);
    expect(inserted.slug).toBe(testData.slug);

    // 清理测试数据
    await db.delete('integrations', 'slug = $1', [testData.slug]);
  }, 15000);

  test('transaction方法应该支持事务操作', async () => {
    if (!db) return;

    const slug1 = `tx-test-1-${Date.now()}`;
    const slug2 = `tx-test-2-${Date.now()}`;

    try {
      await db.transaction(async (client) => {
        await client.query(
          'INSERT INTO integrations (name, slug, description, category, version, status, is_featured, install_count, rating) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
          ['TX Test 1', slug1, 'Transaction test 1', 'Testing', '1.0.0', 'active', false, 0, 0]
        );
        
        await client.query(
          'INSERT INTO integrations (name, slug, description, category, version, status, is_featured, install_count, rating) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
          ['TX Test 2', slug2, 'Transaction test 2', 'Testing', '1.0.0', 'active', false, 0, 0]
        );
      });

      // 验证两条记录都已插入
      const count = await db.count('integrations', 'slug IN ($1, $2)', [slug1, slug2]);
      expect(count).toBe(2);

    } catch (error) {
      console.error('事务测试失败:', error);
      throw error;
    } finally {
      // 安全清理（忽略删除错误）
      try {
        await db.delete('integrations', 'slug = $1', [slug1]);
        await db.delete('integrations', 'slug = $1', [slug2]);
      } catch (e) {
        console.warn('清理测试数据时出错（可忽略）:', e);
      }
    }
  }, 15000);

  test('count方法应该返回正确的计数', async () => {
    if (!db) return;
    
    const count = await db.count('integrations');
    expect(typeof count).toBe('number');
    expect(count).toBeGreaterThanOrEqual(0);
  }, 10000);
});
