import { useRouter } from "next/router";
import { useState, useEffect } from "react";

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
  "5": {
    id: 5,
    title: "ตายแล้วไปไหน",
    description:
      "เดินทางท่องเที่ยวไปสุดแดนชายแดนตะวันตก จากการอันศรี กุญแลจารย์ พร้อมถ้วยเสริมเสียงชุน เส้นสุญ เสิมกล้นกี่คนุสิริมาชื่น",
    image: "/images/journey/incense.png",
    points: [
      { label: "เส้นทาง 1", path: "/place/1" },
      { label: "เส้นทาง 2", path: "/information/1?type=buddha" },
      { label: "เส้นทาง 3", path: "/information/3?type=buddha" },
    ],
    colors: [
      {
        background: "bg-orange-300",
        bottomSection: "bg-gray-600",
        activeMarker: "bg-gray-800",
      },
      {
        background: "bg-orange-300",
        bottomSection: "bg-gray-600",
        activeMarker: "bg-orange-500",
      },
      {
        background: "bg-orange-300",
        bottomSection: "bg-gray-600",
        activeMarker: "bg-orange-500",
      },
    ],
  },
  "6": {
    id: 6,
    title: "เส้นทางแก้กรรม",
    description:
      "เส้นทางท่องเที่ยวสุดขึ้นศึกษาที่ไม่ว่าจากดึก วาคราวะความที่คิดรู้จะล่าด้าหากคุณข้อนํ้ากาอิ หมายทางอันการเสิกกรุณามาต้าย เล่อทาไซเส่นทางในส่าย",
    image: "/images/journey/medicine-jar.png",
    points: [
      { label: "เส้นทาง 1", path: "/information/2?type=buddha" },
      { label: "เส้นทาง 2", path: "/information/3?type=buddha" },
    ],
    colors: [
      {
        background: "bg-orange-300",
        bottomSection: "bg-gray-600",
        activeMarker: "bg-gray-800",
      },
      {
        background: "bg-orange-300",
        bottomSection: "bg-gray-600",
        activeMarker: "bg-orange-500",
      },
    ],
  },
};

// Mock illustrations for each journey point
const getIllustration = (journeyId: string, pointIndex: number) => {
  const illustrations = {
    "5": [
      // จุดเริ่มต้นของเปรต - รูปผู้หญิง
      <div key="ill1" className="w-full flex items-center justify-center">
        <img
          src="/images/dead1.png"
          alt="Woman Illustration"
          className="w-64 h-64 object-contain"
        />
      </div>,
      // หมกทางเท้าใน - รูปธูป
      <div key="ill2" className="w-full flex items-center justify-center">
        <img
          src="/images/dead2.png"
          alt="Incense Illustration"
          className="w-64 h-64 object-contain"
        />
      </div>,
      // เส้นกล่องยุทธ - รูปขวดยา
      <div key="ill3" className="w-full flex items-center justify-center">
        <img
          src="/images/dead3.png"
          alt="Medicine Bottle Illustration"
          className="w-64 h-64 object-contain"
        />
      </div>,
    ],
    "6": [
      <div key="ill6-1" className="w-full flex items-center justify-center">
        <img
          src="/images/dead2.png"
          alt="Journey 6 Illustration 1"
          className="w-64 h-64 object-contain"
        />
      </div>,
      <div key="ill6-2" className="w-full flex items-center justify-center">
        <img
          src="/images/dead3.png"
          alt="Journey 6 Illustration 2"
          className="w-64 h-64 object-contain"
        />
      </div>,
    ],
  };

  return (
    illustrations[journeyId as keyof typeof illustrations]?.[pointIndex] ||
    illustrations["5"][0]
  );
};

const JourneyDetailScreen = () => {
  const router = useRouter();
  const { id } = router.query;
  const [currentPoint, setCurrentPoint] = useState(0);

  const journey = journeyData[id as string] || journeyData["5"];

  // รีเซ็ต currentPoint เป็น 0 เสมอเมื่อ id เปลี่ยน
  useEffect(() => {
    setCurrentPoint(0);
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
      "5": ["จุดเริ่มต้นของเปรต", "หนทางแก้ไข", "เติมคลังบุญ"],
      "6": ["หนทางแก้ไข", "เติมคลังบุญ"],
    };
    return (
      titles[id as keyof typeof titles]?.[pointIndex] ||
      `เส้นทาง ${pointIndex + 1}`
    );
  };

  const getLocationImage = (index: number, currentPoint: number) => {
    if (index === currentPoint) {
      // Active point - ใช้สีตาม currentPoint
      const activeImages = [
        "/images/local2.png", // สีดำ - point 0
        "/images/local2.png", // สีส้ม - point 1
        "/images/local2.png", // สีเหลือง - point 2
      ];
      return activeImages[currentPoint] || "/images/loca1.png";
    } else if (index < currentPoint) {
      // Completed point - ใช้สีส้ม
      return "/images/local2.png";
    } else {
      // Future point - ใช้สีขาว
      return "/images/loca3.png";
    }
  };

  return (
    <div className={`h-screen bg-orange-300 flex flex-col overflow-hidden`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12">
        <button onClick={handleBackClick} className="p-2">
          <svg
            className="w-6 h-6 text-orange-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <span className="text-orange-700 font-medium text-2xl">
          {journey.title}
        </span>
        <div className="w-10"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
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
                    className="w-50 h-50 object-contain"
                  />
                </div>
                <span className="text-xs text-gray-600 mt-2">
                  {point.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-[#FCF3E5] px-6 py-8">
        <button
          onClick={handleWorshipClick}
          className="w-full bg-orange-500 text-white py-4 rounded-full font-semibold text-3xl flex items-center justify-center shadow-lg hover:bg-orange-600 transition-colors"
        >
          <span className="mr-2">
            <svg
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_2775_1201)">
                <path
                  d="M26 23.0033C26 23.0033 25.971 23.0251 25.9638 23.0395C25.7756 23.814 24.7043 24.1832 24.0095 23.3797C23.206 22.4532 22.7645 21.3964 22.7572 20.1659C22.75 18.2333 22.75 16.3079 22.7572 14.3753C22.7645 12.6164 22.2505 11.0312 21.201 9.61971C19.5 7.31793 17.8135 5.01615 16.1197 2.71437C15.7867 2.26559 15.3524 2.08463 14.8892 2.20768C14.1436 2.41036 13.8469 3.27172 14.3174 3.91592C15.005 4.8569 15.7071 5.79065 16.402 6.72439C17.2272 7.83909 18.0451 8.96103 18.8775 10.0685C19.2973 10.6331 19.5072 11.2411 19.5 11.9504C19.4855 13.7383 19.5 15.5189 19.5 17.3068C19.5 17.7918 19.2249 18.1826 18.7906 18.3419C18.3636 18.5011 17.8931 18.3708 17.5963 18.0234C17.3936 17.7845 17.3357 17.5022 17.3357 17.1982C17.3357 15.49 17.3357 13.7817 17.3357 12.0735C17.3357 11.9215 17.3357 11.7622 17.2923 11.6247C17.1548 11.1108 16.6481 10.7778 16.1342 10.843C15.5841 10.9154 15.186 11.328 15.1787 11.8853C15.1715 13.2461 15.1787 14.6069 15.1787 15.9749C15.1787 17.1693 15.157 18.3636 15.2004 19.5507C15.2439 20.868 15.5406 22.1347 16.2645 23.2567C16.4527 23.5535 16.6988 23.8213 16.9449 24.0674C17.4009 24.5161 17.4588 25.1604 17.0679 25.6164C16.6626 26.0796 16.0184 26.1303 15.5262 25.7032C14.6431 24.936 14.0785 23.9516 13.6731 22.8658C13.3257 21.9538 13.1303 20.9983 13.0579 20.0284C13.0579 19.9705 13.0434 19.9126 12.9927 19.8547C12.9493 20.2094 12.9131 20.5568 12.8552 20.9042C12.5946 22.5401 12.0228 24.0384 10.9081 25.2906C10.7416 25.4788 10.5534 25.6598 10.3508 25.8046C9.88751 26.1303 9.27226 26.0217 8.91758 25.5874C8.57738 25.1676 8.59186 24.5234 8.9972 24.1542C9.98161 23.2639 10.4376 22.1058 10.6693 20.8463C10.7778 20.2311 10.8285 19.6013 10.8357 18.9788C10.8574 16.6553 10.843 14.3246 10.843 12.0011C10.843 11.4221 10.539 10.995 10.054 10.8719C9.36636 10.691 8.71491 11.1687 8.69319 11.8781C8.67872 12.4788 8.69319 13.0796 8.69319 13.6804C8.69319 14.8747 8.69319 16.069 8.69319 17.2561C8.69319 18.0306 8.06346 18.5445 7.34687 18.3781C6.88362 18.2695 6.52894 17.8569 6.52894 17.3719C6.52894 15.4393 6.5217 13.5139 6.52894 11.5813C6.52894 11.0095 6.79676 10.5245 7.12972 10.0757C8.54119 8.17929 9.95266 6.27561 11.3641 4.37194C11.4799 4.2127 11.5958 4.06069 11.7116 3.90145C12.0662 3.402 11.9794 2.74332 11.5161 2.3814C11.0312 2.01225 10.3652 2.09911 9.98161 2.59855C9.2433 3.58296 8.52671 4.57461 7.79564 5.55902C6.81847 6.89087 5.84854 8.22272 4.86413 9.54009C3.78562 10.9805 3.25722 12.5874 3.26446 14.3825C3.27894 16.3151 3.27894 18.2405 3.26446 20.1732C3.25722 21.4254 2.80121 22.5184 1.93261 23.4232C1.4766 23.9009 0.817914 23.9371 0.369139 23.5173C-0.0941123 23.0902 -0.108589 22.4243 0.361901 21.9393C0.875821 21.3964 1.12192 20.7812 1.10745 20.0139C1.07849 18.1247 1.10021 16.2428 1.10021 14.3536C1.10021 12.1169 1.75166 10.0974 3.09074 8.2951C4.79175 6.00056 6.48551 3.69154 8.17204 1.38976C8.70767 0.644209 9.4315 0.180958 10.3725 0.0361915C10.4014 0.0361915 10.4304 0.0144766 10.4666 0C10.7199 0 10.9733 0 11.2266 0C11.3352 0.0289532 11.4365 0.0579065 11.5451 0.0796214C12.1024 0.202673 12.5874 0.456013 12.9783 0.810691C13.2678 0.629733 13.5211 0.434298 13.7962 0.311247C14.1074 0.173719 14.4476 0.101336 14.7806 0C15.034 0 15.2873 0 15.5406 0C15.5696 0.0144766 15.5985 0.0361915 15.6347 0.0361915C16.5757 0.173719 17.2995 0.64421 17.8569 1.40423C19.5362 3.69154 21.2155 5.98608 22.9092 8.26615C24.27 10.1047 24.9432 12.1531 24.9287 14.4404C24.9215 16.3586 24.9287 18.2767 24.9287 20.2021C24.9287 20.8101 25.1314 21.3168 25.5078 21.7801C25.696 22.0045 25.848 22.2578 26.0145 22.4967V23.0033H26ZM10.7489 8.81626C12.0156 9.29399 12.7466 10.1915 13 11.4872C13.2533 10.1698 13.9989 9.29399 15.2439 8.81626C14.4911 7.8029 13.7528 6.80401 12.9927 5.78341C12.2255 6.81125 11.4944 7.8029 10.7416 8.81626H10.7489Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_2775_1201">
                  <rect width="26" height="26" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </span>{" "}
          นำมู
        </button>
      </div>
    </div>
  );
};

export default JourneyDetailScreen;
