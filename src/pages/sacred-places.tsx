import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import BottomNavigation from '@/components/BottomNavigation';

// Types
interface Temple {
  id: number;
  name: string;
  image: string;
  address?: string;
  description?: string;
  highlighted: boolean;
}

interface BuddhaStatue {
  id: number;
  name: string;
  templeId: number;
  templeName: string;
  image: string;
  benefits: string[];
  description?: string;
  popular: boolean;
}

// Sacred Places Page (shows all temples)
export default function SacredPlaces() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('ทั้งหมด');
  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const tabs = ['ทั้งหมด', 'นิยม', 'ใหม่'];
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);
  
  // Fetch temples data
  useEffect(() => {
    const fetchTemples = async () => {
      try {
        // In a real app, replace with actual API call
        // const response = await axios.get('/api/temples');
        // setTemples(response.data);
        
        // Simulated data
        setTemples([
          {
            id: 1,
            name: 'วัดสุทัศน์เทพวราราม',
            image: '/api/placeholder/300/200',
            address: 'แขวงวัดราชบพิธ เขตพระนคร กรุงเทพมหานคร',
            description: 'วัดสุทัศน์เทพวรารามเป็นพระอารามหลวงชั้นเอก ชนิดราชวรมหาวิหาร เป็นวัดที่พระบาทสมเด็จพระพุทธยอดฟ้าจุฬาโลกมหาราช รัชกาลที่ 1 โปรดให้สร้างขึ้น',
            highlighted: true
          },
          {
            id: 2,
            name: 'ศาลเจ้าหัวเวียง',
            image: '/api/placeholder/300/200',
            address: 'ถนนสาทรใต้ แขวงยานนาวา เขตสาทร กรุงเทพมหานคร',
            description: 'ศาลเจ้าโบราณที่มีความสำคัญและเก่าแก่ของชุมชนจีนในย่านเจริญกรุง',
            highlighted: false
          },
          {
            id: 3,
            name: 'วัดพระแก้ว',
            image: '/api/placeholder/300/200',
            address: 'ถนนหน้าพระลาน แขวงพระบรมมหาราชวัง เขตพระนคร กรุงเทพมหานคร',
            description: 'วัดพระศรีรัตนศาสดาราม หรือที่เรียกกันทั่วไปว่า "วัดพระแก้ว" เป็นวัดที่มีความสำคัญมากที่สุดแห่งหนึ่งในประเทศไทย',
            highlighted: false
          },
          {
            id: 4,
            name: 'หอสวดมนตร์',
            image: '/api/placeholder/300/200',
            address: 'ถนนราชดำเนินนอก เขตป้อมปราบศัตรูพ่าย กรุงเทพมหานคร',
            description: 'สถานที่สำหรับเข้าปฏิบัติธรรมและสวดมนตร์',
            highlighted: false
          }
        ]);
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch temples:', error);
        setLoading(false);
      }
    };
    
    if (isAuthenticated) {
      fetchTemples();
    }
  }, [isAuthenticated]);
  
  // Filter temples based on search query and active tab
  const filteredTemples = temples.filter(temple => {
    const matchesSearch = temple.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'ทั้งหมด') {
      return matchesSearch;
    } else if (activeTab === 'นิยม') {
      // This would normally use a popularity metric from your API
      return matchesSearch && temple.highlighted;
    } else if (activeTab === 'ใหม่') {
      // This would normally use a creation date from your API
      return matchesSearch && !temple.highlighted;
    }
    
    return matchesSearch;
  });
  
  const handleTempleClick = (templeId: number) => {
    router.push(`/sacred-places/${templeId}`);
  };
  
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
        <title>สถานที่ศักดิ์สิทธิ์ - Nummu App</title>
        <meta name="description" content="ค้นหาสถานที่ศักดิ์สิทธิ์ทั่วประเทศไทย" />
      </Head>
      
      <div className="min-h-screen bg-gray-100 pb-20">
        {/* Header */}
        <div className="bg-orange-500 text-white p-4 rounded-b-3xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Link href="/dashboard" className="mr-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h2 className="text-2xl font-semibold">สถานที่</h2>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white">
                <img 
                  src={user?.avatar || "/api/placeholder/40/40"}
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <input 
              type="text" 
              placeholder="ค้นหาชื่อวัด..." 
              className="w-full bg-white rounded-full px-10 py-2 text-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="px-4 py-6">
          {/* Tabs */}
          <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
            {tabs.map(tab => (
              <button
                key={tab}
                className={`px-6 py-2 rounded-full text-sm font-medium ${
                  activeTab === tab 
                    ? 'bg-pink-400 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          
          {/* Temple List */}
          {filteredTemples.length > 0 ? (
            <div className="space-y-4">
              {filteredTemples.map(temple => (
                <div 
                  key={temple.id} 
                  className={`rounded-xl overflow-hidden ${
                    temple.highlighted ? 'bg-yellow-300' : 'bg-gray-200'
                  } cursor-pointer shadow-md transition transform hover:scale-105`}
                  onClick={() => handleTempleClick(temple.id)}
                >
                  <div className="flex h-24">
                    <div className="flex-1 p-4 flex flex-col justify-center">
                      <h3 className={`font-medium text-lg ${
                        temple.highlighted ? 'text-orange-600' : 'text-gray-700'
                      }`}>
                        {temple.name}
                      </h3>
                    </div>
                    <div className="w-1/2">
                      <img 
                        src={temple.image} 
                        alt={temple.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-4 text-gray-500">ไม่พบวัดที่คุณกำลังค้นหา</p>
            </div>
          )}
        </div>
        
        <BottomNavigation activePage="profile" />

      </div>
    </>
  );
}