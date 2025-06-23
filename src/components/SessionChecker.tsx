// components/SessionChecker.tsx - Component สำหรับตรวจสอบ session อย่างต่อเนื่อง

import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

interface SessionCheckerProps {
  children: React.ReactNode;
}

const SessionChecker: React.FC<SessionCheckerProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const { logout } = useAuth();
  const router = useRouter();

  // ฟังก์ชันตรวจสอบอายุ session
  const checkSessionExpiry = () => {
    const userLoginTime = localStorage.getItem('user_login_time');
    
    if (!userLoginTime) {
      return false; // ไม่มีเวลา login = ไม่ได้ login
    }

    const now = Date.now();
    const loginTime = new Date(userLoginTime).getTime();
    const sessionAge = now - loginTime;
    const maxAge = 24 * 60 * 60 * 1000; // 24 ชั่วโมง

    return sessionAge > maxAge;
  };

  // ฟังก์ชัน force logout
  const forceLogout = async (reason: string) => {
    console.log(`SessionChecker: Force logout - ${reason}`);
    
    try {
      await logout();
      router.push('/login?reason=expired');
    } catch (error) {
      console.error('Error during forced logout:', error);
      // Fallback: ล้างข้อมูลและ redirect
      localStorage.removeItem('user');
      localStorage.removeItem('user_login_time');
      await signOut({ redirect: false });
      router.push('/login?reason=expired');
    }
  };

  // ตรวจสอบ session ทันทีเมื่อ component mount
  useEffect(() => {
    if (status === 'authenticated') {
      if (checkSessionExpiry()) {
        forceLogout('Session expired on mount');
      }
    }
  }, [status]);

  // ตั้ง interval สำหรับตรวจสอบ session ทุก 1 นาที
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (status === 'authenticated') {
      intervalId = setInterval(() => {
        if (checkSessionExpiry()) {
          forceLogout('Session expired during interval check');
        }
      }, 60 * 1000); // ตรวจสอบทุก 1 นาที
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [status]);

  // ตรวจสอบเมื่อ user กลับมาที่ tab/window (visibility change)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && status === 'authenticated') {
        if (checkSessionExpiry()) {
          forceLogout('Session expired on visibility change');
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [status]);

  // ตรวจสอบเมื่อ user กลับมาที่ window (focus)
  useEffect(() => {
    const handleFocus = () => {
      if (status === 'authenticated') {
        if (checkSessionExpiry()) {
          forceLogout('Session expired on window focus');
        }
      }
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [status]);

  return <>{children}</>;
};

export default SessionChecker;