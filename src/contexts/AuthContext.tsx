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
      
      // ถ้าไม่สำเร็จ จึงลอง NextAuth
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
          console.error('Error fetching user data after NextAuth login:', userError);
        }
      } else if (result?.error) {
        throw new Error(result.error);
      }
      
      throw new Error('Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };
  
  // ล็อกอินด้วย Google
  const loginWithGoogle = async () => {
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
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
      
      throw new Error(response.data.error || 'Signup failed');
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const setPassword = async (password: string) => {
    try {
      if (!tempUserData) {
        throw new Error('No temporary user data found');
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
      
      throw new Error(response.data.error || 'Failed to set password');
    } catch (error) {
      console.error('Set password error:', error);
      throw error;
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