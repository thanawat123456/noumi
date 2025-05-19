import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuth } from '@/contexts/AuthContext';
import { CeremonyActivityScreen } from '@/components/ceremony-activity-components';

// หน้าแสดงกิจกรรม
const ActivitiesPage: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

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
        <title>กิจกรรม - Nummu App</title>
        <meta name="description" content="กิจกรรมต่างๆ ในพุทธศาสนา" />
      </Head>
      
      {/* ใช้คอมโพเนนต์หลัก */}
      <CeremonyActivityScreen 
        type="activity"
        userName={user?.fullName}
      />
    </>
  );
};

export default ActivitiesPage;