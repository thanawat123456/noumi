import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuth } from '@/contexts/AuthContext';
import { TicketScreen } from '@/components/ticket-components';

// หน้าซื้อตั๋ว
const TicketsPage: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // ฟังก์ชันสำหรับปุ่มย้อนกลับ
  const handleBackClick = () => {
    router.push('/dashboard');
  };
  
  // ตรวจสอบการล็อกอิน
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // แสดงการโหลด
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-orange-500">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>ซื้อตั๋ว - Nummu App</title>
        <meta name="description" content="ซื้อตั๋วเข้าชมสถานที่ศักดิ์สิทธิ์และพิพิธภัณฑ์" />
      </Head>
      
      {/* ใช้คอมโพเนนต์หลัก */}
      <TicketScreen 
        userName={user?.fullName}
        onBackClick={handleBackClick}
      />
    </>
  );
};

export default TicketsPage;