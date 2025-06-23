// hooks/useSessionCheck.ts (สร้างไฟล์ใหม่)
import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

export const useSessionCheck = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      // ถ้าไม่มี session
      if (status === 'unauthenticated') {
        console.log('No session found, redirecting to login');
        router.push('/login');
        return;
      }

      // ถ้ามี session แต่ไม่มี user id
      if (status === 'authenticated' && (!session?.user?.id)) {
        console.log('Invalid session found, signing out');
        await signOut({ redirect: false });
        router.push('/login');
        return;
      }

      // ตรวจสอบว่า session หมดอายุหรือไม่
      if (status === 'authenticated' && session?.user?.id) {
        try {
          // เรียก API เพื่อตรวจสอบว่า user ยังมีอยู่ในระบบหรือไม่
          const response = await fetch(`/api/users/${session.user.id}`);
          
          if (!response.ok) {
            console.log('Session validation failed, signing out');
            await signOut({ redirect: false });
            router.push('/login');
            return;
          }
        } catch (error) {
          console.error('Error checking session:', error);
          await signOut({ redirect: false });
          router.push('/login');
        }
      }
    };

    // ตรวจสอบทันทีเมื่อ component mount
    if (status !== 'loading') {
      checkSession();
    }

    // ตั้ง interval เพื่อตรวจสอบทุก 5 นาที
    const interval = setInterval(checkSession, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [session, status, router]);

  return { session, status };
};

// การใช้งานใน component:
// import { useSessionCheck } from '@/hooks/useSessionCheck';
// 
// function ProtectedPage() {
//   const { session, status } = useSessionCheck();
//   
//   if (status === 'loading') {
//     return <div>Loading...</div>;
//   }
//   
//   return <div>Protected content</div>;
// }