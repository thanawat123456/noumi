import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuth } from '@/contexts/AuthContext';
import BottomNavigation from '@/components/BottomNavigation';

// Types
interface ExpandableSectionProps {
  title: string;
  bgColor: string;
  textColor: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

interface BuddhaDetailContentProps {
  id: string | string[] | undefined;
  onBack: () => void;
}

/**
 * Expandable Section Component
 */
const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title,
  bgColor,
  textColor,
  isExpanded,
  onToggle,
  children
}) => {
  return (
    <div className="mb-2">
      <div 
        className={`flex justify-between items-center p-4 ${
          isExpanded ? `${bgColor} rounded-t-xl` : `${bgColor} rounded-xl`
        } cursor-pointer`}
        onClick={onToggle}
      >
        <h3 className={`${textColor} font-medium`}>{title}</h3>
        <svg 
          className={`w-5 h-5 ${textColor} transform ${isExpanded ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      {isExpanded && (
        <div className="bg-white p-4 border-b border-gray-200 rounded-b-xl">
          {children}
        </div>
      )}
    </div>
  );
};

/**
 * Main Buddha Detail Content Component
 */
const BuddhaDetailContent: React.FC<BuddhaDetailContentProps> = ({ id, onBack }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [favorited, setFavorited] = useState(false);
  const [buddhaSections] = useState({
    details: {
      name: 'พระสุนทรีวาณี',
      temple: 'วัดสุทัศน์เทพวราราม',
      wishType: 'การเรียน/การงาน',
      openHours: '08.00 - 20.00 น.',
      description: 'พระสุนทรีวาณีหรือลอยองค์ องค์นี้ประดิษฐานในพระวิหารหลวงวัดสุทัศน์เทพวรารามโดยพระบาทสมเด็จพระจุลจอมเกล้าเจ้าอยู่หัวโปรดเกล้าฯ ให้เสด็จเป็นประธาน ประกอบพิธีเทกองและพุทธาภิเษก เมื่อวันที่ 7 ตุลาคม พ.ศ.๑๘๙๖ ซึ่งตรงกล่าวเป็นรูปแบบพิเศษครั้งแรก'
    },
    worshipSteps: [
      'จุดธูปเทียน',
      'กราบไหว้และก้มหมอบ',
      'ปักธูปเทียน',
      'กล่าวบทสวดมนต์'
    ],
    prayers: [
      {
        title: 'บทสวดมนต์',
        text: 'นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมา สัมพุทธัสสะ (๓ จบ)',
        transliteration: 'Namo tassa bhagavato arahato sammāsambuddhassa (3 times)'
      },
      {
        title: 'บทขอพร',
        text: 'ข้าแต่พระสุนทรีวาณี ขอให้ข้าพเจ้า จงประสบความสำเร็จ ในด้านการเรียน การงาน มีสติปัญญาดี ความคิดเฉียบแหลม...'
      }
    ],
    offerings: [
      {
        title: 'ของไหว้',
        items: ['ธูปเทียน 5 ชุด', 'เทียนสีเหลือง 9 คู่', 'ผลไม้ 9 อย่าง', 'ดอกไม้สีขาว'],
        image: '/api/placeholder/200/150'
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
  });
  
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
  
  // Fetch Buddha info from API in a real app
  useEffect(() => {
    // This would be replaced with a real API call in a production app
    console.log(`Fetching info for Buddha with ID: ${id}`);
    // Example: const fetchData = async () => { const result = await axios.get(`/api/buddha/${id}`); setBuddhaSections(result.data); };
    // fetchData();
  }, [id]);
  
  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Image with header actions */}
      <div className="relative">
        <div className="bg-white">
          <img 
            src="/api/placeholder/400/500" 
            alt={buddhaSections.details.name} 
            className="w-full h-auto object-cover"
          />
          <div className="absolute top-4 left-4 z-10">
            <button 
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-white bg-opacity-70 flex items-center justify-center shadow-md"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
          <div className="absolute top-4 right-4 z-10">
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
          </div>
        </div>
        
        {/* Buddha Info Card */}
        <div className="bg-white p-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h1 className="text-xl font-medium text-gray-800">{buddhaSections.details.name}</h1>
              <p className="text-gray-500 text-sm">{buddhaSections.details.temple}</p>
            </div>
            <div className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
              {buddhaSections.details.wishType}
            </div>
          </div>
          
          <div className="flex items-center mb-3">
            <svg className="w-5 h-5 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-gray-500 text-sm">{buddhaSections.details.openHours}</span>
          </div>
          
          <p className="text-gray-700 text-sm leading-relaxed">
            {buddhaSections.details.description}
          </p>
          
          <div className="flex justify-center mt-4">
            <button className="text-orange-500 underline text-sm">
              อ่านเพิ่มเติม
            </button>
          </div>
        </div>
      </div>
      
      {/* Expandable Sections */}
      <div className="mt-4 px-4">
        {/* ลำดับการไหว้ */}
        <ExpandableSection
          title="ลำดับการไหว้"
          bgColor="bg-pink-100"
          textColor="text-pink-800"
          isExpanded={expandedSection === 'worshipSteps'}
          onToggle={() => toggleSection('worshipSteps')}
        >
          <ol className="list-decimal pl-5 space-y-2">
            {buddhaSections.worshipSteps.map((step, index) => (
              <li key={index} className="text-gray-700">{step}</li>
            ))}
          </ol>
        </ExpandableSection>
        
        {/* บทสวด */}
        <ExpandableSection
          title="บทสวด"
          bgColor="bg-yellow-100"
          textColor="text-yellow-800"
          isExpanded={expandedSection === 'prayers'}
          onToggle={() => toggleSection('prayers')}
        >
          {buddhaSections.prayers.map((prayer, index) => (
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
        </ExpandableSection>
        
        {/* ของไหว้ */}
        <ExpandableSection
          title="ของไหว้"
          bgColor="bg-orange-100"
          textColor="text-orange-800"
          isExpanded={expandedSection === 'offerings'}
          onToggle={() => toggleSection('offerings')}
        >
          {buddhaSections.offerings.map((offering, index) => (
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
        </ExpandableSection>
        
        {/* ข้อห้าม / ข้อแนะนำ */}
        <ExpandableSection
          title="ข้อห้าม / ข้อแนะนำ"
          bgColor="bg-orange-100"
          textColor="text-orange-800"
          isExpanded={expandedSection === 'guidelines'}
          onToggle={() => toggleSection('guidelines')}
        >
          <div className="mb-4">
            <h4 className="font-medium text-green-600 mb-2">ข้อแนะนำ</h4>
            <ul className="list-disc pl-5 space-y-1">
              {buddhaSections.guidelines.dos.map((item, idx) => (
                <li key={idx} className="text-gray-600">{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-red-600 mb-2">ข้อห้าม</h4>
            <ul className="list-disc pl-5 space-y-1">
              {buddhaSections.guidelines.donts.map((item, idx) => (
                <li key={idx} className="text-gray-600">{item}</li>
              ))}
            </ul>
          </div>
        </ExpandableSection>
      </div>
    </div>
  );
};

/**
 * Main Buddha Info Page
 */
const BuddhaInformationPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated, isLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    } else if (!isLoading && isAuthenticated) {
      setLoading(false);
    }
  }, [isAuthenticated, isLoading, router]);
  
  const handleBack = () => {
    router.back();
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
        <title>ข้อมูลพระพุทธรูป - Nummu App</title>
        <meta name="description" content="รายละเอียดพระพุทธรูป ขั้นตอนการไหว้ บทสวด และข้อมูลสำคัญ" />
      </Head>
      
      <BuddhaDetailContent id={id} onBack={handleBack} />
      
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
      
      <BottomNavigation />
    </>
  );
};

export default BuddhaInformationPage;