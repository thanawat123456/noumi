// db.ts - Cloud SQL PostgreSQL Version
import { Pool } from 'pg';

// Types (คงเดิม)
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

  public async init(): Promise<void> {
    // Skip initialization in browser
    if (typeof window !== 'undefined') {
      console.warn('Cloud SQL database cannot be initialized in browser environment');
      return;
    }
    
    if (this.initialized) return;
    
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = new Promise(async (resolve, reject) => {
      try {
        // กำหนดค่าการเชื่อมต่อ Cloud SQL
        const dbConfig = {
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '5432'),
          database: process.env.DB_NAME || 'nummu_app',
          user: process.env.DB_USER || 'postgres',
          password: process.env.DB_PASSWORD,
          ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
          max: 30, 
          idleTimeoutMillis: 10000, 
          connectionTimeoutMillis: 5000, 
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
        const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
        console.log('✅ Cloud SQL connection successful');
        console.log(`⏰ Server time: ${result.rows[0].current_time}`);
        console.log(`🐘 PostgreSQL version: ${result.rows[0].pg_version.split(' ')[0]}`);
        client.release();

        // ปรับแต่ง connection pool
        await this.optimizeConnectionPool();
        
        // สร้างตาราง
        console.log('📋 Creating tables if they don\'t exist...');
        await this.createTables();
        
        this.initialized = true;
        console.log('🚀 Cloud SQL Database initialization complete');
        
        // Log current database stats
        await this.logDatabaseStats();
        
        resolve();
      } catch (error) {
        console.error('💥 Cloud SQL initialization failed:', error);
        reject(error);
      }
    });

    return this.initPromise;
  }

  private async optimizeConnectionPool(): Promise<void> {
    if (!this.pool) return;

    console.log('⚡ Optimizing PostgreSQL connection pool...');

    // สำหรับ PostgreSQL เราปรับแต่งได้น้อยกว่า SQLite
    // แต่สามารถตั้งค่า connection pool ได้
    this.pool.on('connect', (client) => {
      console.log('🔗 New client connected to PostgreSQL');
    });

    this.pool.on('error', (err, client) => {
      console.error('💥 PostgreSQL client error:', err);
    });

    console.log('✅ Connection pool optimized');
  }

  private async createTables(): Promise<void> {
    if (!this.pool) return;

    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // สร้างตาราง users
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

      // สร้างตาราง appointments
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

      // สร้างตาราง predictions
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

      // สร้างตาราง todos
      await client.query(`
        CREATE TABLE IF NOT EXISTS todos (
          id SERIAL PRIMARY KEY,
          title VARCHAR(500) NOT NULL,
          completed BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMP NOT NULL,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
        )
      `);

      // สร้างตาราง temples
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
      
      // สร้างตาราง buddha_statues
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

      // สร้างตาราง login_history
      await client.query(`
        CREATE TABLE IF NOT EXISTS login_history (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          login_at TIMESTAMP NOT NULL,
          ip_address INET,
          user_agent TEXT
        )
      `);

      // สร้าง indexes สำหรับการค้นหา
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

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Error creating tables:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // *** Enhanced recordLogin with better error handling ***
  public async recordLogin(userId: number, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.init();
    if (!this.pool) throw new Error('Database not initialized');
    
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      
      const now = new Date().toISOString();
      
      console.log(`📊 Recording login for user ID: ${userId}`);
      
      // อัพเดท last_login และ login_count ในตาราง users
      const updateResult = await client.query(`
        UPDATE users 
        SET last_login = $1,
            login_count = COALESCE(login_count, 0) + 1
        WHERE id = $2
      `, [now, userId]);
      
      if (updateResult.rowCount === 0) {
        console.warn(`⚠️ No user found with ID: ${userId}`);
        await client.query('ROLLBACK');
        return;
      }
      
      // บันทึกใน login_history
      const insertResult = await client.query(`
        INSERT INTO login_history (user_id, login_at, ip_address, user_agent)
        VALUES ($1, $2, $3, $4)
        RETURNING id
      `, [userId, now, ipAddress || null, userAgent || null]);
      
      await client.query('COMMIT');
      console.log(`✅ Login recorded for user ID: ${userId} at ${now} (history ID: ${insertResult.rows[0].id})`);
      
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Error recording login:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  public async healthCheck(): Promise<boolean> {
    try {
      if (!this.pool) {
        console.log('❌ Database pool not connected');
        return false;
      }
      
      const client = await this.pool.connect();
      const result = await client.query('SELECT 1 as health_check');
      client.release();
      
      console.log('✅ Database health check passed');
      return result.rows.length > 0;
    } catch (error) {
      console.error('❌ Database health check failed:', error);
      return false;
    }
  }

  // *** Enhanced recordLoginForNextAuth ***
  public async recordLoginForNextAuth(userId: number, userEmail: string, loginMethod: 'credentials' | 'google', ipAddress?: string, userAgent?: string): Promise<void> {
    await this.init();
    if (!this.pool) throw new Error('Database not initialized');
    
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      
      const now = new Date().toISOString();
      
      console.log(`🔐 Recording ${loginMethod} login for: ${userEmail}`);
      
      // อัพเดท last_login และ login_count ในตาราง users
      await client.query(`
        UPDATE users 
        SET last_login = $1,
            login_count = COALESCE(login_count, 0) + 1
        WHERE id = $2
      `, [now, userId]);
      
      // บันทึกใน login_history พร้อม login method info
      await client.query(`
        INSERT INTO login_history (user_id, login_at, ip_address, user_agent)
        VALUES ($1, $2, $3, $4)
      `, [userId, now, ipAddress || null, userAgent ? `${loginMethod}:${userAgent}` : loginMethod]);
      
      await client.query('COMMIT');
      console.log(`✅ ${loginMethod} login recorded for ${userEmail} at ${now}`);
      
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Error recording login for NextAuth:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Method สำหรับดึงสถิติการเข้าชม (แบบละเอียด)
  public async getVisitStats(): Promise<{
    todayVisits: number;
    weeklyVisits: number;
    monthlyVisits: number;
    totalUsers: number;
    activeToday: number;
  }> {
    await this.init();
    if (!this.pool) throw new Error('Database not initialized');
    
    try {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const monthStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      
      // Use Promise.all for concurrent queries
      const [todayResult, weekResult, monthResult, totalResult, activeResult] = await Promise.all([
        this.pool.query(`
          SELECT COUNT(DISTINCT user_id) as count 
          FROM login_history 
          WHERE login_at >= $1
        `, [todayStart]),
        
        this.pool.query(`
          SELECT COUNT(DISTINCT user_id) as count 
          FROM login_history 
          WHERE login_at >= $1
        `, [weekStart]),
        
        this.pool.query(`
          SELECT COUNT(DISTINCT user_id) as count 
          FROM login_history 
          WHERE login_at >= $1
        `, [monthStart]),
        
        this.pool.query(`SELECT COUNT(*) as count FROM users`),
        
        this.pool.query(`
          SELECT COUNT(*) as count 
          FROM users 
          WHERE last_login >= $1
        `, [todayStart])
      ]);
      
      return {
        todayVisits: parseInt(todayResult.rows[0].count) || 0,
        weeklyVisits: parseInt(weekResult.rows[0].count) || 0,
        monthlyVisits: parseInt(monthResult.rows[0].count) || 0,
        totalUsers: parseInt(totalResult.rows[0].count) || 0,
        activeToday: parseInt(activeResult.rows[0].count) || 0
      };
    } catch (error) {
      console.error('❌ Error getting visit stats:', error);
      return {
        todayVisits: 0,
        weeklyVisits: 0,
        monthlyVisits: 0,
        totalUsers: 0,
        activeToday: 0
      };
    }
  }

  // *** Method เพื่อ log database stats ***
  private async logDatabaseStats(): Promise<void> {
    try {
      const stats = await this.getVisitStats();
      console.log('📊 Database Stats:', {
        totalUsers: stats.totalUsers,
        activeToday: stats.activeToday,
        todayVisits: stats.todayVisits
      });
    } catch (error) {
      console.log('⚠️ Could not retrieve database stats');
    }
  }

  // *** Enhanced getUserByEmail with logging ***
  public async getUserByEmail(email: string): Promise<UserType | null> {
    await this.init();
    if (!this.pool) throw new Error('Database not initialized');
    
    try {
      console.log(`🔍 Looking up user by email: ${email}`);
      
      const result = await this.pool.query(`
        SELECT * FROM users WHERE email = $1
      `, [email]);
      
      if (result.rows.length > 0) {
        const user = result.rows[0];
        console.log(`✅ User found: ID ${user.id}, Name: ${user.full_name}`);
        return user;
      } else {
        console.log(`❌ No user found with email: ${email}`);
        return null;
      }
      
    } catch (error) {
      console.error('❌ Error getting user by email:', error);
      throw error;
    }
  }

  // *** Enhanced getUserByEmailAndPassword ***
  public async getUserByEmailAndPassword(email: string, password: string): Promise<UserType | null> {
    await this.init();
    if (!this.pool) throw new Error('Database not initialized');
    
    try {
      console.log(`🔐 Authenticating user: ${email}`);
      
      const result = await this.pool.query(`
        SELECT * FROM users WHERE email = $1 AND password = $2
      `, [email, password]);
      
      if (result.rows.length > 0) {
        const user = result.rows[0];
        console.log(`✅ Authentication successful for: ${user.full_name} (ID: ${user.id})`);
        return user;
      } else {
        console.log(`❌ Authentication failed for email: ${email}`);
        return null;
      }
      
    } catch (error) {
      console.error('❌ Error authenticating user:', error);
      throw error;
    }
  }

  // *** Method เพื่อตรวจสอบสถานะ database ***
  public async getDatabaseInfo(): Promise<{
    type: string;
    host: string;
    database: string;
    userCount: number;
    loginHistoryCount: number;
    lastLoginTime: string | null;
  }> {
    await this.init();
    
    try {
      const [userCountResult, loginCountResult, lastLoginResult] = await Promise.all([
        this.pool?.query(`SELECT COUNT(*) as count FROM users`),
        this.pool?.query(`SELECT COUNT(*) as count FROM login_history`),
        this.pool?.query(`
          SELECT login_at FROM login_history 
          ORDER BY login_at DESC 
          LIMIT 1
        `)
      ]);
      
      return {
        type: 'Cloud SQL (PostgreSQL)',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'nummu_app',
        userCount: parseInt(userCountResult?.rows[0]?.count) || 0,
        loginHistoryCount: parseInt(loginCountResult?.rows[0]?.count) || 0,
        lastLoginTime: lastLoginResult?.rows[0]?.login_at || null
      };
    } catch (error) {
      console.error('❌ Error getting database info:', error);
      return {
        type: 'Cloud SQL (PostgreSQL)',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'nummu_app',
        userCount: 0,
        loginHistoryCount: 0,
        lastLoginTime: null
      };
    }
  }

  // Users methods
  public async addUser(user: UserType): Promise<number> {
    await this.init();
    if (!this.pool) throw new Error('Database not initialized');
    
    try {
      console.log(`👤 Adding new user: ${user.email}`);
      
      const result = await this.pool.query(`
        INSERT INTO users (
          email, password, phone, full_name, birth_date, day_of_birth, 
          element_type, zodiac_sign, blood_group, avatar, created_at
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id
      `, [
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
        user.created_at || new Date().toISOString()
      ]);
      
      const userId = result.rows[0].id;
      console.log(`✅ User added successfully with ID: ${userId}`);
      
      return userId;
    } catch (error) {
      console.error('❌ Error adding user:', error);
      throw error;
    }
  }

  public async getUserById(id: number): Promise<UserType | null> {
    await this.init();
    if (!this.pool) throw new Error('Database not initialized');
    
    try {
      const result = await this.pool.query(`
        SELECT * FROM users WHERE id = $1
      `, [id]);
      
      return result.rows[0] || null;
    } catch (error) {
      console.error('❌ Error getting user by ID:', error);
      throw error;
    }
  }

  public async updateUser(id: number, updates: string[], values: any[]): Promise<void> {
    await this.init();
    if (!this.pool) throw new Error('Database not initialized');
    
    if (updates.length === 0) {
      console.log('No updates to apply');
      return;
    }
    
    try {
      // แปลง SQL สำหรับ PostgreSQL (ใช้ $1, $2, ... แทน ?)
      const setClause = updates.map((update, index) => {
        const field = update.split(' = ')[0];
        return `${field} = $${index + 1}`;
      }).join(', ');
      
      const query = `UPDATE users SET ${setClause} WHERE id = $${values.length + 1}`;
      const queryValues = [...values, id];
      
      console.log('Executing SQL:', query);
      console.log('With values:', queryValues);
      
      const result = await this.pool.query(query, queryValues);
      
      console.log('Update result rowCount:', result.rowCount);
      
      if (result.rowCount === 0) {
        console.warn('No rows were updated - user might not exist');
      }
      
    } catch (error) {
      console.error('Database update error:', error);
      throw error;
    }
  }

  // Todos methods
  public async addTodo(todo: TodoType): Promise<number> {
    await this.init();
    if (!this.pool) throw new Error('Database not initialized');
    
    try {
      const result = await this.pool.query(`
        INSERT INTO todos (title, completed, created_at, user_id) 
        VALUES ($1, $2, $3, $4)
        RETURNING id
      `, [
        todo.title, 
        todo.completed, 
        todo.created_at, 
        todo.user_id
      ]);
      
      return result.rows[0].id;
    } catch (error) {
      console.error('❌ Error adding todo:', error);
      throw error;
    }
  }

  public async updateTodo(id: number, completed: boolean): Promise<void> {
    await this.init();
    if (!this.pool) throw new Error('Database not initialized');
    
    try {
      await this.pool.query(`
        UPDATE todos SET completed = $1 WHERE id = $2
      `, [completed, id]);
    } catch (error) {
      console.error('❌ Error updating todo:', error);
      throw error;
    }
  }

  public async deleteTodo(id: number): Promise<void> {
    await this.init();
    if (!this.pool) throw new Error('Database not initialized');
    
    try {
      await this.pool.query(`
        DELETE FROM todos WHERE id = $1
      `, [id]);
    } catch (error) {
      console.error('❌ Error deleting todo:', error);
      throw error;
    }
  }

  public async getAllUsers(): Promise<any[]> {
    await this.init();
    if (!this.pool) throw new Error('Database not initialized');
    
    try {
      const result = await this.pool.query(`
        SELECT 
          id,
          email,
          phone,
          full_name,
          birth_date,
          day_of_birth,
          element_type,
          zodiac_sign,
          blood_group,
          avatar,
          created_at,
          last_login,
          login_count
        FROM users 
        ORDER BY created_at DESC
      `);
      
      return result.rows || [];
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }

  // หรือถ้าต้องการ method ทั่วไปสำหรับ query ใดๆ:
  public async runQuery(query: string, params?: any[]): Promise<any> {
    await this.init();
    if (!this.pool) throw new Error('Database not initialized');
    
    try {
      const result = await this.pool.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('❌ Error running query:', error);
      throw error;
    }
  }

  public async getTodosByUserId(userId: number): Promise<TodoType[]> {
    await this.init();
    if (!this.pool) throw new Error('Database not initialized');
    
    try {
      const result = await this.pool.query(`
        SELECT id, title, completed, created_at, user_id 
        FROM todos 
        WHERE user_id = $1 
        ORDER BY created_at DESC
      `, [userId]);
      
      return result.rows;
    } catch (error) {
      console.error('❌ Error getting todos:', error);
      throw error;
    }
  }

  // ปิดการเชื่อมต่อ
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

  // แปลง object เป็น arrays สำหรับ SQL UPDATE
  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      // แปลง camelCase เป็น snake_case สำหรับฐานข้อมูล
      const dbFieldName = camelToSnake(key);
      updateFields.push(`${dbFieldName} = ?`); // จะถูกแปลงเป็น $1, $2 ใน updateUser method
      updateValues.push(value);
    }
  });

  // เรียกฟังก์ชัน updateUser ด้วย parameters ที่ถูกต้อง
  if (updateFields.length > 0) {
    await dbService.updateUser(userId, updateFields, updateValues);
  }
};

/**
 * แปลง camelCase เป็น snake_case
 */
const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

/**
 * ดึงข้อมูลผู้ใช้จากฐานข้อมูลและแปลงเป็น User interface
 */
export const getUserFromDatabase = async (userId: number): Promise<any> => {
  const dbUser = await dbService.getUserById(userId);
  
  if (!dbUser) {
    throw new Error('User not found');
  }

  // แปลง database fields เป็น camelCase สำหรับ frontend
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

// Export singleton instance
const dbService = CloudSQLDatabase.getInstance();

// ตรวจสอบว่าเราอยู่ในสภาพแวดล้อมของ server (ไม่ใช่ browser)
if (typeof window === 'undefined') {
  console.log('🏗️ Starting Cloud SQL database initialization on server...');
  dbService.init()
    .then(() => {
      console.log('🎉 Cloud SQL Database service ready!');
    })
    .catch(err => {
      console.error('💥 Failed to initialize Cloud SQL database:', err);
    });
}

export default dbService;