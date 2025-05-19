// src/components/dashboard/Layout.tsx
import { ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export default function Layout({ children, title = 'Nummu App' }: LayoutProps) {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>
      
      <div className="min-h-screen flex flex-col">
        <header className="bg-pink-500 text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="font-bold text-xl">Nummu</h1>
            <button 
              onClick={handleLogout}
              className="text-white hover:text-pink-200"
            >
              ออกจากระบบ
            </button>
          </div>
        </header>
        
        <main className="flex-grow p-4 container mx-auto">
          {children}
        </main>
        
        <footer className="bg-pink-100 p-4 border-t border-pink-200">
          <div className="container mx-auto">
            <nav className="flex justify-around">
              <Link href="/dashboard" className={`text-pink-500 flex flex-col items-center ${router.pathname === '/dashboard' ? 'font-bold' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-xs">หน้าหลัก</span>
              </Link>
              
              <Link href="/dashboard/profile" className={`text-pink-500 flex flex-col items-center ${router.pathname === '/dashboard/profile' ? 'font-bold' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-xs">โปรไฟล์</span>
              </Link>
              
              <Link href="/dashboard/settings" className={`text-pink-500 flex flex-col items-center ${router.pathname === '/dashboard/settings' ? 'font-bold' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-xs">ตั้งค่า</span>
              </Link>
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}