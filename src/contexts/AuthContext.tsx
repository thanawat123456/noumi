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
  updateUser: (userData: User) => Promise<void>; // *** เปลี่ยนเป็น async function ***
  refreshUserData: () => Promise<void>; // *** เพิ่มฟังก์ชันรีเฟรชข้อมูล ***
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
  updateUser: async () => {}, // *** เปลี่ยนเป็น async ***
  refreshUserData: async () => {}, // *** เพิ่มฟังก์ชันใหม่ ***
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

let tempUserData: UserSignupData | null = null;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // ใช้ session จาก NextAuth
  const { data: session, status, update: updateSession } = useSession();

  // // *** เพิ่มฟังก์ชันสำหรับรีเฟรชข้อมูลผู้ใช้จาก database ***
  // const refreshUserData = async (): Promise<void> => {
  //   try {
  //     if (session?.user?.id) {
  //       const response = await axios.get(`/api/users/${session.user.id}`);
  //       if (response.data.success && response.data.user) {
  //         const freshUser = response.data.user;
  //         setUser(freshUser);
  //         localStorage.setItem('user', JSON.stringify(freshUser));
          
  //         // *** อัปเดต session ด้วยข้อมูลใหม่ ***
  //         await updateSession({
  //           ...session,
  //           user: {
  //             ...session.user,
  //             name: freshUser.fullName,
  //             image: freshUser.avatar
  //           }
  //         });
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Failed to refresh user data:', error);
  //   }
  // };

  // AuthContext.tsx - แก้ไขส่วน useEffect

// AuthContext.tsx - แก้ไขส่วน useEffect

useEffect(() => {
  const init = async () => {
    try {
      // *** ตรวจสอบ session validity ก่อน ***
      if (status === 'authenticated' && session && session.user?.id) {
        console.log("Session authenticated, checking validity for user ID:", session.user.id);
        
        // *** ตรวจสอบว่า session ยังใช้ได้หรือไม่โดยเรียก API ***
        try {
         const response = await axios.get(`/api/users/${session.user.id}`, {
            withCredentials: true
          });

          if (response.data.success && response.data.user) {
            const freshUser = response.data.user;
            setUser(freshUser);
            localStorage.setItem('user', JSON.stringify(freshUser));
            setIsAuthenticated(true);
            console.log("User data loaded from API:", freshUser.email);
          } else {
            console.warn("User not found in database, session invalid");
            throw new Error('User not found');
          }
        } catch (apiError: any) {
          console.error('Session validation failed:', apiError);
          
          // *** บังคับ logout เมื่อ session ไม่ valid ***
          console.log("Forcing logout due to invalid session");
          await signOut({ redirect: false });
          localStorage.removeItem('user');
          setUser(null);
          setIsAuthenticated(false);
          
          // *** redirect ไปหน้า login ***
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return;
        }
      } 
      // ถ้าไม่มี session
      else if (status === 'unauthenticated') {
        console.log("No valid session found");
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          console.log("Clearing expired localStorage data");
          localStorage.removeItem('user');
        }
        setUser(null);
        setIsAuthenticated(false);
      }
      // ถ้า session status ยัง loading
      else if (status === 'loading') {
        console.log("Session is loading...");
        return;
      }
      
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      // *** ล้างข้อมูลและ logout เมื่อเกิด error ***
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
      await signOut({ redirect: false });
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
    console.log('🚀 Starting login for:', email);
    
    // ใช้ NextAuth เป็นหลัก เพราะมัน handle session ให้
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false // สำคัญ! ไม่ให้ redirect อัตโนมัติ
    });
    
    console.log('NextAuth signIn result:', result);
    
    if (result?.ok && !result?.error) {
      console.log('✅ NextAuth login successful');
      
      // รอให้ session update และ middleware ไม่ block
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return; // สำเร็จแล้ว - ไม่ต้องจัดการ state ที่นี่
    }
    
    // ถ้า NextAuth ไม่สำเร็จ แสดง error
    if (result?.error) {
      console.log('❌ NextAuth error:', result.error);
      if (result.error === 'CredentialsSignin') {
        throw new AuthError('Invalid credentials', 401, 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      } else {
        throw new AuthError(result.error, 401, 'การเข้าสู่ระบบไม่สำเร็จ');
      }
    }
    
    // fallback error
    throw new AuthError('Login failed', 401, 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    
  } catch (error: any) {
    console.error('❌ Login failed:', error);
    
    // ล้างข้อมูล
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    
    // Re-throw error สำหรับ UI
    if (error instanceof AuthError) {
      throw error;
    } else {
      throw new AuthError(
        error.message || 'Login failed',
        500,
        'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'
      );
    }
  }
};
  
  // ล็อกอินด้วย Google
  const loginWithGoogle = async () => {
    try {
      await signIn('google', { callbackUrl: '/settings' });
    } catch (error) {
      console.warn('Google login attempt failed');
      throw new AuthError(
        'Google Login Failed', 
        500, 
        'เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Google กรุณาลองใหม่อีกครั้ง'
      );
    }
  };

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

// AuthContext.tsx - แก้ไขส่วน updateUser และ refreshUserData

const updateUser = async (userData: User): Promise<void> => {
  try {
    console.log('AuthContext: Starting updateUser with:', userData);
    
    if (!userData.id) {
      throw new Error('User ID is required for update');
    }

    // *** ใช้ API ที่มีอยู่แล้ว: /api/users/[id] ***
    const response = await axios.put(`/api/users/${userData.id}`, {
      email: userData.email,
      phone: userData.phone,
      fullName: userData.fullName,
      birthDate: userData.birthDate,
      dayOfBirth: userData.dayOfBirth,
      elementType: userData.elementType,
      zodiacSign: userData.zodiacSign,
      bloodGroup: userData.bloodGroup,
      avatar: userData.avatar
      },
      {
        withCredentials: true
      }
    );

    console.log('API Response:', response.data);

    if (response.data.success && response.data.user) {
      const updatedUser = response.data.user;
      
      // อัปเดต local state
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      console.log('Local state updated with:', updatedUser);
      
      // อัปเดต NextAuth session
      if (session?.user) {
        try {
          await updateSession({
            ...session,
            user: {
              ...session.user,
              name: updatedUser.fullName || session.user.name,
              image: updatedUser.avatar || session.user.image,
              email: updatedUser.email || session.user.email
            }
          });
          console.log('NextAuth session updated successfully');
        } catch (sessionError) {
          console.warn('Failed to update session:', sessionError);
          // ไม่ throw error เพราะข้อมูลหลักอัปเดตสำเร็จแล้ว
        }
      }
      
    } else {
      throw new Error(response.data.error || 'Update failed');
    }
    
  } catch (error: any) {
    console.error('AuthContext: Failed to update user:', error);
    
    // รีโหลดข้อมูลเดิมจาก database เพื่อให้แน่ใจว่าข้อมูลตรงกัน
    try {
      await refreshUserData();
    } catch (refreshError) {
      console.error('Failed to refresh user data:', refreshError);
    }
    
    throw new Error(
      error.response?.data?.error || 
      error.message || 
      'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
    );
  }
};

const refreshUserData = async (): Promise<void> => {
  try {
    if (session?.user?.id) {
      console.log('Refreshing user data for ID:', session.user.id);
      
      // *** ใช้ API ที่มีอยู่แล้ว ***
      const response = await axios.get(`/api/users/${session.user.id}`, {
        withCredentials: true
      });

      if (response.data.success && response.data.user) {
        const freshUser = response.data.user;
        setUser(freshUser);
        localStorage.setItem('user', JSON.stringify(freshUser));
        console.log('User data refreshed:', freshUser.email);
        
        // อัปเดต session ด้วยข้อมูลใหม่
        if (session?.user) {
          await updateSession({
            ...session,
            user: {
              ...session.user,
              name: freshUser.fullName,
              image: freshUser.avatar,
              email: freshUser.email
            }
          });
        }
      }
    }
  } catch (error) {
    console.error('Failed to refresh user data:', error);
    // ไม่ throw error เพื่อไม่ให้กระทบ UX
  }
};

// *** ปรับปรุง logout method เพื่อป้องกันปัญหา Google Login ***
const logout = async () => {
  try {
    console.log('Starting logout process...');
    
    // ล้างข้อมูล localStorage และ state ก่อน
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    
    // ล็อกเอาท์จาก NextAuth พร้อมล้าง cookies ทั้งหมด
    await signOut({ 
      redirect: false,
      callbackUrl: '/login'
    });
    
    // *** เพิ่มการล้าง cookies เพิ่มเติมสำหรับ Google ***
    if (typeof window !== 'undefined') {
      // ล้าง cookies ที่เกี่ยวข้องกับ auth
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
    }
    
    console.log('Logout completed successfully');
    
  } catch (error) {
    console.error('Logout error:', error);
    // แม้ logout ล้มเหลว ก็ยังล้างข้อมูล local
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
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
        updateUser, // *** ตอนนี้เป็น async function แล้ว ***
        refreshUserData, // *** เพิ่มฟังก์ชันใหม่ ***
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};