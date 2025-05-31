import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

interface JourneyPoint {
  label: string;
  path: string;
}

interface JourneyData {
  id: number;
  title: string;
  description: string;
  image: string;
  points: JourneyPoint[];
  colors: {
    background: string;
    bottomSection: string;
    activeMarker: string;
  }[];
}

const journeyData: Record<string, JourneyData> = {
  '5': {
    id: 5,
    title: 'ตายแล้วไปไหน',
    description: 'เดินทางท่องเที่ยวไปสุดแดนชายแดนตะวันตก จากการอันศรี กุญแลจารย์ พร้อมถ้วยเสริมเสียงชุน เส้นสุญ เสิมกล้นกี่คนุสิริมาชื่น',
    image: '/images/journey/incense.png',
    points: [
      { label: 'เส้นทาง 1', path: '/place/1' },
      { label: 'เส้นทาง 2', path: '/information/1?type=buddha' },
      { label: 'เส้นทาง 3', path: '/information/3?type=buddha' },
    ],
    colors: [
      {
        background: 'bg-orange-200',
        bottomSection: 'bg-gray-800',
        activeMarker: 'bg-gray-800',
      },
      {
        background: 'bg-orange-200',
        bottomSection: 'bg-orange-100',
        activeMarker: 'bg-orange-500',
      },
      {
        background: 'bg-yellow-200',
        bottomSection: 'bg-yellow-400',
        activeMarker: 'bg-yellow-500',
      },
    ],
  },
  '6': {
    id: 6,
    title: 'เส้นทางแก้กรรม',
    description: 'เส้นทางท่องเที่ยวสุดขึ้นศึกษาที่ไม่ว่าจากดึก วาคราวะความที่คิดรู้จะล่าด้าหากคุณข้อนํ้ากาอิ หมายทางอันการเสิกกรุณามาต้าย เล่อทาไซเส่นทางในส่าย',
    image: '/images/journey/medicine-jar.png',
    points: [
      { label: 'เส้นทาง 1', path: '/information/2?type=buddha' },
      { label: 'เส้นทาง 2', path: '/information/3?type=buddha' },
    ],
    colors: [
      {
        background: 'bg-orange-200',
        bottomSection: 'bg-gray-800',
        activeMarker: 'bg-gray-800',
      },
      {
        background: 'bg-orange-200',
        bottomSection: 'bg-orange-100',
        activeMarker: 'bg-orange-500',
      },
      {
        background: 'bg-yellow-200',
        bottomSection: 'bg-yellow-400',
        activeMarker: 'bg-yellow-500',
      },
    ],
  },
};

// Mock illustrations for each journey point
const getIllustration = (journeyId: string, pointIndex: number) => {
  const illustrations = {
    '5': [
      // จุดเริ่มต้นของเปรต - รูปผู้หญิง
      <div className="w-48 h-48 mt-15 flex items-center justify-center">
        <img
          src="/images/dead1.png" // Replace with your image path or URL
          alt="Woman Illustration"
          className="w-55 h-55 object-contain"
        />
      </div>,
      // หมกทางเท้าใน - รูปธูป
      <div className="w-48 h-48 flex mt-15 items-center justify-center">
        <img
          src="/images/dead2.png" // Replace with your image path or URL
          alt="Incense Illustration"
          className="w-55 h-55 object-contain"
        />
      </div>,
      // เส้นกล่องยุทธ - รูปขวดยา
      <div className="w-48 h-48 flex mt-15 items-center justify-center">
        <img
          src="/images/dead3.png" // Replace with your image path or URL
          alt="Medicine Bottle Illustration"
          className="w-55 h-55 object-contain"
        />
      </div>,
    ],
    '6': [
      <div className="w-48 h-48 mt-15 flex items-center justify-center">
        <img
          src="/images/dead2.png" // Replace with your image path or URL
          alt="Journey 6 Illustration 1"
          className="w-55 h-55 object-contain"
        />
      </div>,
      <div className="w-48 h-48 mt-15 flex items-center justify-center">
        <img
          src="/images/dead3.png" // Replace with your image path or URL
          alt="Journey 6 Illustration 2"
          className="w-55 h-55 object-contain"
        />
      </div>,
    ],
  };

  return illustrations[journeyId as keyof typeof illustrations]?.[pointIndex] || illustrations['5'][0];
};

// Function to get the correct location image based on point status
const getLocationImage = (index: number, currentPoint: number) => {
  if (index === currentPoint) {
    // Active point - ใช้สีตาม currentPoint
    const activeImages = [
      '/images/loca1.png', // สีดำ - point 0
      '/images/local2.png', // สีส้ม - point 1  
      '/images/loca4.png'   // สีเหลือง - point 2
    ];
    return activeImages[currentPoint] || '/images/loca1.png';
  } else if (index < currentPoint) {
    // Completed point - ใช้สีส้ม
    return '/images/local2.png';
  } else {
    // Future point - ใช้สีขาว
    return '/images/loca3.png';
  }
};

const JourneyDetailScreen = () => {
  const router = useRouter();
  const { id } = router.query;
  const [currentPoint, setCurrentPoint] = useState(0);

  const journey = journeyData[id as string] || journeyData['5'];
  const currentColors = journey.colors[currentPoint];

  // รีเซ็ต currentPoint เป็น 0 เสมอเมื่อ id เปลี่ยน (เช่น เข้ามาที่หน้าใหม่)
  useEffect(() => {
    setCurrentPoint(0); // เริ่มที่เส้นทาง 1 เสมอ
  }, [id]);

  const handlePointClick = (index: number) => {
    setCurrentPoint(index);
  };

  const handleWorshipClick = () => {
    const path = journey.points[currentPoint].path;
    router.push(path);
  };

  const handleBackClick = () => {
    router.back();
  };

  const getJourneyTitle = (pointIndex: number) => {
    const titles = {
      '5': ['จุดเริ่มต้นของเปรต', 'หนทางแก้ไข', 'เติมคลังบุญ'],
      '6': ['หนทางแก้ไข', 'เติมคลังบุญ'],
    };
    return titles[id as keyof typeof titles]?.[pointIndex] || `เส้นทาง ${pointIndex + 1}`;
  };

  return (
    <div className={`min-h-screen ${currentColors.background} transition-all duration-500`}>
      {/* Back Button and Header */}
      <div className="w-full flex justify-start p-4">
        <button onClick={handleBackClick} className="p-2">
          <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1 flex justify-center">
          <span className="text-orange-600 font-medium">{journey.title}</span>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex flex-col items-center px-4 pb-32">
        {/* Illustration */}
        <div className="mb-8">
          {getIllustration(id as string, currentPoint)}
        </div>

        {/* Title */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {getJourneyTitle(currentPoint)}
          </h1>
        </div>

        {/* Journey Path */}
        <div className="w-full max-w-sm mb-8">
          <div className="flex justify-between items-center relative">
            {/* Connection Line */}
            <div className="absolute top-8 left-6 right-8 h-0.5 bg-gray-400"></div>

            {journey.points.map((point, index) => (
              <div
                key={point.label}
                className="flex flex-col items-center cursor-pointer z-10"
                onClick={() => handlePointClick(index)}
              >
                <div className="w-8 h-8 transition-all duration-300 flex items-center justify-center">
                  <img
                    src={getLocationImage(index, currentPoint)}
                    alt={`Location ${index + 1}`}
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <span className="text-xs text-gray-600 mt-2">{point.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
  <div className={`fixed bottom-0 left-0 right-0 ${currentColors.bottomSection} transition-all duration-500 rounded-t-3xl p-6`}>
        <button
          onClick={handleWorshipClick}
          className="w-full bg-orange-500 text-white py-4 rounded-full font-medium text-lg flex items-center justify-center shadow-lg"
        >
          <span className="mr-2">🙏</span> นำมู
        </button>
      </div>
    </div>
  );
};

export default JourneyDetailScreen;