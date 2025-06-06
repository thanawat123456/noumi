import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { signIn, signOut, useSession } from 'next-auth/react';

// เพิ่ม interface นี้เพื่อขยาย Session User Type
interface CustomUser {
  id?: string | number;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (userData: UserSignupData) => Promise<void>;
  setPassword: (password: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface User {
  id: number;
  email: string;
  phone?: string;
  birthDate?: string;
  elementType?: string;
  zodiacSign?: string;
  bloodGroup?: string;
  fullName?: string; 
  dayOfBirth?: string;
  avatar?: string | null;
}

interface UserSignupData {
  email: string;
  phone?: string;
  birthDate?: string;
  elementType?: string;
  zodiacSign?: string;
  bloodGroup?: string;
  fullName?: string; 
  dayOfBirth?: string; 
  avatar?: string | null; 
}

// Custom error class สำหรับจัดการ error ที่เป็นมิตรกับผู้ใช้
class AuthError extends Error {
  public statusCode: number;
  public userMessage: string;

  constructor(message: string, statusCode: number = 500, userMessage?: string) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
    this.userMessage = userMessage || message;
  }
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  loginWithGoogle: async () => {},
  signup: async () => {},
  setPassword: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

let tempUserData: UserSignupData | null = null;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // ใช้ session จาก NextAuth
  const { data: session, status } = useSession();

  useEffect(() => {
    const init = async () => {
      try {
        // ถ้ามี session จาก NextAuth ให้ใช้ข้อมูลจาก session
        if (status === 'authenticated' && session && session.user) {
          console.log("Using session data:", session.user);
          
          // รับค่า user จาก session.user (เราต้อง cast เป็น CustomUser)
          const sessionUser = session.user as CustomUser;
          
          // ถ้ามี id ใน sessionUser
          if (sessionUser.id) {
            const userFromSession: User = {
              id: typeof sessionUser.id === 'string' ? parseInt(sessionUser.id) : sessionUser.id as number,
              email: sessionUser.email || '',
              fullName: sessionUser.name || '',
              avatar: sessionUser.image || null,
              // ข้อมูลอื่นๆ จะถูกเติมจาก API หรือจัดการในฝั่ง server
            };
            
            setUser(userFromSession);
            setIsAuthenticated(true);
            
            // ยังคงเก็บใน localStorage สำหรับความเข้ากันได้กับระบบเดิม
            localStorage.setItem('user', JSON.stringify(userFromSession));
          } else {
            // กรณีไม่มี id ใน session.user เราต้องขอข้อมูลเพิ่มเติมจาก API
            try {
              const response = await axios.get('/api/auth/session-user', {
                params: { email: sessionUser.email }
              });
              
              if (response.data.success && response.data.user) {
                setUser(response.data.user);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setIsAuthenticated(true);
              }
            } catch (error) {
              console.error("Failed to get user data from API:", error);
            }
          }
        } 
        // ถ้าไม่มี session แต่มีข้อมูลใน localStorage ให้ใช้ข้อมูลจาก localStorage
        else if (status === 'unauthenticated' && typeof window !== 'undefined') {
          const savedUser = localStorage.getItem('user');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        if (status !== 'loading') {
          setIsLoading(false);
        }
      }
    };

    init();
  }, [session, status]);

  // ฟังก์ชันสำหรับแปลง error ให้เป็นมิตรกับผู้ใช้
  const handleApiError = (error: any): AuthError => {
    // ป้องกันไม่ให้ error ขึ้นใน console
    console.warn('Authentication attempt failed (this is normal)');
    
    if (error.response) {
      const status = error.response.status;
      const errorMessage = error.response.data?.error || error.response.data?.message || 'Unknown error';
      
      switch (status) {
        case 400:
          return new AuthError(
            'Bad Request', 
            400, 
            'ข้อมูลที่ส่งมาไม่ถูกต้อง กรุณาตรวจสอบรูปแบบอีเมลและรหัสผ่าน'
          );
        case 401:
          return new AuthError(
            'Unauthorized', 
            401, 
            'ไม่พบข้อมูลผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
          );
        case 403:
          return new AuthError(
            'Forbidden', 
            403, 
            'ไม่มีสิทธิ์เข้าถึง'
          );
        case 404:
          return new AuthError(
            'Not Found', 
            404, 
            'ไม่พบข้อมูลผู้ใช้ในระบบ'
          );
        case 429:
          return new AuthError(
            'Too Many Requests', 
            429, 
            'คุณได้ลองเข้าสู่ระบบหลายครั้งเกินไป กรุณารอสักครู่แล้วลองใหม่'
          );
        case 500:
        case 502:
        case 503:
        case 504:
          return new AuthError(
            'Server Error', 
            status, 
            'เซิร์ฟเวอร์มีปัญหาชั่วคราว กรุณาลองใหม่อีกครั้งในภายหลัง'
          );
        default:
          return new AuthError(
            errorMessage, 
            status, 
            'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'
          );
      }
    } else if (error.request) {
      return new AuthError(
        'Network Error', 
        0, 
        'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต'
      );
    } else {
      return new AuthError(
        error.message || 'Unknown Error', 
        0, 
        'เกิดข้อผิดพลาดที่ไม่คาดคิด'
      );
    }
  };

  // ล็อกอินด้วย email/password
  const login = async (email: string, password: string) => {
    try {
      // เริ่มจากการใช้ API แบบเดิมก่อน
      const response = await axios.post('/api/auth/login', {
        email,
        password
      });
  
      if (response.data.success && response.data.user) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setIsAuthenticated(true);
        return;
      }
      
      throw new AuthError('Login failed', 401, 'การเข้าสู่ระบบไม่สำเร็จ');
    } catch (error: any) {
      // จัดการ error ด้วย axios แล้วลอง NextAuth
      if (error.response?.status === 401 || error.response?.status === 404) {
        try {
          const result = await signIn('credentials', {
            email,
            password,
            redirect: false
          });
          
          // ตรวจสอบผลลัพธ์จาก NextAuth
          if (result?.ok) {
            // NextAuth สำเร็จ - ควรเรียก API เพื่อรับข้อมูลผู้ใช้เพิ่มเติม
            try {
              const userResponse = await axios.get('/api/auth/session-user');
              if (userResponse.data.success && userResponse.data.user) {
                setUser(userResponse.data.user);
                localStorage.setItem('user', JSON.stringify(userResponse.data.user));
                setIsAuthenticated(true);
                return;
              }
            } catch (userError) {
              console.warn('Error fetching user data after NextAuth login');
            }
          } else if (result?.error) {
            throw new AuthError(result.error, 401, 'การเข้าสู่ระบบไม่สำเร็จ');
          }
        } catch (nextAuthError) {
          // ถ้า NextAuth ก็ไม่ได้ ให้ throw original error
        }
      }
      
      // แปลง error ให้เป็นมิตรกับผู้ใช้
      throw handleApiError(error);
    }
  };
  
  // ล็อกอินด้วย Google
  const loginWithGoogle = async () => {
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (error) {
      console.warn('Google login attempt failed');
      throw new AuthError(
        'Google Login Failed', 
        500, 
        'เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Google กรุณาลองใหม่อีกครั้ง'
      );
    }
  };

  // ฟังก์ชันอื่นๆ คงเดิม...
  const signup = async (userData: UserSignupData) => {
    try {
      const response = await axios.post('/api/auth/signup', userData);
      
      if (response.data.success) {
        tempUserData = { ...userData };
        return;
      }
      
      throw new AuthError(
        response.data.error || 'Signup failed', 
        400, 
        'การสมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'
      );
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const setPassword = async (password: string) => {
    try {
      if (!tempUserData) {
        throw new AuthError(
          'No temporary user data found', 
          400, 
          'ไม่พบข้อมูลชั่วคราว กรุณาเริ่มกระบวนการสมัครใหม่'
        );
      }
      
      console.log("Sending data to API:", {
        userData: tempUserData,
        password: password
      });
      
      const response = await axios.post('/api/auth/set-password', {
        userData: tempUserData,
        password
      });
  
      if (response.data.success && response.data.user) {
        // ตั้งค่าข้อมูลผู้ใช้จาก response
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setIsAuthenticated(true);
  
        // ล้างข้อมูลชั่วคราว
        tempUserData = null;
        return;
      }
      
      throw new AuthError(
        response.data.error || 'Failed to set password', 
        400, 
        'การตั้งรหัสผ่านไม่สำเร็จ'
      );
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const logout = async () => {
    try {
      // ล็อกเอาท์จาก NextAuth
      await signOut({ redirect: false });
      
      // ล้างข้อมูลผู้ใช้
      setUser(null);
      localStorage.removeItem('user');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        loginWithGoogle,
        signup,
        setPassword,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};