// db.ts - Cloud SQL PostgreSQL Version
import { Pool, PoolClient } from 'pg';
import { setTimeout } from 'timers/promises';

// Types
export interface UserType {
  id?: number;
  email: string;
  password?: string;
  phone?: string;
  full_name?: string;
  birth_date?: string;
  day_of_birth?: string;
  element_type?: string;
  zodiac_sign?: string;
  blood_group?: string;
  avatar?: string | null;
  created_at?: string;
  last_login?: string;
  login_count?: number;
}

export interface TodoType {
  id?: number;
  title: string;
  completed: boolean;
  created_at: string;
  user_id: number;
}

interface UserUpdateData {
  email?: string;
  phone?: string;
  birthDate?: string;
  elementType?: string;
  zodiacSign?: string;
  bloodGroup?: string;
  fullName?: string;
  dayOfBirth?: string;
  avatar?: string | null;
}

// Cloud SQL Database Singleton
class CloudSQLDatabase {
  private static instance: CloudSQLDatabase;
  private pool: Pool | null = null;
  private initialized: boolean = false;
  private initPromise: Promise<void> | null = null;

  private constructor() {
    // Private constructor to enforce singleton
  }

  public static getInstance(): CloudSQLDatabase {
    if (!CloudSQLDatabase.instance) {
      CloudSQLDatabase.instance = new CloudSQLDatabase();
    }
    return CloudSQLDatabase.instance;
  }

  private async withRetry<T>(operation: () => Promise<T>, maxAttempts: number = 3, delayMs: number = 1000): Promise<T> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error: any) { // ใช้ any เพื่อแก้ ts(1196)
        console.warn(`⚠️ Retry attempt ${attempt} failed:`, {
          message: error.message || 'Unknown error',
          stack: error.stack,
          code: error.code,
          errno: error.errno,
        });
        if (attempt === maxAttempts) throw new Error(`Operation failed after ${maxAttempts} attempts: ${error.message || 'Unknown error'}`);
        await setTimeout(delayMs * attempt); // Exponential backoff
      }
    }
    throw new Error('Operation failed after maximum retries');
  }

  public async init(): Promise<void> {
    if (typeof window !== 'undefined') {
      console.warn('Cloud SQL database cannot be initialized in browser environment');
      return;
    }

    if (this.initialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = this.withRetry(async () => {
      try {
        // ตรวจสอบตัวแปรสภาพแวดล้อม
        const requiredEnvVars = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
        for (const envVar of requiredEnvVars) {
          if (!process.env[envVar]) {
            throw new Error(`ตัวแปรสภาพแวดล้อมที่จำเป็นขาดหายไป: ${envVar}`);
          }
        }

        const dbConfig = {
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '5432'),
          database: process.env.DB_NAME || 'nummu_app',
          user: process.env.DB_USER || 'postgres',
          password: process.env.DB_PASSWORD,
          ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
          max: 30, // รองรับ traffic สูง
          idleTimeoutMillis: 5000, // ตรวจจับ idle connections เร็วขึ้น
          connectionTimeoutMillis: 5000, // ตรวจจับปัญหาการเชื่อมต่อ
          query_timeout: 5000,
          statement_timeout: 5000,
        };

        console.log('🔌 Connecting to Cloud SQL PostgreSQL...');
        console.log(`📍 Host: ${dbConfig.host}:${dbConfig.port}`);
        console.log(`📊 Database: ${dbConfig.database}`);
        console.log(`👤 User: ${dbConfig.user}`);

        this.pool = new Pool(dbConfig);

        // ทดสอบการเชื่อมต่อ
        const client = await this.pool.connect();
        try {
          const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
          console.log('✅ Cloud SQL connection successful');
          console.log(`⏰ Server time: ${result.rows[0].current_time}`);
          console.log(`🐘 PostgreSQL version: ${result.rows[0].pg_version.split(' ')[0]}`);
        } finally {
          client.release();
        }

        await this.optimizeConnectionPool();
        console.log('📋 Creating tables if they don\'t exist...');
        await this.createTables();
        this.initialized = true;
        console.log('🚀 Cloud SQL Database initialization complete');
        await this.logDatabaseStats();
      } catch (error: any) { // ใช้ any เพื่อแก้ ts(1196)
        console.error('❌ Cloud SQL initialization failed:', {
          message: error.message || 'Unknown error',
          stack: error.stack,
          code: error.code,
          errno: error.errno,
        });
        throw error;
      }
    });

    return this.initPromise;
  }

  private async optimizeConnectionPool(): Promise<void> {
    if (!this.pool) return;

    console.log('⚡ Optimizing PostgreSQL connection pool...');
    this.pool.on('connect', () => console.log('🔗 New client connected to PostgreSQL'));
    this.pool.on('error', (err: any) => console.error('💥 PostgreSQL client error:', {
      message: err.message || 'Unknown error',
      stack: err.stack,
      code: err.code,
      errno: err.errno,
    }));
    console.log('✅ Connection pool optimized');
  }

  private async logPoolStats(): Promise<void> {
    if (this.pool) {
      console.log('📊 Pool Stats:', {
        totalCount: this.pool.totalCount,
        idleCount: this.pool.idleCount,
        waitingCount: this.pool.waitingCount,
      });
    }
  }

  private async createTables(): Promise<void> {
    if (!this.pool) return;

    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          phone VARCHAR(50),
          password VARCHAR(255),
          full_name VARCHAR(255) NOT NULL,
          birth_date DATE,
          day_of_birth VARCHAR(50),
          element_type VARCHAR(50),
          zodiac_sign VARCHAR(50),
          blood_group VARCHAR(10),
          avatar TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          last_login TIMESTAMP,
          login_count INTEGER DEFAULT 0
        )
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS appointments (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          service_type VARCHAR(100) NOT NULL,
          appointment_date DATE NOT NULL,
          appointment_time TIME NOT NULL,
          notes TEXT,
          status VARCHAR(20) DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS predictions (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          prediction_type VARCHAR(50) NOT NULL,
          prediction_date DATE NOT NULL,
          content TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS todos (
          id SERIAL PRIMARY KEY,
          title VARCHAR(500) NOT NULL,
          completed BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMP NOT NULL,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
        )
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS temples (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          image TEXT,
          address TEXT,
          description TEXT,
          highlighted BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS buddha_statues (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          temple_id INTEGER NOT NULL REFERENCES temples(id) ON DELETE CASCADE,
          image TEXT,
          benefits TEXT,
          description TEXT,
          popular BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS login_history (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          login_at TIMESTAMP NOT NULL,
          ip_address INET,
          user_agent TEXT
        )
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        CREATE INDEX IF NOT EXISTS idx_login_history_user_id ON login_history(user_id);
        CREATE INDEX IF NOT EXISTS idx_login_history_login_at ON login_history(login_at);
        CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);
        CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
        CREATE INDEX IF NOT EXISTS idx_predictions_user_id ON predictions(user_id);
        CREATE INDEX IF NOT EXISTS idx_buddha_statues_temple_id ON buddha_statues(temple_id);
      `);

      await client.query('COMMIT');
      console.log('📋 All PostgreSQL tables created successfully');
    } catch (error: any) { // ใช้ any เพื่อแก้ ts(1196)
      await client.query('ROLLBACK');
      console.error('❌ Error creating tables:', {
        message: error.message || 'Unknown error',
        stack: error.stack,
        code: error.code,
        errno: error.errno,
      });
      throw error;
    } finally {
      client.release();
    }
  }

  async recordLogin(userId: number | string, ipAddress: string | null, userAgent: string) {
    await this.init();
    if (!this.pool) throw new Error('Database not initialized');

    return this.withRetry(async () => {
      const client = await this.pool!.connect();
      try {
        await client.query('BEGIN');
        const now = new Date().toISOString();
        console.log(`📊 Recording login for user ID: ${userId}`);

        const updateResult = await client.query(
          `UPDATE users SET last_login = $1, login_count = COALESCE(login_count, 0) + 1 WHERE id = $2`,
          [now, userId]
        );

        if (updateResult.rowCount === 0) {
          console.warn(`⚠️ No user found with ID: ${userId}`);
          await client.query('ROLLBACK');
          return;
        }

        const insertResult = await client.query(
          `INSERT INTO login_history (user_id, login_at, ip_address, user_agent) VALUES ($1, $2, $3, $4) RETURNING id`,
          [userId, now, ipAddress || null, userAgent || null]
        );

        await client.query('COMMIT');
        console.log(`✅ Login recorded for user ID: ${userId} at ${now} (history ID: ${insertResult.rows[0].id})`);
      } catch (error: any) { // ใช้ any เพื่อแก้ ts(1196)
        await client.query('ROLLBACK');
        console.error('❌ Error recording login:', {
          message: error.message || 'Unknown error',
          stack: error.stack,
          code: error.code,
          errno: error.errno,
        });
        throw error;
      } finally {
        client.release();
      }
    });
  }

  public async healthCheck(): Promise<boolean> {
    try {
      if (!this.pool) {
        console.log('❌ Database pool not connected');
        return false;
      }
      const client = await this.pool.connect();
      try {
        const result = await client.query('SELECT 1 as health_check');
        console.log('✅ Database health check passed');
        await this.logPoolStats();
        return result.rows.length > 0;
      } finally {
        client.release();
      }
    } catch (error: any) { // ใช้ any เพื่อแก้ ts(1196)
      console.error('❌ Database health check failed:', {
        message: error.message || 'Unknown error',
        stack: error.stack,
        code: error.code,
        errno: error.errno,
      });
      return false;
    }
  }

  public async getVisitStats(): Promise<{
    todayVisits: number;
    weeklyVisits: number;
    monthlyVisits: number;
    totalUsers: number;
    activeToday: number;
  }> {
    await this.init();
    if (!this.pool) throw new Error('Database not initialized');

    return this.withRetry(async () => {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const monthStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

      const [todayResult, weekResult, monthResult, totalResult, activeResult] = await Promise.all([
        this.pool!.query(`SELECT COUNT(DISTINCT user_id) as count FROM login_history WHERE login_at >= $1`, [todayStart]),
        this.pool!.query(`SELECT COUNT(DISTINCT user_id) as count FROM login_history WHERE login_at >= $1`, [weekStart]),
        this.pool!.query(`SELECT COUNT(DISTINCT user_id) as count FROM login_history WHERE login_at >= $1`, [monthStart]),
        this.pool!.query(`SELECT COUNT(*) as count FROM users`),
        this.pool!.query(`SELECT COUNT(*) as count FROM users WHERE last_login >= $1`, [todayStart]),
      ]);

      return {
        todayVisits: parseInt(todayResult.rows[0].count) || 0,
        weeklyVisits: parseInt(weekResult.rows[0].count) || 0,
        monthlyVisits: parseInt(monthResult.rows[0].count) || 0,
        totalUsers: parseInt(totalResult.rows[0].count) || 0,
        activeToday: parseInt(activeResult.rows[0].count) || 0,
      };
    });
  }

  private async logDatabaseStats(): Promise<void> {
    try {
      const stats = await this.getVisitStats();
      console.log('📊 Database Stats:', {
        totalUsers: stats.totalUsers,
        activeToday: stats.activeToday,
        todayVisits: stats.todayVisits,
      });
    } catch (error: any) { // ใช้ any เพื่อแก้ ts(1196)
      console.error('⚠️ Could not retrieve database stats:', {
        message: error.message || 'Unknown error',
        stack: error.stack,
        code: error.code,
        errno: error.errno,
      });
    }
  }

  public async getUserByEmail(email: string): Promise<UserType | null> {
    await this.init();
    if (!this.pool) throw new Error('Database not initialized');

    return this.withRetry(async () => {
      const client = await this.pool!.connect();
      try {
        console.log(`🔍 Looking up user by email: ${email}`);
        const result = await client.query(`SELECT * FROM users WHERE email = $1`, [email]);
        if (result.rows.length > 0) {
          const user = result.rows[0];
          console.log(`✅ User found: ID ${user.id}, Name: ${user.full_name}`);
          return user;
        } else {
          console.log(`❌ No user found with email: ${email}`);
          return null;
        }
      } finally {
        client.release();
      }
    });
  }

  public async getUserByEmailAndPassword(email: string, password: string): Promise<UserType | null> {
    await this.init();
    if (!this.pool) throw new Error('Database not initialized');

    return this.withRetry(async () => {
      const client = await this.pool!.connect();
      try {
        console.log(`🔐 Authenticating user: ${email}`);
        const result = await client.query(`SELECT * FROM users WHERE email = $1 AND password = $2`, [email, password]);
        if (result.rows.length > 0) {
          const user = result.rows[0];
          console.log(`✅ Authentication successful for: ${user.full_name} (ID: ${user.id})`);
          return user;
        } else {
          console.log(`❌ Authentication failed for email: ${email}`);
          return null;
        }
      } finally {
        client.release();
      }
    });
  }

  public async getDatabaseInfo(): Promise<{
    type: string;
    host: string;
    database: string;
    userCount: number;
    loginHistoryCount: number;
    lastLoginTime: string | null;
  }> {
    await this.init();
    if (!this.pool) throw new Error('Database not initialized');

    return this.withRetry(async () => {
      const client = await this.pool!.connect();
      try {
        const [userCountResult, loginCountResult, lastLoginResult] = await Promise.all([
          client.query(`SELECT COUNT(*) as count FROM users`),
          client.query(`SELECT COUNT(*) as count FROM login_history`),
          client.query(`SELECT login_at FROM login_history ORDER BY login_at DESC LIMIT 1`),
        ]);

        return {
          type: 'Cloud SQL (PostgreSQL)',
          host: process.env.DB_HOST || 'localhost',
          database: process.env.DB_NAME || 'nummu_app',
          userCount: parseInt(userCountResult?.rows[0]?.count) || 0,
          loginHistoryCount: parseInt(loginCountResult?.rows[0]?.count) || 0,
          lastLoginTime: lastLoginResult?.rows[0]?.login_at || null,
        };
      } finally {
        client.release();
      }
    });
  }

  public async addUser(user: UserType): Promise<number> {
    await this.init();
    if (!this.pool) throw new Error('Database not initialized');

    return this.withRetry(async () => {
      const client = await this.pool!.connect();
      try {
        console.log(`👤 Adding new user: ${user.email}`);
        const result = await client.query(
          `INSERT INTO users (
            email, password, phone, full_name, birth_date, day_of_birth, 
            element_type, zodiac_sign, blood_group, avatar, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
          [
            user.email,
            user.password || null,
            user.phone || null,
            user.full_name || null,
            user.birth_date || null,
            user.day_of_birth || null,
            user.element_type || null,
            user.zodiac_sign || null,
            user.blood_group || null,
            user.avatar || null,
            user.created_at || new Date().toISOString(),
          ]
        );
        const userId = result.rows[0].id;
        console.log(`✅ User added successfully with ID: ${userId}`);
        return userId;
      } finally {
        client.release();
      }
    });
  }

  public async getUserById(id: number): Promise<UserType | null> {
    await this.init();
    if (!this.pool) throw new Error('Database not initialized');

    return this.withRetry(async () => {
      const client = await this.pool!.connect();
      try {
        const result = await client.query(`SELECT * FROM users WHERE id = $1`, [id]);
        return result.rows[0] || null;
      } finally {
        client.release();
      }
    });
  }

  public async updateUser(id: number, updates: string[], values: any[]): Promise<void> {
    await this.init();
    if (!this.pool) throw new Error('Database not initialized');

    if (updates.length === 0) {
      console.log('No updates to apply');
      return;
    }

    return this.withRetry(async () => {
      const client = await this.pool!.connect();
      try {
        const setClause = updates.map((update, index) => {
          const field = update.split(' = ')[0];
          return `${field} = $${index + 1}`;
        }).join(', ');
        const query = `UPDATE users SET ${setClause} WHERE id = $${values.length + 1}`;
        const queryValues = [...values, id];

        console.log('Executing SQL:', query);
        console.log('With values:', queryValues);

        const result = await client.query(query, queryValues);
        if (result.rowCount === 0) {
          console.warn('No rows were updated - user might not exist');
        }
      } finally {
        client.release();
      }
    });
  }

  public async addTodo(todo: TodoType): Promise<number> {
    await this.init();
    if (!this.pool) throw new Error('Database not initialized');

    return this.withRetry(async () => {
      const client = await this.pool!.connect();
      try {
        const result = await client.query(
          `INSERT INTO todos (title, completed, created_at, user_id) VALUES ($1, $2, $3, $4) RETURNING id`,
          [todo.title, todo.completed, todo.created_at, todo.user_id]
        );
        return result.rows[0].id;
      } finally {
        client.release();
      }
    });
  }

  public async updateTodo(id: number, completed: boolean): Promise<void> {
    await this.init();
    if (!this.pool) throw new Error('Database not initialized');

    return this.withRetry(async () => {
      const client = await this.pool!.connect();
      try {
        await client.query(`UPDATE todos SET completed = $1 WHERE id = $2`, [completed, id]);
      } finally {
        client.release();
      }
    });
  }

  public async deleteTodo(id: number): Promise<void> {
    await this.init();
    if (!this.pool) throw new Error('Database not initialized');

    return this.withRetry(async () => {
      const client = await this.pool!.connect();
      try {
        await client.query(`DELETE FROM todos WHERE id = $1`, [id]);
      } finally {
        client.release();
      }
    });
  }

  public async getAllUsers(): Promise<any[]> {
    await this.init();
    if (!this.pool) throw new Error('Database not initialized');

    return this.withRetry(async () => {
      const client = await this.pool!.connect();
      try {
        const result = await client.query(`
          SELECT 
            id, email, phone, full_name, birth_date, day_of_birth, 
            element_type, zodiac_sign, blood_group, avatar, created_at, 
            last_login, login_count
          FROM users 
          ORDER BY created_at DESC
        `);
        return result.rows || [];
      } finally {
        client.release();
      }
    });
  }

  public async runQuery(query: string, params?: any[]): Promise<any> {
    await this.init();
    if (!this.pool) throw new Error('Database not initialized');

    return this.withRetry(async () => {
      const client = await this.pool!.connect();
      try {
        const result = await client.query(query, params);
        return result.rows;
      } finally {
        client.release();
      }
    });
  }

  public async getTodosByUserId(userId: number): Promise<TodoType[]> {
    await this.init();
    if (!this.pool) throw new Error('Database not initialized');

    return this.withRetry(async () => {
      const client = await this.pool!.connect();
      try {
        const result = await client.query(
          `SELECT id, title, completed, created_at, user_id FROM todos WHERE user_id = $1 ORDER BY created_at DESC`,
          [userId]
        );
        return result.rows;
      } finally {
        client.release();
      }
    });
  }

  public async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      this.initialized = false;
      console.log('🔌 Cloud SQL connections closed');
    }
  }
}

export const updateUserData = async (userId: number, updates: UserUpdateData): Promise<void> => {
  const updateFields: string[] = [];
  const updateValues: any[] = [];

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      const dbFieldName = camelToSnake(key);
      updateFields.push(`${dbFieldName} = ?`);
      updateValues.push(value);
    }
  });

  if (updateFields.length > 0) {
    await dbService.updateUser(userId, updateFields, updateValues);
  }
};

const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

export const getUserFromDatabase = async (userId: number): Promise<any> => {
  const dbUser = await dbService.getUserById(userId);
  if (!dbUser) {
    throw new Error('User not found');
  }

  return {
    id: dbUser.id,
    email: dbUser.email,
    phone: dbUser.phone,
    birthDate: dbUser.birth_date,
    elementType: dbUser.element_type,
    zodiacSign: dbUser.zodiac_sign,
    bloodGroup: dbUser.blood_group,
    fullName: dbUser.full_name,
    dayOfBirth: dbUser.day_of_birth,
    avatar: dbUser.avatar,
  };
};

const dbService = CloudSQLDatabase.getInstance();

if (typeof window === 'undefined') {
  console.log('🏗️ Starting Cloud SQL database initialization on server...');
  dbService.init()
    .then(() => console.log('🎉 Cloud SQL Database service ready!'))
    .catch((error: any) => console.error('💥 Failed to initialize Cloud SQL database:', { // ใช้ any เพื่อแก้ ts(1196)
      message: error.message || 'Unknown error',
      stack: error.stack,
      code: error.code,
      errno: error.errno,
    }));
}

export default dbService;