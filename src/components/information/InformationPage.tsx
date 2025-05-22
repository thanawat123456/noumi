import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import BottomNavigation from '@/components/BottomNavigation';
import { ChevronDown, ChevronUp, Heart, Star, Clock, ArrowLeft, X, Play, Volume2, ShoppingCart, Calendar, Plus } from 'lucide-react';

// Types
interface InformationProps {
  type: 'temple' | 'buddha';
  id: string | string[] | undefined;
}

interface SectionConfig {
  id: string;
  title: string;
  bgColor: string;
  contentBgColor: string;
  textColor: string;
  zIndex: number;
}

const InformationPage: React.FC<InformationProps> = ({ type, id }) => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [information, setInformation] = useState({
    id: 1,
    name: type === 'temple' ? 'วัดสุทัศน์เทพวราราม' : 'พระพุทธรูปสำคัญ',
    image: '/api/placeholder/400/500',
    location: type === 'temple' ? 'แขวงวัดราชบพิธ เขตพระนคร กรุงเทพมหานคร' : 'วัดสุทัศน์เทพวราราม',
    openHours: '08.00 - 20.00 น.',
    type: type === 'temple' ? 'ภาพรวม / ทั่วไป' : 'ภาพรวม / ทั่วไป',
    description: 'ข้อมูลกำลังโหลด...',
    worshipGuide: {
      title: 'ลำดับการไหว้',
      steps: ['กำลังโหลดข้อมูล...']
    },
    chants: {
      title: 'บทสวด',
      items: [{ title: 'กำลังโหลด...', text: 'กำลังโหลดข้อมูล...' }]
    },
    offerings: {
      title: 'ของไหว้',
      items: [{ name: 'กำลังโหลด...', description: 'กำลังโหลดข้อมูล...', image: '/api/placeholder/100/100' }]
    },
    guidelines: {
      title: 'ข้อห้าม / ข้อแนะนำ',
      dress: { title: 'การแต่งกาย', description: 'กำลังโหลดข้อมูล...', image: '/api/placeholder/300/200' },
      behavior: { title: 'การวางตัว', description: 'กำลังโหลดข้อมูล...', image: '/api/placeholder/300/200' },
      photography: { title: 'การถ่ายรูป', description: 'กำลังโหลดข้อมูล...', image: '/api/placeholder/300/200' }
    }
  });

  interface ChantItem {
    title: string;
    text: string;
    transliteration?: string;
  }

  interface BuddhaInfo {
    id: number;
    name: string;
    image: string;
    location: string;
    openHours: string;
    type: string;
    description: string;
    worshipGuide: {
      title: string;
      steps: string[];
    };
    chants: {
      title: string;
      items: ChantItem[];
    };
    offerings: {
      title: string;
      items: {
        name: string;
        description: string;
        image: string;
      }[];
    };
    guidelines: {
      title: string;
      dress: {
        title: string;
        description: string;
        image: string;
      };
      behavior: {
        title: string;
        description: string;
        image: string;
      };
      photography: {
        title: string;
        description: string;
        image: string;
      };
    };
  }

  interface TempleInfo {
    id: number;
    name: string;
    image: string;
    location: string;
    openHours: string;
    type: string;
    description: string;
    worshipGuide: {
      title: string;
      steps: string[];
    };
    chants: {
      title: string;
      items: ChantItem[];
    };
    offerings: {
      title: string;
      items: {
        name: string;
        description: string;
        image: string;
      }[];
    };
    guidelines: {
      title: string;
      dress: {
        title: string;
        description: string;
        image: string;
      };
      behavior: {
        title: string;
        description: string;
        image: string;
      };
      photography: {
        title: string;
        description: string;
        image: string;
      };
    };
  }

  // Load data useEffect
  useEffect(() => {
    if (!id || !isAuthenticated) return;
    
    const fetchInformation = async () => {
      try {
        if (type === 'buddha') {
          const buddhaData: Record<number, BuddhaInfo> = {
            1: {
              id: 1,
              name: 'พระศรีศากยมุนี',
              image: '/api/placeholder/400/500',
              location: 'วัดสุทัศน์เทพวราราม',
              openHours: '08.00 - 20.00 น.',
              type: 'ภาพรวม / ทั่วไป',
              description: 'พระพุทธรูปประธานในพระอุโบสถ มีความศักดิ์สิทธิ์ เป็นที่เคารพนับถือของพุทธศาสนิกชนทั่วประเทศ',
              worshipGuide: {
                title: 'ลำดับการไหว้',
                steps: [
                  'จุดธูปเทียน 3 ดอก เทียน 2 เล่ม',
                  'ตั้งจิตอธิษฐาน กล่าวคำบูชา',
                  'กราบ 3 ครั้ง',
                  'ปักธูปเทียนในที่ที่จัดไว้',
                  'นั่งสมาธิสักครู่ก่อนลุกออกไป'
                ]
              },
              chants: {
                title: 'บทสวด',
                items: [
                  {
                    title: 'พระสุนทรีวาจ',
                    text: 'นะโม ติส-ส ภะคะวะโต อะระหะโต สัมมา สัมพุทธัส-ส( 3 จบ )\n\n● ● ● ● ● ● ● ●\n\nหูนันทะ วะกะนันพุชะ\nคัพพะสัมภะวะ สุนทรี ปาณนัง\nสะระณัง วาจนี มัยหัง\nปิฎนะยะตัง',
                    transliteration: 'Namo tassa bhagavato arahato sammāsambuddhassa (3 times)'
                  }
                ]
              },
              offerings: {
                title: 'ของไหว้',
                items: [
                  {
                    name: 'ดอกไม้',
                    description: 'ดอกบัว หรือดอกไม้สีขาว 9 ดอก',
                    image: '/api/placeholder/100/100'
                  },
                  {
                    name: 'ธูปเทียน',
                    description: 'ธูป 9 ดอก เทียน 2 เล่ม',
                    image: '/api/placeholder/100/100'
                  },
                  {
                    name: 'ผลไม้',
                    description: 'ผลไม้ 9 อย่าง',
                    image: '/api/placeholder/100/100'
                  }
                ]
              },
              guidelines: {
                title: 'ข้อห้าม / ข้อแนะนำ',
                dress: {
                  title: 'การแต่งกาย',
                  description: 'แต่งกายสุภาพ ไม่ควรนุ่งสั้น และไม่ควรสวมเสื้อผ้าบางเปิดเผยร่างกาย ไม่สมควรใส่กางเกงขาสั้น',
                  image: '/api/placeholder/300/200'
                },
                behavior: {
                  title: 'การวางตัว',
                  description: 'สำรวมกาย วาจา ใจ ไม่ส่งเสียงดัง ไม่พูดคุยเสียงดัง ไม่ส่งเสียงรบกวนผู้อื่น',
                  image: '/api/placeholder/300/200'
                },
                photography: {
                  title: 'การถ่ายรูป',
                  description: 'ไม่ควรถ่ายภาพในบริเวณที่มีป้ายห้ามหรือในพื้นที่ศักดิ์สิทธิ์โดยไม่ได้รับอนุญาต',
                  image: '/api/placeholder/300/200'
                }
              }
            }
          };
          
          const buddhaId = Number(id);
          if (Object.prototype.hasOwnProperty.call(buddhaData, buddhaId)) {
            setInformation(buddhaData[buddhaId]);
          }
        } else if (type === 'temple') {
          const templeData: Record<number, TempleInfo> = {
            1: {
              id: 1,
              name: 'วัดสุทัศน์เทพวราราม',
              image: '/api/placeholder/400/500',
              location: 'แขวงวัดราชบพิธ เขตพระนคร กรุงเทพมหานคร',
              openHours: '08.00 - 20.00 น.',
              type: 'ภาพรวม / ทั่วไป',
              description: 'วัดสุทัศน์เทพวรารามเป็นพระอารามหลวงชั้นเอก ชนิดราชวรมหาวิหาร',
              worshipGuide: {
                title: 'ลำดับการเข้าวัด',
                steps: [
                  'แต่งกายสุภาพเรียบร้อย',
                  'เดินเข้าทางประตูวัดอย่างสงบสำรวม',
                  'กราบพระประธานในพระอุโบสถ',
                  'เวียนประทักษิณรอบพระอุโบสถ 3 รอบ',
                  'สักการะพระพุทธรูปสำคัญในวัด'
                ]
              },
              chants: {
                title: 'บทสวด',
                items: [
                  {
                    title: 'คำบูชาพระรัตนตรัย',
                    text: 'อิมินา สักกาเรนะ, พุทธัง ปูเชมิ ฯ\nอิมินา สักกาเรนะ, ธัมมัง ปูเชมิ ฯ\nอิมินา สักกาเรนะ, สังฆัง ปูเชมิ ฯ'
                  }
                ]
              },
              offerings: {
                title: 'ของไหว้',
                items: [
                  {
                    name: 'ดอกไม้',
                    description: 'ดอกบัว ดอกกุหลาบ ดอกดาวเรือง',
                    image: '/api/placeholder/100/100'
                  },
                  {
                    name: 'ธูปเทียน',
                    description: 'ธูป 3 ดอก เทียน 2 เล่ม',
                    image: '/api/placeholder/100/100'
                  }
                ]
              },
              guidelines: {
                title: 'ข้อห้าม / ข้อแนะนำ',
                dress: {
                  title: 'การแต่งกาย',
                  description: 'แต่งกายสุภาพ ไม่ควรนุ่งสั้น และไม่ควรสวมเสื้อผ้าบางเปิดเผยร่างกาย',
                  image: '/api/placeholder/300/200'
                },
                behavior: {
                  title: 'การวางตัว',
                  description: 'สำรวมกาย วาจา ใจ ไม่ส่งเสียงดัง ไม่พูดคุยเสียงดัง',
                  image: '/api/placeholder/300/200'
                },
                photography: {
                  title: 'การถ่ายรูป',
                  description: 'ไม่ควรถ่ายภาพในบริเวณที่มีป้ายห้ามหรือในพื้นที่ศักดิ์สิทธิ์',
                  image: '/api/placeholder/300/200'
                }
              }
            }
          };
          
          const templeId = Number(id);
          if (Object.prototype.hasOwnProperty.call(templeData, templeId)) {
            setInformation(templeData[templeId]);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error(`Failed to fetch ${type} info:`, error);
        setLoading(false);
      }
    };
    
    fetchInformation();
  }, [id, isAuthenticated, type]);

  const handleBackClick = () => {
    router.back();
  };

  const toggleSection = (sectionKey: string) => {
    setExpandedSection(expandedSection === sectionKey ? null : sectionKey);
  };

  const sectionConfigs: SectionConfig[] = [
    { 
      id: 'worshipGuide', 
      title: 'คำแนะนำการไหว้', 
      bgColor: 'bg-pink-200', 
      contentBgColor: 'bg-pink-100',
      textColor: 'text-pink-800',
      zIndex: 40
    },
    { 
      id: 'chants', 
      title: 'บทสวด', 
      bgColor: 'bg-yellow-300', 
      contentBgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      zIndex: 30
    },
    { 
      id: 'offerings', 
      title: 'ของไหว้', 
      bgColor: 'bg-orange-400', 
      contentBgColor: 'bg-orange-200',
      textColor: 'text-orange-800',
      zIndex: 20
    },
    { 
      id: 'guidelines', 
      title: 'ข้อห้าม / ข้อแนะนำ', 
      bgColor: 'bg-orange-300', 
      contentBgColor: 'bg-orange-100',
      textColor: 'text-orange-800',
      zIndex: 10
    }
  ];

  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case 'worshipGuide':
        return (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">คำแนะนำการไหว้</h3>
              <p className="text-gray-700 text-base">คำแนะนำในการไหว้อย่างถูกต้อง</p>
              <div className="w-full h-px bg-white bg-opacity-50 my-6"></div>
            </div>
            <ol className="list-decimal pl-6 space-y-3 mb-6">
              {information.worshipGuide.steps.map((step, index) => (
                <li key={index} className="text-gray-700">{step}</li>
              ))}
            </ol>
            <div className="bg-pink-50 p-4 rounded-lg">
              <div className="flex items-center mb-3">
                <Play className="w-6 h-6 text-pink-500 mr-2" />
                <h3 className="text-pink-700 font-medium">วิดีโอสาธิตการไหว้</h3>
              </div>
              <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                <Play className="w-16 h-16 text-gray-400" />
              </div>
            </div>
          </div>
        );
      
      case 'chants':
        return (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">พระสุนทรีวาจ</h3>
              <p className="text-gray-700 text-base">เทพบุตรแห่งปัญญาในพระพุทธศาสนา</p>
              <div className="w-full h-px bg-white bg-opacity-50 my-6"></div>
            </div>
            
            <div className="mb-8">
              <p className="text-gray-800 font-bold mb-4 text-lg leading-relaxed">
                นะโม ติส-ส ภะคะวะโต อะระหะโต สัมมา สัมพุทธัส-ส( 3 จบ )
              </p>
              <p className="text-gray-700 text-center mb-6 tracking-widest text-lg">
                ● ● ● ● ● ● ● ●
              </p>
              <div className="space-y-3 text-gray-800 text-lg">
                <p className="font-semibold">หูนันทะ วะกะนันพุชะ</p>
                <p className="font-semibold">คัพพะสัมภะวะ สุนทรี ปาณนัง</p>
                <p className="font-semibold">สะระณัง วาจนี มัยหัง</p>
                <p className="font-semibold">ปิฎนะยะตัง</p>
              </div>
              <div className="w-full h-px bg-white bg-opacity-50 my-6"></div>
            </div>
            
            <div className="text-gray-700 text-base leading-relaxed">
              "คำถวายพระสุนทรีวาจ" หำถูกรักรอบสำหรับส่งเวจญ์ในปัญญา พระสุทธิให้พูดมังเมื่อแบ่งให้ปรากฏความลู่เสียงใหญ่เหมือนพระอัชฌุม บริกรรมหาครอนี่อีกนิดนึง ที่อะไรทีเก็บเสมาฮอตต่าง
            </div>
            
            <div className="flex justify-center mt-6">
              <button className="bg-yellow-500 text-white rounded-full px-6 py-2 flex items-center">
                <Volume2 className="w-5 h-5 mr-2" />
                ฟังบทสวด
              </button>
            </div>
          </div>
        );
      
      case 'offerings':
        return (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">ของไหว้</h3>
              <p className="text-gray-700 text-base">รายการของไหว้ที่เหมาะสม</p>
              <div className="w-full h-px bg-white bg-opacity-50 my-6"></div>
            </div>
            <div className="grid grid-cols-1 gap-4 mb-6">
              {information.offerings.items.map((offering, index) => (
                <div key={index} className="bg-orange-50 p-4 rounded-lg flex items-center">
                  <div className="w-16 h-16 mr-4">
                    <img src={offering.image} alt={offering.name} className="w-full h-full object-cover rounded-lg" />
                  </div>
                  <div>
                    <h4 className="font-medium text-orange-800">{offering.name}</h4>
                    <p className="text-gray-600 text-sm">{offering.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <button className="w-full bg-orange-500 text-white py-3 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 mr-2" />
                สั่งซื้อของไหว้ออนไลน์
              </button>
            </div>
          </div>
        );
      
      case 'guidelines':
        return (
          <div>
            <div className="text-center mb-8">
              <div className="relative">
                <div className="absolute -top-4 -left-4">
                  <Star className="w-6 h-6 text-white fill-white" />
                </div>
                <div className="absolute -top-8 -right-2">
                  <Star className="w-4 h-4 text-white fill-white" />
                </div>
                <div className="absolute -bottom-2 -right-6">
                  <Star className="w-6 h-6 text-white fill-white" />
                </div>
                <div className="absolute -bottom-6 -left-3">
                  <Star className="w-4 h-4 text-white fill-white" />
                </div>
                <div className="absolute top-2 right-8">
                  <Star className="w-3 h-3 text-white fill-white" />
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-xl">
                  <div className="w-16 h-12 bg-black rounded-t-2xl mb-4 mx-auto relative">
                    <div className="absolute -top-1 -right-2 w-6 h-6 bg-black transform rotate-45"></div>
                    <div className="absolute top-2 right-1 w-1 h-6 bg-yellow-400"></div>
                  </div>
                  <div className="w-20 h-16 bg-gray-100 rounded-lg shadow-inner mx-auto relative">
                    <div className="absolute inset-2 bg-white rounded border-l-2 border-gray-300"></div>
                    <div className="absolute top-4 left-4 right-4 h-px bg-gray-300"></div>
                    <div className="absolute top-6 left-4 right-4 h-px bg-gray-300"></div>
                    <div className="absolute top-8 left-4 right-4 h-px bg-gray-300"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">พระสุนทรีวาจ</h3>
            <p className="text-gray-700 text-base mb-6 text-center">เทพบุตรแห่งปัญญาในพระพุทธศาสนา</p>
            <div className="w-full h-px bg-white bg-opacity-50 my-6"></div>
            
            <div className="text-gray-700 text-base leading-relaxed">
              เศรษฐีแก่คำแนะนำของไหว้ประทานพระในตำนานสิบบุญ ให้ผู้มาสักการะความยินดีต่อพระเคอสิน มีความจำเป็นเสียก่อน บริกรรมหาครอนี่อีกนิดนึง ที่อะไรทีเก็บเสมาฮอตต่าง
            </div>
          </div>
        );
      
      default:
        return <div>ไม่พบข้อมูลในส่วนนี้</div>;
    }
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
        <title>{information.name} - Nummu App</title>
        <meta name="description" content={`ข้อมูลเกี่ยวกับ${information.name}`} />
      </Head>
      
      <div className="min-h-screen bg-gray-100 pb-20 max-w-[414px] mx-auto">
        {/* Header Image */}
        <div className="relative">
          <img 
            src="/api/placeholder/400/500" 
            alt={information.name} 
            className="w-full h-auto"
          />
          <div className="absolute top-4 left-4 z-10">
            <button 
              onClick={handleBackClick}
              className="w-10 h-10 rounded-full bg-white bg-opacity-70 flex items-center justify-center shadow-md"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
          </div>
          
          <div className="absolute top-4 right-4 z-10">
            <button className="w-10 h-10 rounded-full bg-white bg-opacity-70 flex items-center justify-center shadow-md">
              <Heart className="w-6 h-6 text-gray-700" />
            </button>
          </div>
          
          <div className="absolute bottom-4 right-4 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
            View 360°
          </div>
          
          {/* Overlay gradient for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          
          {/* Image caption */}
          <div className="absolute bottom-4 left-4 right-4 text-white z-10">
            <h1 className="text-2xl font-semibold drop-shadow-lg">{information.name}</h1>
            <p className="text-sm opacity-90">{information.location}</p>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="p-4 bg-white">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
              {information.type}
            </div>
            <div className="text-sm text-gray-500 flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {information.openHours}
            </div>
          </div>
          
          <div className="text-gray-700 text-sm mb-4">
            <p>{information.description}</p>
          </div>
          
          <div className="mt-3 flex justify-center">
            <button className="text-sm bg-blue-500 text-white px-6 py-2 rounded-full flex items-center">
              <ChevronDown className="w-4 h-4 mr-2" />
              อ่านเพิ่มเติม
            </button>
          </div>
        </div>
        
        {/* Stacked Sections */}
        <div className="relative min-h-80 -mx-6 px-6">
          <div className="relative min-h-80 -mx-6">
            {sectionConfigs.map((section, index) => {
              const isExpanded = expandedSection === section.id;
              const isCollapsed = expandedSection && expandedSection !== section.id;
              const totalSections = sectionConfigs.length;
              const reverseIndex = totalSections - 1 - index;
              const scaleX = isExpanded ? 1 : (1 - reverseIndex * 0.06);
              
              return (
                <div
                  key={section.id}
                  className={`absolute transition-all duration-500 ease-in-out ${section.bgColor} overflow-hidden`}
                  style={{
                    zIndex: isExpanded ? 50 : section.zIndex,
                    left: '0px',
                    right: '0px',
                    top: isCollapsed ? `${index * 16}px` : isExpanded ? '0px' : `${index * 50}px`,
                    height: isExpanded ? 'auto' : '70px',
                    minHeight: isExpanded ? '400px' : '70px',
                    borderRadius: isExpanded ? '16px' : `${50 - reverseIndex * 8}px ${50 - reverseIndex * 8}px 16px 16px`,
                    transform: `scaleX(${scaleX})`,
                    transformOrigin: 'center'
                  }}
                >
                  {/* Header Button */}
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full p-4 flex justify-between items-center hover:bg-black hover:bg-opacity-5 transition-colors"
                    style={{ paddingLeft: '24px', paddingRight: '24px' }}
                  >
                    <span className="text-gray-800 font-medium text-lg">{section.title}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-6 h-6 text-gray-700" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-700" />
                    )}
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-6 pb-6" style={{ marginLeft: '0px', marginRight: '0px' }}>
                      {renderSectionContent(section.id)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Quick Buttons */}
        {type === 'buddha' && (
          <div className="fixed bottom-16 left-0 right-0 max-w-[414px] mx-auto bg-white border-t border-gray-200 p-4">
            <div className="flex justify-center space-x-4">
              <button className="flex-1 bg-pink-500 text-white rounded-full py-3 flex items-center justify-center">
                <Calendar className="w-5 h-5 mr-2" />
                จองเวลานัดไหว้
              </button>
              <button className="flex-1 bg-orange-500 text-white rounded-full py-3 flex items-center justify-center">
                <Plus className="w-5 h-5 mr-2" />
                ขอพรออนไลน์
              </button>
            </div>
          </div>
        )}
        
        <BottomNavigation activePage="profile" />
      </div>
    </>
  );
};

export default InformationPage;