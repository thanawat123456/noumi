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
        
        // Set DB_PATH after path is loaded
        const DB_PATH = path.resolve('./db/Nummu-app.db');
        console.log('DB_PATH:', DB_PATH); // Debug log
        
        // Create db directory if it doesn't exist
        const dbDir = path.dirname(DB_PATH);
        if (!fs.existsSync(dbDir)) {
          console.log(`Creating directory: ${dbDir}`);
          fs.mkdirSync(dbDir, { recursive: true });
        }
        
        // Open database connection
        console.log('Opening database connection...');
        this.db = await open({
          filename: DB_PATH,
          driver: sqlite3.Database
        });
        console.log('Database connection successful');
        
        // Create tables
        console.log('Creating tables if they don\'t exist...');
        await this.createTables();
        
        this.initialized = true;
        console.log('Database initialization complete');
        resolve();
      } catch (error) {
        console.error('Database initialization failed:', error);
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
        password TEXT,
        phone TEXT,
        full_name TEXT,
        birth_date TEXT,
        day_of_birth TEXT,
        element_type TEXT,
        zodiac_sign TEXT,
        blood_group TEXT,
        avatar TEXT,
        created_at TEXT
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
  }

  

  // Users methods
  public async addUser(user: UserType): Promise<number> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');
    
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
    
    return result.lastID || 0;
  }

  public async getUserById(id: number): Promise<UserType | null> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');
    
    const user = await this.db.get<UserType>(`
      SELECT * FROM users WHERE id = ?
    `, id);
    
    return user || null;
  }

  public async getUserByEmail(email: string): Promise<UserType | null> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');
    
    const user = await this.db.get<UserType>(`
      SELECT * FROM users WHERE email = ?
    `, email);
    
    return user || null;
  }

  public async getUserByEmailAndPassword(email: string, password: string): Promise<UserType | null> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');
    
    const user = await this.db.get<UserType>(`
      SELECT * FROM users WHERE email = ? AND password = ?
    `, [email, password]);
    
    return user || null;
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

// Export singleton instance
const dbService = SQLiteDatabase.getInstance();

// ตรวจสอบว่าเราอยู่ในสภาพแวดล้อมของ server (ไม่ใช่ browser)
if (typeof window === 'undefined') {
  console.log('Starting database initialization on server...');
  dbService.init().catch(err => console.error('Failed to initialize database:', err));
}

export default dbService;