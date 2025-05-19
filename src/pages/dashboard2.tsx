import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';

// Dashboard Page (Home screen after login)
export default function Dashboard2() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [newsCategory, setNewsCategory] = useState('ALL');
  const [loading, setLoading] = useState(false);
  
  // Redirect to login if not authenticated
  
  const handleCategoryClick = (category: string) => {
    router.push(`/sacred-places`);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
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
        <title>หน้าแรก - Nummu App</title>
        <meta name="description" content="Nummu App - แอพพลิเคชั่นสำหรับการท่องเที่ยววัดและสถานที่ศักดิ์สิทธิ์" />
      </Head>
      
      <div className="min-h-screen bg-gray-100 pb-20">
        {/* Header */}
        <div className="bg-orange-500 text-white p-4 rounded-b-3xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white">
                <img 
                  src={user?.avatar || "/api/placeholder/48/48"}
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-white text-sm">สวัสดี,ยินดีต้อนรับ</p>
                <h3 className="text-white text-xl font-medium">{user?.fullName || "Praewwy :)"}</h3>
              </div>
            </div>
            <div className="flex space-x-3">
              <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="mt-4">
            <h2 className="text-white text-lg">
              Nummu นำใจ นำพาคุณ<br />
              ตามหาแหล่งที่พึ่งพาทางจิตใจและเข้าถึง<br />
              การไหว้พระ ขอพร ที่สะดวก ง่าย ในที่เดียว
            </h2>
          </div>
          
          {/* Search Bar */}
          <div className="mt-6 relative">
            <div className="flex items-center bg-white rounded-full px-4 py-2">
              <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
              <input 
                type="text" 
                placeholder="ค้นหา..." 
                className="flex-1 bg-transparent border-none focus:outline-none px-3 text-gray-700"
              />
              <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          {/* Categories */}
          <div className="mt-8 grid grid-cols-4 gap-4 pb-4">
            <button 
              className="flex flex-col items-center justify-center bg-white rounded-full py-4 px-2"
              onClick={() => handleCategoryClick('sacred')}
            >
              <div className="mb-2">
                <svg className="w-12 h-12 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-orange-500 text-center text-sm font-medium">สถานที่ศักดิ์สิทธิ์</p>
            </button>
            
            <button 
              className="flex flex-col items-center justify-center bg-white rounded-full py-4 px-2"
              onClick={() => router.push('/fortune-places')}
            >
              <div className="mb-2">
                <svg className="w-12 h-12 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <p className="text-orange-500 text-center text-sm font-medium">สถานที่ขอดวงพร</p>
            </button>
            
            <button 
              className="flex flex-col items-center justify-center bg-white rounded-full py-4 px-2"
              onClick={() => router.push('/ritual-places')}
            >
              <div className="mb-2">
                <svg className="w-12 h-12 text-orange-200" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-orange-500 text-center text-sm font-medium">สถานที่พิธีกรรม</p>
            </button>
            
            <button 
              className="flex flex-col items-center justify-center bg-white rounded-full py-4 px-2"
              onClick={() => router.push('/activity-places')}
            >
              <div className="mb-2">
                <svg className="w-12 h-12 text-orange-200" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="7" r="4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 21v-2a4 4 0 00-3-3.87" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 3.13a4 4 0 010 7.75" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-orange-500 text-center text-sm font-medium">สถานที่กิจกรรม</p>
            </button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="px-4 py-6">
          {/* News Section */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-orange-500">ข่าวสาร</h2>
            <Link href="/news" className="text-pink-500 text-sm">
              View All
            </Link>
          </div>
          
          {/* News Categories */}
          <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
            <button 
              className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                newsCategory === 'ALL' 
                  ? 'bg-pink-400 text-white' 
                  : 'bg-pink-100 text-pink-500'
              }`}
              onClick={() => setNewsCategory('ALL')}
            >
              ALL
            </button>
            <button 
              className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                newsCategory === 'FESTIVAL' 
                  ? 'bg-pink-400 text-white' 
                  : 'bg-pink-100 text-pink-500'
              }`}
              onClick={() => setNewsCategory('FESTIVAL')}
            >
              FESTIVAL
            </button>
            <button 
              className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                newsCategory === 'TRIVIA' 
                  ? 'bg-pink-400 text-white' 
                  : 'bg-pink-100 text-pink-500'
              }`}
              onClick={() => setNewsCategory('TRIVIA')}
            >
              TRIVIA
            </button>
            <button 
              className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                newsCategory === 'ABOUT' 
                  ? 'bg-pink-400 text-white' 
                  : 'bg-pink-100 text-pink-500'
              }`}
              onClick={() => setNewsCategory('ABOUT')}
            >
              เกี่ยวกับเรา
            </button>
          </div>
          
          {/* News Cards */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl overflow-hidden shadow-md">
              <img 
                src="/api/placeholder/400/200" 
                alt="Festival News" 
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <span className="inline-block bg-pink-100 text-pink-500 px-3 py-1 rounded-full text-xs mb-2">
                  FESTIVAL
                </span>
                <h3 className="font-medium text-lg text-gray-800">เทศกาลสงกรานต์ 2567</h3>
                <p className="text-gray-600 text-sm mt-1">
                  รวมกิจกรรมและวัดที่จัดงานสงกรานต์ทั่วประเทศ พร้อมแนะนำวิธีไหว้พระขอพรในช่วงสงกรานต์
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-gray-500 text-xs">15 เมษายน 2567</span>
                  <button className="text-pink-500 text-sm font-medium">อ่านเพิ่มเติม</button>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl overflow-hidden shadow-md">
              <img 
                src="/api/placeholder/400/200" 
                alt="Trivia News" 
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <span className="inline-block bg-pink-100 text-pink-500 px-3 py-1 rounded-full text-xs mb-2">
                  TRIVIA
                </span>
                <h3 className="font-medium text-lg text-gray-800">ประวัติวัดพระศรีรัตนศาสดาราม (วัดพระแก้ว)</h3>
                <p className="text-gray-600 text-sm mt-1">
                  เรียนรู้ประวัติความเป็นมาและความสำคัญของวัดพระแก้ว พระอารามหลวงอันเป็นที่เคารพบูชา
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-gray-500 text-xs">8 เมษายน 2567</span>
                  <button className="text-pink-500 text-sm font-medium">อ่านเพิ่มเติม</button>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl overflow-hidden shadow-md">
              <img 
                src="/api/placeholder/400/200" 
                alt="About Us" 
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <span className="inline-block bg-pink-100 text-pink-500 px-3 py-1 rounded-full text-xs mb-2">
                  เกี่ยวกับเรา
                </span>
                <h3 className="font-medium text-lg text-gray-800">Nummu App เวอร์ชันใหม่ พร้อมฟีเจอร์ที่น่าสนใจ</h3>
                <p className="text-gray-600 text-sm mt-1">
                  อัปเดตเวอร์ชันใหม่ของ Nummu App พร้อมฟีเจอร์ใหม่ที่น่าสนใจ และประสบการณ์การใช้งานที่ดีขึ้น
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-gray-500 text-xs">1 เมษายน 2567</span>
                  <button className="text-pink-500 text-sm font-medium">อ่านเพิ่มเติม</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3">
          <Link href="/dashboard" className="flex flex-col items-center text-pink-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs mt-1">หน้าแรก</span>
          </Link>
          <Link href="/merit" className="flex flex-col items-center text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs mt-1">ทำบุญ</span>
          </Link>
          <Link href="/fortunes" className="flex flex-col items-center text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <span className="text-xs mt-1">ดวง</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs mt-1">โปรไฟล์</span>
          </Link>
        </nav>
      </div>
    </>
  );
}