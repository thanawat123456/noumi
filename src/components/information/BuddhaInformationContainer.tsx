import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * Buddha Information components
 * These are individual, expandable sections for a Buddha statue information page
 */

// Types
interface Section {
  id: string;
  title: string;
  bgColor: string;
  textColor: string;
}

interface ScrollableSectionProps {
  sections: Section[];
  activeSection: string | null;
  onSectionChange: (sectionId: string) => void;
}

interface WorshipStepsProps {
  steps: string[];
  isExpanded: boolean;
}

interface PrayerItem {
  title: string;
  text: string;
  transliteration?: string;
}

interface PrayersProps {
  prayers: PrayerItem[];
  isExpanded: boolean;
}

interface OfferingItem {
  title: string;
  items: string[];
  image?: string;
}

interface OfferingsProps {
  offerings: OfferingItem[];
  isExpanded: boolean;
}

interface GuidelinesProps {
  dos: string[];
  donts: string[];
  isExpanded: boolean;
}

/**
 * Component to handle scrollable section navigation
 */
export const ScrollableSections: React.FC<ScrollableSectionProps> = ({
  sections,
  activeSection,
  onSectionChange
}) => {
  return (
    <div className="flex overflow-x-auto scrollbar-hide space-x-2 p-2 bg-white">
      {sections.map(section => (
        <button
          key={section.id}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
            activeSection === section.id 
              ? `${section.bgColor} ${section.textColor}` 
              : 'bg-gray-100 text-gray-600'
          }`}
          onClick={() => onSectionChange(section.id)}
        >
          {section.title}
        </button>
      ))}
    </div>
  );
};

/**
 * Worship Steps Section Component
 */
export const WorshipStepsSection: React.FC<WorshipStepsProps> = ({ steps, isExpanded }) => {
  if (!isExpanded) return null;
  
  return (
    <div className="bg-white p-4 rounded-b-xl shadow-md">
      <ol className="list-decimal pl-5 space-y-2">
        {steps.map((step, index) => (
          <li key={index} className="text-gray-700">{step}</li>
        ))}
      </ol>
      <div className="mt-6 space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-gray-800">ดูวิดีโอวิธีการไหว้</h4>
            <p className="text-gray-500 text-sm">ชมขั้นตอนการไหว้ที่ถูกต้องแบบละเอียด</p>
          </div>
        </div>
        <div className="w-full rounded-xl h-40 bg-gray-200 flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

/**
 * Prayers Section Component
 */
export const PrayersSection: React.FC<PrayersProps> = ({ prayers, isExpanded }) => {
  if (!isExpanded) return null;
  
  return (
    <div className="bg-white p-4 rounded-b-xl shadow-md">
      {prayers.map((prayer, index) => (
        <div key={index} className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">{prayer.title}</h4>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-gray-600">{prayer.text}</p>
            {prayer.transliteration && (
              <p className="text-gray-500 text-sm mt-2 italic">{prayer.transliteration}</p>
            )}
          </div>
        </div>
      ))}
      <div className="mt-4 flex justify-center">
        <button className="bg-yellow-500 text-white rounded-full px-6 py-2 flex items-center shadow-md">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-4.242a1 1 0 010 1.414m2.828-2.828a1 1 0 010 0m-2.828 2.828L9 16m5.414-5.414L15 10m-2.172 2.172L12 13" />
          </svg>
          ฟังบทสวด
        </button>
      </div>
    </div>
  );
};

/**
 * Offerings Section Component
 */
export const OfferingsSection: React.FC<OfferingsProps> = ({ offerings, isExpanded }) => {
  if (!isExpanded) return null;
  
  return (
    <div className="bg-white p-4 rounded-b-xl shadow-md">
      {offerings.map((offering, index) => (
        <div key={index} className="mb-6">
          <h4 className="font-medium text-gray-700 mb-3">{offering.title}</h4>
          <div className="flex items-start">
            <div className="flex-1">
              <ul className="list-disc pl-5 space-y-2">
                {offering.items.map((item, idx) => (
                  <li key={idx} className="text-gray-600">{item}</li>
                ))}
              </ul>
            </div>
            {offering.image && (
              <div className="w-1/3 ml-4">
                <img src={offering.image} alt="ของไหว้" className="w-full h-auto rounded-lg shadow-md" />
              </div>
            )}
          </div>
        </div>
      ))}
      
      <div className="bg-orange-50 p-4 rounded-lg mt-4">
        <div className="flex items-center mb-2">
          <svg className="w-5 h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h4 className="font-medium text-orange-800">หมายเหตุ</h4>
        </div>
        <p className="text-gray-600 text-sm">
          ท่านสามารถหาซื้อของไหว้ได้ที่ร้านค้าบริเวณด้านหน้าวัด หรือสั่งซื้อผ่านแอปพลิเคชัน เพื่อความสะดวกและรวดเร็ว
        </p>
        <button className="mt-3 w-full bg-orange-500 text-white py-2 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          สั่งซื้อของไหว้
        </button>
      </div>
    </div>
  );
};

/**
 * Guidelines Section Component
 */
export const GuidelinesSection: React.FC<GuidelinesProps> = ({ dos, donts, isExpanded }) => {
  if (!isExpanded) return null;
  
  return (
    <div className="bg-white p-4 rounded-b-xl shadow-md">
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h4 className="font-medium text-green-600">ข้อแนะนำ</h4>
        </div>
        <ul className="list-disc pl-5 space-y-2">
          {dos.map((item, idx) => (
            <li key={idx} className="text-gray-600">{item}</li>
          ))}
        </ul>
      </div>
      
      <div>
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-2">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h4 className="font-medium text-red-600">ข้อห้าม</h4>
        </div>
        <ul className="list-disc pl-5 space-y-2">
          {donts.map((item, idx) => (
            <li key={idx} className="text-gray-600">{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

/**
 * Full Buddha Detail Page Container
 */
export const BuddhaInformationContainer: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [buddhaDetails] = useState({
    name: 'พระสุนทรีวาณี',
    temple: 'วัดสุทัศน์เทพวราราม',
    image: '/api/placeholder/400/500',
    wishType: 'การเรียน/การงาน',
    openHours: '08.00 - 20.00 น.',
    description: 'พระสุนทรีวาณีหรือลอยองค์ องค์นี้ประดิษฐานในพระวิหารหลวงวัดสุทัศน์เทพวราราม โดยพระบาทสมเด็จพระจุลจอมเกล้าเจ้าอยู่หัวโปรดเกล้าฯ ให้เสด็จเป็นประธาน ประกอบพิธีเทกองและพุทธาภิเษก เมื่อวันที่ 7 ตุลาคม พ.ศ.๑๘๙๖ ซึ่งตรงกล่าวเป็นรูปแบบพิเศษครั้งแรก',
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
        text: 'ข้าแต่พระสุนทรีวาณี ขอให้ข้าพเจ้า จงประสบความสำเร็จ ในด้านการเรียน การงาน มีสติปัญญาดี...'
      }
    ],
    offerings: [
      {
        title: 'ของไหว้พื้นฐาน',
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
  
  const sections: Section[] = [
    { id: 'overview', title: 'ข้อมูลทั่วไป', bgColor: 'bg-blue-500', textColor: 'text-white' },
    { id: 'worshipSteps', title: 'ลำดับการไหว้', bgColor: 'bg-pink-400', textColor: 'text-white' },
    { id: 'prayers', title: 'บทสวด', bgColor: 'bg-yellow-400', textColor: 'text-white' },
    { id: 'offerings', title: 'ของไหว้', bgColor: 'bg-orange-400', textColor: 'text-white' },
    { id: 'guidelines', title: 'ข้อห้าม/ข้อแนะนำ', bgColor: 'bg-orange-400', textColor: 'text-white' }
  ];
  
  // Fetch Buddha info from API in a real app
  useEffect(() => {
    if (!id) return;
    // This would be replaced with a real API call in a production app
    console.log(`Fetching info for Buddha with ID: ${id}`);
    // Example: const fetchData = async () => { const result = await axios.get(`/api/buddha/${id}`); setBuddhaDetails(result.data); };
    // fetchData();
    
    // Default to showing the overview section
    setActiveSection('overview');
  }, [id]);
  
  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
  };
  
  const handleBack = () => {
    router.back();
  };
  
  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Header Image */}
      <div className="relative h-64">
        <img 
          src={buddhaDetails.image} 
          alt={buddhaDetails.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4">
          <button 
            onClick={handleBack}
            className="w-10 h-10 rounded-full bg-white bg-opacity-70 flex items-center justify-center shadow-md"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent text-white">
          <h1 className="text-2xl font-medium">{buddhaDetails.name}</h1>
          <p className="text-sm opacity-80">{buddhaDetails.temple}</p>
        </div>
      </div>
      
      {/* Scrollable Sections Navigation */}
      <ScrollableSections 
        sections={sections}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />
      
      {/* Content Section */}
      <div className="p-4">
        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="bg-white p-4 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                {buddhaDetails.wishType}
              </span>
              <div className="flex items-center text-gray-500 text-sm">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {buddhaDetails.openHours}
              </div>
            </div>
            
            <p className="text-gray-700 leading-relaxed">
              {buddhaDetails.description}
            </p>
            
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <div className="w-8 h-8 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-blue-800 text-sm font-medium">เวลาทำการ</h4>
                <p className="text-gray-600 text-xs mt-1">08.00 - 20.00 น.</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <div className="w-8 h-8 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h4 className="text-green-800 text-sm font-medium">การเดินทาง</h4>
                <p className="text-gray-600 text-xs mt-1">เข้าถึงได้หลายเส้นทาง</p>
              </div>
            </div>
            
            <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              ดูแผนที่และเส้นทาง
            </button>
          </div>
        )}
        
        {/* Worship Steps */}
        <WorshipStepsSection 
          steps={buddhaDetails.worshipSteps} 
          isExpanded={activeSection === 'worshipSteps'} 
        />
        
        {/* Prayers */}
        <PrayersSection 
          prayers={buddhaDetails.prayers} 
          isExpanded={activeSection === 'prayers'} 
        />
        
        {/* Offerings */}
        <OfferingsSection 
          offerings={buddhaDetails.offerings} 
          isExpanded={activeSection === 'offerings'} 
        />
        
        {/* Guidelines */}
        <GuidelinesSection 
          dos={buddhaDetails.guidelines.dos} 
          donts={buddhaDetails.guidelines.donts} 
          isExpanded={activeSection === 'guidelines'} 
        />
      </div>
      
      {/* Quick Actions */}
      {/* <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex justify-between space-x-3">
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
    </div>
  );
};

export default BuddhaInformationContainer;