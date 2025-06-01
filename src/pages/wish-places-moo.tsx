import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuth } from '@/contexts/AuthContext';
import BottomNavigation from '@/components/BottomNavigation';

import {
  WishPlacesHeader,
  WishCategoryTabs,
  WishPlacesList,
} from '@/components/wish-places-components-moo';

// Types
interface WishPlace {
  id: number;
  name: string;
  image: string;
  temple: string;
  wishType: string;
  category: string;
  isFavorite: boolean;
}

// หน้าสถานที่ขอตามพร
const WishPlaces: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // State ต่างๆ
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [wishPlaces, setWishPlaces] = useState<WishPlace[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // ตรวจสอบการล็อกอิน
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);
  
  // ดึงข้อมูลสถานที่ขอพร
  useEffect(() => {
    if (!isAuthenticated) return;
    
    // ในแอปจริง คุณจะดึงข้อมูลจาก API
    const fetchWishPlaces = async () => {
      try {
        // จำลองการดึงข้อมูล
        const mockWishPlaces: WishPlace[] = [
          {
            id: 1,
            name: 'พระศรีศากยมุนี',
            image: '/images/temple-list/พระศรีศากยมุนี.jpg',
            temple: 'วัดสุทัศน์เทพวราราม',
            wishType: 'ภาพรวม<br />ทั่วไป',
            category: 'overview',
            isFavorite: false
          },
          {
            id: 2,
            name: 'พระสุนทรี วาณี',
            image: '/images/temple-list/พระสุนทรีวาณี.jpeg',
            temple: 'วัดสุทัศน์เทพวราราม',
            wishType: 'การงาน<br />การเรียน',
            category: 'work',
            isFavorite: false
          },
          {
            id: 3,
            name: 'พระพุทธตรีโลกเชษฐ์',
            image: '/images/temple-list/พระพุทธตรีโลกเชษฐ์ .jpg',
            temple: 'วัดสุทัศน์เทพวราราม',
            wishType: 'ความรัก<br />คู่ครอง',
            category: 'love',
            isFavorite: false
          },
          {
            id: 4,
            name: 'ท้าวเวสสุวรรณ',
            image: '/images/temple-list/ท้าวเวสุวรรณ.jpg',
            temple: 'วัดสุทัศน์เทพวราราม',
            wishType: 'การเงิน<br />ธุรกิจ',
            category: 'finance',
            isFavorite: true
          },
          {
            id: 5,
            name: 'พระรูปสมเด็จพระสังฆราช',
            image: '/images/temple-list/พระรูปสมเด็จพระสังฆราช.jpeg',
            temple: 'วัดสุทัศน์เทพวราราม',
            wishType: 'โชคลาภ<br />วาสนา',
            category: 'fortune',
            isFavorite: false
          },
          {
            id: 6,
            name: 'พระพุทธเสฏฐมุนี',
            image: '/images/temple-list/พระพุทธเสฏฐมุนี.jpeg',
            temple: 'วัดสุทัศน์เทพวราราม',
            wishType: 'โรคภัย<br />ไข้เจ็บ',
            category: 'health',
            isFavorite: false
          },
          {
            id: 7,
            name: 'ต้นพระศรีมหาโพธิ์',
            image: '/images/temple-list/ต้นพระศรีมหาโพธิ์.jpeg',
            temple: 'วัดสุทัศน์เทพวราราม',
            wishType: 'ภาพรวม<br />ทั่วไป',
            category: 'overview',
            isFavorite: false
          },
          {
            id: 8,
            name: 'พระกริ่งใหญ่',
            image: '/images/temple-list/พระกริ่งใหญ่.jpeg',
            temple: 'วัดสุทัศน์เทพวราราม',
            wishType: 'โชคลาภ<br />วาสนา',
            category: 'fortune',
            isFavorite: false
          }
        ];
        
        setWishPlaces(mockWishPlaces);
        setLoading(false);
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
        setLoading(false);
      }
    };
    
    fetchWishPlaces();
  }, [isAuthenticated]);
  
  // กรองสถานที่ตามการค้นหาและหมวดหมู่ที่เลือก
  const filteredPlaces = wishPlaces.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeCategory === 'all') {
      return matchesSearch;
    }
    
    return matchesSearch && place.category === activeCategory;
  });
  
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
    setWishPlaces(prevPlaces => 
      prevPlaces.map(place => 
        place.id === placeId 
          ? { ...place, isFavorite: !place.isFavorite } 
          : place
      )
    );
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
  
  // ตัวอย่างวิธีที่ 1: ใช้คอมโพเนนต์หลัก WishPlacesScreen
  // return <WishPlacesScreen userName={user?.fullName} />;
  
  // ตัวอย่างวิธีที่ 2: ประกอบคอมโพเนนต์ย่อยด้วยตัวเอง
  return (
    <>
      <Head>
        <title>สถานที่ขอตามพร - Nummu App</title>
        <meta name="description" content="ค้นหาพระพุทธรูปและสถานที่ศักดิ์สิทธิ์สำหรับขอพรในด้านต่างๆ" />
      </Head>
      
      <div className="min-h-screen bg-gray-100 pb-24">
        {/* ส่วนหัว */}
        <WishPlacesHeader 
          onBackClick={handleBackClick}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          userName={user?.fullName}
        />
        
        {/* Main Content */}
        <div className="px-4 py-4">
          {/* แท็บหมวดหมู่ */}
          <div className="mb-4">
            <WishCategoryTabs 
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>
          
          {/* รายการสถานที่ */}
          {filteredPlaces.length > 0 ? (
            <WishPlacesList 
              places={filteredPlaces}
              onPlaceClick={handlePlaceClick}
              onToggleFavorite={handleToggleFavorite}
            />
          ) : (
            <div className="text-center py-10">
              <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-4 text-gray-500">ไม่พบสถานที่ที่คุณกำลังค้นหา</p>
            </div>
          )}
        </div>
        
        <BottomNavigation activePage="profile" />
      </div>
    </>
  );
};

export default WishPlaces;