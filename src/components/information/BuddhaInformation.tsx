import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuth } from '@/contexts/AuthContext';
import BottomNavigation from '@/components/BottomNavigation';

// Types
interface BuddhaInfo {
  id: number;
  name: string;
  image: string;
  temple: string;
  openHours: string;
  wishType: string;
  description: string;
  benefits: string[];
  worshipSteps: {
    title: string;
    steps: string[];
  };
  prayers: {
    title: string;
    text: string;
    transliteration?: string;
  }[];
  offerings: {
    title: string;
    items: string[];
    image?: string;
  }[];
  guidelines: {
    dos: string[];
    donts: string[];
  };
}

const BuddhaInformation = () => {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated, isLoading } = useAuth();
  const [buddhaInfo, setBuddhaInfo] = useState<BuddhaInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [favorited, setFavorited] = useState(false);
  const [showFullView, setShowFullView] = useState(false);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);
  
  // Fetch buddha info
  useEffect(() => {
    if (!id || !isAuthenticated) return;
    
    const fetchBuddhaInfo = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await axios.get(`/api/buddha/${id}`);
        
        // Simulated data
        const mockBuddhaInfo: BuddhaInfo = {
          id: Number(id),
          name: 'พระสุนทรีวาณี',
          image: '/api/placeholder/400/500',
          temple: 'วัดสุทัศน์เทพวราราม',
          openHours: '08.00 - 20.00 น.',
          wishType: 'การเรียน/การงาน',
          description: 'พระสุนทรีวาณีหรือลอยองค์ องค์นี้ประดิษฐานในพระวิหารหลวงวัดสุทัศนเทพวรารามโดยพระบาทสมเด็จพระจุลจอมเกล้าเจ้าอยู่หัวโปรดเกล้าฯ ให้เสด็จเป็นประธาน ประกอบพิธีเทกองและพุทธาภิเษก เมื่อวันที่ 7 ตุลาคม พ.ศ.๑๘๙๖ ซึ่งตรงกล่าวเป็นรูปแบบพิเศษครั้งแรก',
          benefits: [
            'เนโม ตัสสะ ภะคะวะโต อะระหะโต สัมมา สัมพุทธัสสะ( 3 จบ )',
            'นะโม พุทธายะ',
            'พุทธะกะระณัง ปูเชมิ',
            'สพระสัมมะ อรหัง ปัจจัย'
          ],
          worshipSteps: {
            title: 'ลำดับการไหว้',
            steps: [
              'จุดธูปเทียน',
              'กราบไหว้และก้มหมอบ',
              'ปักธูปเทียน',
              'กล่าวบทสวดมนต์'
            ]
          },
          prayers: [
            {
              title: 'บทสวด',
              text: 'นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมา สัมพุทธัสสะ (๓ จบ)',
              transliteration: 'Namo tassa bhagavato arahato sammāsambuddhassa (3 times)'
            },
            {
              title: 'บทขอพร',
              text: 'ข้าแต่พระสุนทรีวาณี ขอให้ข้าพเจ้า จงประสบความสำเร็จ ในด้านการเรียน การงาน มีสติปัญญาดี...'
            }
          ],
          offerings: [
            {
              title: 'ของไหว้',
              items: ['ธูปเทียน 5 ชุด', 'เทียนสีเหลือง 9 คู่', 'ผลไม้ 9 อย่าง', 'ดอกไม้สีขาว'],
              image: '/api/placeholder/200/150'
            },
            {
              title: 'ขอพรด้านการงาน',
              items: ['ธูปเทียน 9 ชุด', 'ดอกบัว', 'แผ่นทอง']
            }
          ],
          guidelines: {
            dos: [
              'แต่งกายสุภาพเรียบร้อย',
              'สวดมนต์ด้วยความตั้งใจ',
              'เข้าแถวรอคอยตามลำดับ'
            ],
            donts: [
              'ห้ามใส่รองเท้าขึ้นบนแท่นพระ',
              'ห้ามชี้นิ้วใส่องค์พระ',
              'ห้ามถ่ายภาพโดยไม่ได้รับอนุญาต'
            ]
          }
        };
        
        setBuddhaInfo(mockBuddhaInfo);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch buddha info:', error);
        setLoading(false);
      }
    };
    
    fetchBuddhaInfo();
  }, [id, isAuthenticated]);
  
  const handleBackClick = () => {
    router.back();
  };
  
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };
  
  const toggleFavorite = () => {
    setFavorited(!favorited);
    // In a real app, you would make an API call to save this preference
  };
  
  const toggleFullView = () => {
    setShowFullView(!showFullView);
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
  
  if (!buddhaInfo) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center justify-center">
        <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-xl font-medium text-gray-700 mb-2">ไม่พบข้อมูล</h2>
        <p className="text-gray-500 mb-4">ขออภัยไม่พบข้อมูลของพระพุทธรูปที่คุณค้นหา</p>
        <button
          onClick={handleBackClick}
          className="px-4 py-2 bg-orange-500 text-white rounded-full font-medium"
        >
          ย้อนกลับ
        </button>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>{buddhaInfo.name} - Nummu App</title>
        <meta name="description" content={`ข้อมูลเกี่ยวกับ${buddhaInfo.name} ที่${buddhaInfo.temple}`} />
      </Head>
      
      <div className="min-h-screen bg-gray-100 pb-20">
        {/* Image Section */}
        <div className="relative">
          <div className="bg-white">
            <img 
              src={buddhaInfo.image} 
              alt={buddhaInfo.name} 
              className="w-full h-auto object-cover"
            />
            <div className="absolute top-4 left-4 z-10">
              <button 
                onClick={handleBackClick}
                className="w-10 h-10 rounded-full bg-white bg-opacity-70 flex items-center justify-center shadow-md"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            <div className="absolute top-4 right-4 flex space-x-2 z-10">
              <button 
                onClick={toggleFavorite}
                className="w-10 h-10 rounded-full bg-white bg-opacity-70 flex items-center justify-center shadow-md"
              >
                {favorited ? (
                  <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                )}
              </button>
              <button 
                onClick={toggleFullView}
                className="w-10 h-10 rounded-full bg-white bg-opacity-70 flex items-center justify-center shadow-md"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
            </div>
            {showFullView && (
              <div className="absolute inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
                <div className="relative w-full h-full">
                  <img 
                    src={buddhaInfo.image} 
                    alt={buddhaInfo.name} 
                    className="w-full h-full object-contain"
                  />
                  <button 
                    onClick={toggleFullView}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white flex items-center justify-center"
                  >
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-4 py-2 text-sm">
                    View 360°
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Buddha Info Card */}
          <div className="bg-white p-4 border-b border-gray-200">
            <div className="mb-2">
              <h1 className="text-xl font-medium text-gray-800">{buddhaInfo.name}</h1>
              <p className="text-gray-500 text-sm">{buddhaInfo.temple}</p>
            </div>
            
            <div className="flex justify-between items-center mb-1">
              <div className="text-orange-600 font-medium">{buddhaInfo.wishType}</div>
              <div className="text-gray-500 text-sm">{buddhaInfo.openHours}</div>
            </div>
            
            <p className="text-gray-700 text-sm leading-relaxed mt-2">
              {buddhaInfo.description}
            </p>
          </div>
        </div>
        
        {/* Expandable Sections */}
        <div className="mt-2">
          {/* ลำดับการไหว้ */}
          <div className="mb-2">
            <div 
              className={`flex justify-between items-center p-4 ${
                expandedSection === 'worshipSteps' ? 'bg-pink-100 rounded-t-xl' : 'bg-pink-100 rounded-xl'
              }`}
              onClick={() => toggleSection('worshipSteps')}
            >
              <h3 className="text-pink-800 font-medium">ลำดับการไหว้</h3>
              <svg 
                className={`w-5 h-5 text-pink-800 transform ${expandedSection === 'worshipSteps' ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {expandedSection === 'worshipSteps' && (
              <div className="bg-white p-4 border-b border-gray-200 rounded-b-xl">
                <ol className="list-decimal pl-5 space-y-2">
                  {buddhaInfo.worshipSteps.steps.map((step, index) => (
                    <li key={index} className="text-gray-700">{step}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
          
          {/* บทสวด */}
          <div className="mb-2">
            <div 
              className={`flex justify-between items-center p-4 ${
                expandedSection === 'prayers' ? 'bg-yellow-100 rounded-t-xl' : 'bg-yellow-100 rounded-xl'
              }`}
              onClick={() => toggleSection('prayers')}
            >
              <h3 className="text-yellow-800 font-medium">บทสวด</h3>
              <svg 
                className={`w-5 h-5 text-yellow-800 transform ${expandedSection === 'prayers' ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {expandedSection === 'prayers' && (
              <div className="bg-white p-4 border-b border-gray-200 rounded-b-xl">
                {buddhaInfo.prayers.map((prayer, index) => (
                  <div key={index} className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">{prayer.title}</h4>
                    <p className="text-gray-600 bg-yellow-50 p-3 rounded-lg">{prayer.text}</p>
                    {prayer.transliteration && (
                      <p className="text-gray-500 text-sm mt-2 italic">{prayer.transliteration}</p>
                    )}
                  </div>
                ))}
                <div className="mt-4 flex justify-center">
                  <button className="bg-yellow-500 text-white rounded-full px-4 py-2 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-4.242a1 1 0 010 1.414m2.828-2.828a1 1 0 010 0m-2.828 2.828L9 16m5.414-5.414L15 10m-2.172 2.172L12 13" />
                    </svg>
                    ฟังบทสวด
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* ของไหว้ */}
          <div className="mb-2">
            <div 
              className={`flex justify-between items-center p-4 ${
                expandedSection === 'offerings' ? 'bg-orange-100 rounded-t-xl' : 'bg-orange-100 rounded-xl'
              }`}
              onClick={() => toggleSection('offerings')}
            >
              <h3 className="text-orange-800 font-medium">ของไหว้</h3>
              <svg 
                className={`w-5 h-5 text-orange-800 transform ${expandedSection === 'offerings' ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {expandedSection === 'offerings' && (
              <div className="bg-white p-4 border-b border-gray-200 rounded-b-xl">
                {buddhaInfo.offerings.map((offering, index) => (
                  <div key={index} className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">{offering.title}</h4>
                    <div className="flex">
                      <div className="flex-1">
                        <ul className="list-disc pl-5 space-y-1">
                          {offering.items.map((item, idx) => (
                            <li key={idx} className="text-gray-600">{item}</li>
                          ))}
                        </ul>
                      </div>
                      {offering.image && (
                        <div className="w-1/3">
                          <img src={offering.image} alt="ของไหว้" className="w-full h-auto rounded-lg" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* ข้อห้าม / ข้อแนะนำ */}
          <div className="mb-2">
            <div 
              className={`flex justify-between items-center p-4 ${
                expandedSection === 'guidelines' ? 'bg-orange-100 rounded-t-xl' : 'bg-orange-100 rounded-xl'
              }`}
              onClick={() => toggleSection('guidelines')}
            >
              <h3 className="text-orange-800 font-medium">ข้อห้าม / ข้อแนะนำ</h3>
              <svg 
                className={`w-5 h-5 text-orange-800 transform ${expandedSection === 'guidelines' ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {expandedSection === 'guidelines' && (
              <div className="bg-white p-4 border-b border-gray-200 rounded-b-xl">
                <div className="mb-4">
                  <h4 className="font-medium text-green-600 mb-2">ข้อแนะนำ</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {buddhaInfo.guidelines.dos.map((item, idx) => (
                      <li key={idx} className="text-gray-600">{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-red-600 mb-2">ข้อห้าม</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {buddhaInfo.guidelines.donts.map((item, idx) => (
                      <li key={idx} className="text-gray-600">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Quick Access Buttons */}
        {/* <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="flex justify-center space-x-4">
            <button className="flex-1 bg-pink-500 text-white rounded-full py-3 flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              จองเวลานัดไหว้
            </button>
            <button className="flex-1 bg-orange-500 text-white rounded-full py-3 flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              ขอพรออนไลน์
            </button>
          </div>
        </div> */}
        
        <BottomNavigation activePage="profile" />
      </div>
    </>
  );
};

export default BuddhaInformation;