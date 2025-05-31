// pages/favorites.tsx (Improved version)
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuth } from '@/contexts/AuthContext';
import BottomNavigation from '@/components/BottomNavigation';
import { useFavorites } from '@/hooks/useFavorites';
import { getAllWishPlaces, WishPlace } from '@/utils/wishPlacesData';
import { WishPlacesList } from '@/components/wish-places-components';
import HeaderProfile from '@/components/header-profile/header-profile';
import Link from 'next/link';

// หน้าแสดงสถานที่โปรด
const Favorites: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  
  const [allWishPlaces, setAllWishPlaces] = useState<WishPlace[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // ใช้ hook สำหรับจัดการ favorites
  const { isFavorite, toggleFavorite, getFavoriteIds } = useFavorites(allWishPlaces);
  
  // ตรวจสอบการล็อกอิน
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);
  
  // ดึงข้อมูลสถานที่ขอพรทั้งหมด
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const fetchAllWishPlaces = () => {
      try {
        // ใช้ข้อมูลจาก shared function - ไม่จำเป็นต้องเป็น async
        const allWishPlaces = getAllWishPlaces();
        setAllWishPlaces(allWishPlaces);
        setLoading(false);
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
        setLoading(false);
      }
    };
    
    fetchAllWishPlaces();
  }, [isAuthenticated]);
  
  // กรองเฉพาะสถานที่ที่เป็น favorites
  const favoriteIds = getFavoriteIds();
  const favoritePlaces = allWishPlaces
    .filter(place => favoriteIds.includes(place.id))
    .map(place => ({
      ...place,
      isFavorite: true // เนื่องจากกรองมาแล้วว่าเป็น favorite
    }));
  
  // ฟังก์ชันจัดการการคลิกที่ปุ่มย้อนกลับ
  const handleBackClick = () => {
    router.push('/dashboard');
  };
  
  // ฟังก์ชันจัดการการคลิกที่สถานที่
  const handlePlaceClick = (placeId: number) => {
    router.push(`/information/${placeId}?type=buddha`);
  };
  
  // ฟังก์ชันจัดการการกดถูกใจ
  const handleToggleFavorite = (placeId: number) => {
    toggleFavorite(placeId);
  };
  
  // แสดงการโหลด
  if (isLoading || loading) {
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
        <title>สถานที่โปรด - Nummu App</title>
        <meta name="description" content="สถานที่ขอพรที่คุณใส่ใจไว้" />
      </Head>
      
      <div className="min-h-screen bg-gray-100 pb-24">
        {/* ส่วนหัว */}
        <div className="bg-[#FF7A05] text-white p-4 rounded-br-[130px]">
          <HeaderProfile />

          {/* ชื่อหน้า */}
          <div className="flex items-center justify-between mb-4 relative pt-8 pb-4">
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleBackClick} 
                className="mr-2 hover:bg-orange-600 rounded-full p-1 transition-colors duration-200"
                aria-label="กลับไปหน้าหลัก"
              >
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
              </button>
            </div>
            <h2 className="text-3xl text-nowrap font-semibold absolute left-1/2 -translate-x-1/2">
              สถานที่โปรด
            </h2>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="px-4 py-4">
          {/* แสดงจำนวนสถานที่โปรด */}
          <div className="mb-4">
            <p className="text-gray-600 text-sm">
              รายการสถานที่โปรดของคุณ ({favoritePlaces.length} รายการ)
            </p>
          </div>
          
          {/* รายการสถานที่โปรด */}
          {favoritePlaces.length > 0 ? (
            <WishPlacesList 
              places={favoritePlaces}
              onPlaceClick={handlePlaceClick}
              onToggleFavorite={handleToggleFavorite}
            />
          ) : (
            <div className="text-center py-20">
              <svg 
                className="w-20 h-20 text-gray-300 mx-auto mb-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                />
              </svg>
              <h3 className="text-xl font-medium text-gray-500 mb-2">ยังไม่มีสถานที่โปรด</h3>
              <p className="text-gray-400 mb-6">เริ่มเพิ่มสถานที่ที่คุณชื่นชอบเข้าสู่รายการโปรดของคุณ</p>
              <Link href="/wish-places">
                <button className="bg-[#FF7A05] text-white px-6 py-3 rounded-full font-medium hover:bg-orange-600 transition-colors duration-200">
                  เลือกสถานที่ขอพร
                </button>
              </Link>
            </div>
          )}
        </div>
        
        <BottomNavigation activePage="profile" />
      </div>
    </>
  );
};

export default Favorites;