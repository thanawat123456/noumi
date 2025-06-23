import { Database } from 'sqlite'

// Import server-only modules dynamically
let sqlite3: any = null;
let open: any = null;
let path: any = null;
let fs: any = null;

// Only import server-side modules on the server
if (typeof window === 'undefined') {
  // Dynamic imports for server-side only
  import('sqlite3').then(module => { sqlite3 = module.default });
  import('sqlite').then(module => { open = module.open });
  import('path').then(module => { path = module.default });
  import('fs').then(module => { fs = module.default });
}

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

// SQLite Database Singleton
class SQLiteDatabase {
  private static instance: SQLiteDatabase;
  private db: Database | null = null;
  private initialized: boolean = false;
  private initPromise: Promise<void> | null = null;

  private constructor() {
    // Private constructor to enforce singleton
  }

  public static getInstance(): SQLiteDatabase {
    if (!SQLiteDatabase.instance) {
      SQLiteDatabase.instance = new SQLiteDatabase();
    }
    return SQLiteDatabase.instance;
  }

  public async init(): Promise<void> {
    // Skip initialization in browser
    if (typeof window !== 'undefined') {
      console.warn('SQLite database cannot be initialized in browser environment');
      return;
    }
    
    if (this.initialized) return;
    
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = new Promise(async (resolve, reject) => {
      try {
        // Import all dependencies at once
        const [sqlite3Module, sqliteModule, pathModule, fsModule] = await Promise.all([
          import('sqlite3'),
          import('sqlite'),
          import('path'),
          import('fs')
        ]);
        
        const sqlite3 = sqlite3Module.default;
        const { open } = sqliteModule;
        const path = pathModule.default;
        const fs = fsModule.default;
        
        // *** Enhanced DB_PATH handling for Volume Mount ***
        let DB_PATH: string;
        
        if (process.env.DB_PATH) {
          // ใช้ path จาก environment variable (Cloud Run volume mount)
          DB_PATH = process.env.DB_PATH;
          console.log('🔗 Using Cloud Storage volume mount path:', DB_PATH);
        } else {
          // ใช้ path ปกติสำหรับ development
          DB_PATH = path.resolve('./db/Nummu-app.db');
          console.log('💻 Using local development path:', DB_PATH);
        }
        
        // Create db directory if it doesn't exist
        const dbDir = path.dirname(DB_PATH);
        if (!fs.existsSync(dbDir)) {
          console.log(`📁 Creating directory: ${dbDir}`);
          fs.mkdirSync(dbDir, { recursive: true });
        }
        
        // *** Enhanced database file checking ***
        if (!fs.existsSync(DB_PATH)) {
          console.log('❌ Database file not found at:', DB_PATH);
          console.log('🔄 New database will be created automatically');
        } else {
          console.log('✅ Database file found at:', DB_PATH);
          
          // ตรวจสอบขนาดไฟล์
          const stats = fs.statSync(DB_PATH);
          console.log(`📊 Database size: ${(stats.size / 1024).toFixed(2)} KB`);
        }
        
        // Open database connection
        console.log('🔌 Opening database connection...');
        this.db = await open({
          filename: DB_PATH,
          driver: sqlite3.Database
        });
        console.log('✅ Database connection successful');
        
        // Create tables
        console.log('📋 Creating tables if they don\'t exist...');
        await this.createTables();
        
        this.initialized = true;
        console.log('🚀 Database initialization complete');
        
        // *** Log current database stats ***
        await this.logDatabaseStats();
        
        resolve();
      } catch (error) {
        console.error('💥 Database initialization failed:', error);
        reject(error);
      }
    });

    return this.initPromise;
  }

  private async createTables(): Promise<void> {
    if (!this.db) return;

    // Create users table
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        password TEXT NULL,
        full_name TEXT NOT NULL,
        birth_date TEXT NULL,
        day_of_birth TEXT,
        element_type TEXT,
        zodiac_sign TEXT,
        blood_group TEXT,
        avatar TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login TEXT,
        login_count INTEGER DEFAULT 0
      )
    `);

    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        service_type TEXT NOT NULL,
        appointment_date TEXT NOT NULL,
        appointment_time TEXT NOT NULL,
        notes TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS predictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        prediction_type TEXT NOT NULL,
        prediction_date TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // Create todos table
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS temples (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        image TEXT,
        address TEXT,
        description TEXT,
        highlighted INTEGER NOT NULL DEFAULT 0,
        created_at TEXT
      )
    `);
    
    // Create buddha_statues table
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS buddha_statues (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        temple_id INTEGER NOT NULL,
        image TEXT,
        benefits TEXT,
        description TEXT,
        popular INTEGER NOT NULL DEFAULT 0,
        created_at TEXT,
        FOREIGN KEY (temple_id) REFERENCES temples (id)
      )
    `);

    // สร้างตาราง login_history แยกต่างหาก
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS login_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        login_at TEXT NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);
  }

  // *** Enhanced recordLogin with better error handling ***
  public async recordLogin(userId: number, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');
    
    try {
      const now = new Date().toISOString();
      
      console.log(`📊 Recording login for user ID: ${userId}`);
      
      // อัพเดท last_login และ login_count ในตาราง users
      const updateResult = await this.db.run(`
        UPDATE users 
        SET last_login = ?,
            login_count = COALESCE(login_count, 0) + 1
        WHERE id = ?
      `, [now, userId]);
      
      if (updateResult.changes === 0) {
        console.warn(`⚠️ No user found with ID: ${userId}`);
        return;
      }
      
      // บันทึกใน login_history
      const insertResult = await this.db.run(`
        INSERT INTO login_history (user_id, login_at, ip_address, user_agent)
        VALUES (?, ?, ?, ?)
      `, [userId, now, ipAddress || null, userAgent || null]);
      
      console.log(`✅ Login recorded for user ID: ${userId} at ${now} (history ID: ${insertResult.lastID})`);
      
    } catch (error) {
      console.error('❌ Error recording login:', error);
      throw error; // Re-throw for NextAuth to handle
    }
  }

  // *** Enhanced recordLoginForNextAuth ***
  public async recordLoginForNextAuth(userId: number, userEmail: string, loginMethod: 'credentials' | 'google', ipAddress?: string, userAgent?: string): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');
    
    try {
      const now = new Date().toISOString();
      
      console.log(`🔐 Recording ${loginMethod} login for: ${userEmail}`);
      
      // อัพเดท last_login และ login_count ในตาราง users
      const updateResult = await this.db.run(`
        UPDATE users 
        SET last_login = ?,
            login_count = COALESCE(login_count, 0) + 1
        WHERE id = ?
      `, [now, userId]);
      
      // บันทึกใน login_history พร้อม login method info
      await this.db.run(`
        INSERT INTO login_history (user_id, login_at, ip_address, user_agent)
        VALUES (?, ?, ?, ?)
      `, [userId, now, ipAddress || null, userAgent ? `${loginMethod}:${userAgent}` : loginMethod]);
      
      console.log(`✅ ${loginMethod} login recorded for ${userEmail} at ${now}`);
      
    } catch (error) {
      console.error('❌ Error recording login for NextAuth:', error);
      throw error;
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
    if (!this.db) throw new Error('Database not initialized');
    
    try {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const monthStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      
      // นับการ login จาก login_history
      const todayResult = await this.db.get<{count: number}>(`
        SELECT COUNT(DISTINCT user_id) as count 
        FROM login_history 
        WHERE login_at >= ?
      `, todayStart);
      
      const weekResult = await this.db.get<{count: number}>(`
        SELECT COUNT(DISTINCT user_id) as count 
        FROM login_history 
        WHERE login_at >= ?
      `, weekStart);
      
      const monthResult = await this.db.get<{count: number}>(`
        SELECT COUNT(DISTINCT user_id) as count 
        FROM login_history 
        WHERE login_at >= ?
      `, monthStart);
      
      // นับ total users
      const totalResult = await this.db.get<{count: number}>(`
        SELECT COUNT(*) as count FROM users
      `);
      
      // นับ active users วันนี้
      const activeResult = await this.db.get<{count: number}>(`
        SELECT COUNT(*) as count 
        FROM users 
        WHERE last_login >= ?
      `, todayStart);
      
      return {
        todayVisits: todayResult?.count || 0,
        weeklyVisits: weekResult?.count || 0,
        monthlyVisits: monthResult?.count || 0,
        totalUsers: totalResult?.count || 0,
        activeToday: activeResult?.count || 0
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
      console.log('⚠️ Could not retrieve database stats:');
    }
  }

  // *** Enhanced getUserByEmail with logging ***
  public async getUserByEmail(email: string): Promise<UserType | null> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');
    
    try {
      console.log(`🔍 Looking up user by email: ${email}`);
      
      const user = await this.db.get<UserType>(`
        SELECT * FROM users WHERE email = ?
      `, email);
      
      if (user) {
        console.log(`✅ User found: ID ${user.id}, Name: ${user.full_name}`);
      } else {
        console.log(`❌ No user found with email: ${email}`);
      }
      
      return user || null;
    } catch (error) {
      console.error('❌ Error getting user by email:', error);
      throw error;
    }
  }

  // *** Enhanced getUserByEmailAndPassword ***
  public async getUserByEmailAndPassword(email: string, password: string): Promise<UserType | null> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');
    
    try {
      console.log(`🔐 Authenticating user: ${email}`);
      
      const user = await this.db.get<UserType>(`
        SELECT * FROM users WHERE email = ? AND password = ?
      `, [email, password]);
      
      if (user) {
        console.log(`✅ Authentication successful for: ${user.full_name} (ID: ${user.id})`);
      } else {
        console.log(`❌ Authentication failed for email: ${email}`);
      }
      
      return user || null;
    } catch (error) {
      console.error('❌ Error authenticating user:', error);
      throw error;
    }
  }

  // *** Method เพื่อตรวจสอบสถานะ database ***
  public async getDatabaseInfo(): Promise<{
    path: string;
    isVolumeMount: boolean;
    userCount: number;
    loginHistoryCount: number;
    lastLoginTime: string | null;
  }> {
    await this.init();
    
    const dbPath = process.env.DB_PATH || './db/Nummu-app.db';
    const isVolumeMount = !!process.env.DB_PATH;
    
    try {
      const userCountResult = await this.db?.get<{count: number}>(`
        SELECT COUNT(*) as count FROM users
      `);
      
      const loginCountResult = await this.db?.get<{count: number}>(`
        SELECT COUNT(*) as count FROM login_history
      `);
      
      const lastLoginResult = await this.db?.get<{login_at: string}>(`
        SELECT login_at FROM login_history 
        ORDER BY login_at DESC 
        LIMIT 1
      `);
      
      return {
        path: dbPath,
        isVolumeMount,
        userCount: userCountResult?.count || 0,
        loginHistoryCount: loginCountResult?.count || 0,
        lastLoginTime: lastLoginResult?.login_at || null
      };
    } catch (error) {
      console.error('❌ Error getting database info:', error);
      return {
        path: dbPath,
        isVolumeMount,
        userCount: 0,
        loginHistoryCount: 0,
        lastLoginTime: null
      };
    }
  }

  // Users methods
  public async addUser(user: UserType): Promise<number> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');
    
    try {
      console.log(`👤 Adding new user: ${user.email}`);
      
      const result = await this.db.run(`
        INSERT INTO users (
          email, password, phone, full_name, birth_date, day_of_birth, 
          element_type, zodiac_sign, blood_group, avatar, created_at
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      
      const userId = result.lastID || 0;
      console.log(`✅ User added successfully with ID: ${userId}`);
      
      return userId;
    } catch (error) {
      console.error('❌ Error adding user:', error);
      throw error;
    }
  }

  public async getUserById(id: number): Promise<UserType | null> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');
    
    const user = await this.db.get<UserType>(`
      SELECT * FROM users WHERE id = ?
    `, id);
    
    return user || null;
  }

  public async updateUser(id: number, updates: string[], values: any[]): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');
    
    if (updates.length === 0) {
      console.log('No updates to apply');
      return;
    }
    
    try {
      // สร้าง SQL query - updates array มี format "field = ?" อยู่แล้ว
      const setClause = updates.join(', ');
      const query = `UPDATE users SET ${setClause} WHERE id = ?`;
      
      // เพิ่ม id ไปที่ท้าย values array
      const queryValues = [...values, id];
      
      console.log('Executing SQL:', query);
      console.log('With values:', queryValues);
      
      const result = await this.db.run(query, queryValues);
      
      console.log('Update result changes:', result.changes);
      
      if (result.changes === 0) {
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
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.run(`
      INSERT INTO todos (title, completed, created_at, user_id) 
      VALUES (?, ?, ?, ?)
    `, [
      todo.title, 
      todo.completed ? 1 : 0, 
      todo.created_at, 
      todo.user_id
    ]);
    
    return result.lastID || 0;
  }

  public async updateTodo(id: number, completed: boolean): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');
    
    await this.db.run(`
      UPDATE todos SET completed = ? WHERE id = ?
    `, [completed ? 1 : 0, id]);
  }

  public async deleteTodo(id: number): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');
    
    await this.db.run(`
      DELETE FROM todos WHERE id = ?
    `, id);
  }

  public async getAllUsers(): Promise<any[]> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');
    
    try {
      const users = await this.db.all(`
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
      
      return users || [];
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }

  // หรือถ้าต้องการ method ทั่วไปสำหรับ query ใดๆ:
  public async runQuery(query: string, params?: any[]): Promise<any> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');
    
    return await this.db.all(query, params);
  }

  public async getTodosByUserId(userId: number): Promise<TodoType[]> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');
    
    const todos = await this.db.all<TodoType[]>(`
      SELECT id, title, 
             CASE WHEN completed = 1 THEN 1 ELSE 0 END as completed, 
             created_at, user_id 
      FROM todos 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `, userId);
    
    // แปลงค่า completed จาก number เป็น boolean
    return todos.map(todo => ({
      ...todo,
      completed: !!todo.completed 
    }));
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
      updateFields.push(`${dbFieldName} = ?`);
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
const dbService = SQLiteDatabase.getInstance();

// ตรวจสอบว่าเราอยู่ในสภาพแวดล้อมของ server (ไม่ใช่ browser)
if (typeof window === 'undefined') {
  console.log('🏗️ Starting database initialization on server...');
  dbService.init()
    .then(() => {
      console.log('🎉 Database service ready!');
    })
    .catch(err => {
      console.error('💥 Failed to initialize database:', err);
    });
}

export default dbService;