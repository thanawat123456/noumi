import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useAuth } from "@/contexts/AuthContext";
import { CeremonyActivityScreen } from "@/components/ceremony-activity-components";
import Link from "next/link";
import WhiteHeaderProfile from "@/components/header-profile/white-header";

// หน้าแสดงกิจกรรม

const ActivitiesPage: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  const handleBackClick = () => {
    router.push('/dashboard');
  };
  // ตรวจสอบการล็อกอิน
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
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

      <div className="bg-white text-white rounded-b-3xl">
        <WhiteHeaderProfile />
        <div className="bg-[#FF7A05] flex items-center justify-between relative pt-8 pb-20 mt-10 rounded-tl-[50px]">
          <div className="flex items-center space-x-3">
            <Link href="/dashboard" className="mr-2">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
          </div>
          <h2 className="text-3xl font-semibold absolute left-1/2 -translate-x-1/2">
            กิจกรรม
          </h2>
        </div>
      </div>

      {/* ใช้คอมโพเนนต์หลัก */}
      <CeremonyActivityScreen
        type="activity" 
        userName={user?.fullName}
        onBackClick={handleBackClick}
      />
    </>
  );
};

export default ActivitiesPage;
