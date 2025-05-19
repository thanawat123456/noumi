import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import BottomNavigation from '@/components/BottomNavigation';

// Types
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

interface Temple {
  id: number;
  name: string;
  image: string;
  address?: string;
  description?: string;
}

// Buddha Statues Page (shows all Buddha statues in a temple)
export default function TempleBuddhaStatues() {
  const router = useRouter();
  const { templeId } = router.query;
  const { user, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('ทั้งหมด');
  const [temple, setTemple] = useState<Temple | null>(null);
  const [buddhaStatues, setBuddhaStatues] = useState<BuddhaStatue[]>([]);
  const [loading, setLoading] = useState(true);
  
  const tabs = ['ทั้งหมด', 'ที่นิยม'];
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);
  
  // Fetch temple and Buddha statues data
  useEffect(() => {
    const fetchData = async () => {
      if (!templeId || !isAuthenticated) return;
      
      try {
        // In a real app, these would be actual API calls
        // const templeResponse = await axios.get(`/api/temples/${templeId}`);
        // const statuesResponse = await axios.get(`/api/temples/${templeId}/buddha-statues`);
        
        // Simulated data
        // Set temple data
        setTemple({
          id: Number(templeId),
          name: 'วัดสุทัศน์เทพวราราม',
          image: '/api/placeholder/400/200',
          address: 'แขวงวัดราชบพิธ เขตพระนคร กรุงเทพมหานคร',
          description: 'วัดสุทัศน์เทพวรารามเป็นพระอารามหลวงชั้นเอก ชนิดราชวรมหาวิหาร'
        });
        
        // Set Buddha statues data
        setBuddhaStatues([
          {
            id: 1,
            name: 'พระศรีศากยมุนี',
            templeId: Number(templeId),
            templeName: 'วัดสุทัศน์เทพวราราม',
            image: '/api/placeholder/150/150',
            benefits: ['ภาพรวมถึงบ้าน'],
            description: 'พระพุทธรูปประธานในพระอุโบสถ',
            popular: true
          },
          {
            id: 2,
            name: 'พระสุนทรี วาณี',
            templeId: Number(templeId),
            templeName: 'วัดสุทัศน์เทพวราราม',
            image: '/api/placeholder/150/150',
            benefits: ['การงานการเรียน'],
            description: 'พระพุทธรูปประจำวิหารด้านทิศตะวันออก',
            popular: true
          },
          {
            id: 3,
            name: 'พระพุทธรังสีมุนราชัย',
            templeId: Number(templeId),
            templeName: 'วัดสุทัศน์เทพวราราม',
            image: '/api/placeholder/150/150',
            benefits: ['โชคลาภวาสนา'],
            description: 'พระพุทธรูปประจำวิหารด้านทิศใต้',
            popular: false
          },
          {
            id: 4,
            name: 'ต้นพระศรีมหาโพธิ์',
            templeId: Number(templeId),
            templeName: 'วัดสุทัศน์เทพวราราม',
            image: '/api/placeholder/150/150',
            benefits: ['ภาพรวมถึงบ้าน'],
            description: 'ต้นโพธิ์ศักดิ์สิทธิ์ภายในวัด',
            popular: true
          },
          {
            id: 5,
            name: 'พระศรีอริยเมตไตรย',
            templeId: Number(templeId),
            templeName: 'วัดสุทัศน์เทพวราราม',
            image: '/api/placeholder/150/150',
            benefits: ['สุขภาพโรคภัย'],
            description: 'พระพุทธรูปปางนาคปรก',
            popular: false
          },
          {
            id: 6,
            name: 'พระพุทธรูปปางลีลา',
            templeId: Number(templeId),
            templeName: 'วัดสุทัศน์เทพวราราม',
            image: '/api/placeholder/150/150',
            benefits: ['ความมงคล'],
            description: 'พระพุทธรูปปางลีลาศิลปะสุโขทัย',
            popular: true
          }
        ]);
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [templeId, isAuthenticated]);
  
  // Filter Buddha statues based on active tab
  const filteredStatues = buddhaStatues.filter(statue => {
    if (activeTab === 'ทั้งหมด') {
      return true;
    } else if (activeTab === 'ที่นิยม') {
      return statue.popular;
    }
    return true;
  });
  
  const handleBuddhaStatueClick = (statueId: number) => {
    router.push(`/information/${statueId}?type=buddha`);
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
        <title>{temple?.name || 'พระพุทธรูป'} - Nummu App</title>
        <meta name="description" content={`พระพุทธรูปในวัด${temple?.name || ''}`} />
      </Head>
      
      <div className="min-h-screen bg-gray-100 pb-20">
        {/* Header */}
        <div className="bg-orange-500 text-white p-4 rounded-b-3xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <button onClick={() => router.back()} className="mr-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-2xl font-semibold">{temple?.name || 'วัดสุทัศน์เทพวราราม'}</h2>
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
        </div>
        
        {/* Main Content */}
        <div className="px-4 py-6">
          {/* Tabs */}
          <div className="flex space-x-2 mb-6">
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
          
          {/* Buddha Statues List */}
          {filteredStatues.length > 0 ? (
            <div className="space-y-6">
              {filteredStatues.map(statue => (
                <div 
                  key={statue.id} 
                  className="flex items-center border-b border-gray-200 pb-6 cursor-pointer"
                  onClick={() => handleBuddhaStatueClick(statue.id)}
                >
                  <div className="w-24 h-24 overflow-hidden rounded-lg">
                    <img 
                      src={statue.image} 
                      alt={statue.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-medium text-lg text-orange-600">{statue.name}</h3>
                    <p className="text-sm text-gray-500">{statue.templeName}</p>
                    <p className="text-sm text-gray-500 mt-1">เยี่ยมชม</p>
                  </div>
                  <div>
                    {statue.benefits.map((benefit, index) => (
                      <div key={index} className="bg-yellow-100 text-yellow-800 rounded-full px-4 py-1 text-sm">
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-4 text-gray-500">ไม่พบพระพุทธรูปในวัดนี้</p>
            </div>
          )}
        </div>
        
        <BottomNavigation activePage="profile" />

      </div>
    </>
  );
}