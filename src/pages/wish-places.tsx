// pages/wish-places.tsx (Updated)
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuth } from '@/contexts/AuthContext';
import BottomNavigation from '@/components/BottomNavigation';
import { useFavorites } from '@/hooks/useFavorites';

import {
  WishPlacesHeader,
  
  WishPlacesList,
} from '@/components/wish-places-components';

import { 
  WishPlace, 
  WISH_PLACES_DATA, 
  WISH_CATEGORIES,
  getPlacesByCategory, 
  searchPlaces 
} from '@/data/wishPlaces';

// หน้าสถานที่ขอตามพร
const WishPlaces: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // State ต่างๆ
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [wishPlaces, setWishPlaces] = useState<WishPlace[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // ใช้ hook สำหรับจัดการ favorites
  const { isFavorite, toggleFavorite } = useFavorites(wishPlaces);
  
  // ตรวจสอบการล็อกอิน
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);
  
  // ดึงข้อมูลสถานที่ขอพร
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const fetchWishPlaces = async () => {
      try {
        // ใช้ข้อมูลจากไฟล์กลาง
        setWishPlaces(WISH_PLACES_DATA);
        setLoading(false);
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
        setLoading(false);
      }
    };
    
    fetchWishPlaces();
  }, [isAuthenticated]);
  
  // กรองสถานที่ตามการค้นหาและหมวดหมู่ที่เลือก
  const filteredPlaces = searchPlaces(searchQuery, activeCategory);
  
  // เพิ่ม isFavorite ให้กับ places ที่กรองแล้ว
  const placesWithFavorites = filteredPlaces.map(place => ({
    ...place,
    isFavorite: isFavorite(place.id)
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

  // ฟังก์ชันจัดการการเปลี่ยนหมวดหมู่
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
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
        <title>สถานที่ขอตามพร - Nummu App</title>
        <meta name="description" content="ค้นหาพระพุทธรูปและสถานที่ศักดิ์สิทธิ์สำหรับขอพรในด้านต่างๆ" />
      </Head>
      
      <div className="min-h-screen bg-gray-100 pb-24">
        {/* ส่วนหัว พร้อมปุ่มหมวดหมู่ */}
        <WishPlacesHeader 
          onBackClick={handleBackClick}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          userName={user?.fullName}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />
        
        {/* Main Content */}
        <div className="px-4 py-4">
          {/* แท็บหมวดหมู่เพิ่มเติม (สำหรับ "ทั้งหมด") */}
          <div className="mb-4">
            {/* <WishCategoryTabs 
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
            /> */}
          </div>
          
          {/* แสดงจำนวนผลลัพธ์ */}
          {/* <div className="mb-4">
            <p className="text-gray-600 text-sm">
              {searchQuery 
                ? `ผลการค้นหา "${searchQuery}" พบ ${placesWithFavorites.length} รายการ`
                : `แสดงทั้งหมด ${placesWithFavorites.length} รายการ`
              }
              {activeCategory !== 'all' && (
                <span className="ml-2 text-[#FF7A05] font-medium">
                  ในหมวด {WISH_CATEGORIES.find(cat => cat.id === activeCategory)?.name.replace('\n', ' ')}
                </span>
              )}
            </p>
          </div> */}
          
          {/* รายการสถานที่ */}
          {placesWithFavorites.length > 0 ? (
            <WishPlacesList 
              places={placesWithFavorites}
              onPlaceClick={handlePlaceClick}
              onToggleFavorite={handleToggleFavorite}
            />
          ) : (
            <div className="text-center py-10">
              <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-4 text-gray-500">
                {searchQuery 
                  ? `ไม่พบสถานที่ที่ตรงกับ "${searchQuery}"`
                  : 'ไม่พบสถานที่ในหมวดหมู่นี้'
                }
              </p>
              {(searchQuery || activeCategory !== 'all') && (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="mt-2 text-[#FF7A05] hover:text-[#FF7A05]/80 text-sm underline"
                >
                  แสดงทั้งหมด
                </button>
              )}
            </div>
          )}
        </div>
        
        <BottomNavigation activePage="profile" />
      </div>
    </>
  );
};

export default WishPlaces;