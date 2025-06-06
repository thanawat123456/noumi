import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import BottomNavigation from "@/components/BottomNavigation";
import { useFavoritesActivity } from "@/hooks/useFavoritesActivity";

// Types
interface CeremonyActivity {
  id: number;
  name: string;
  image: string;
  description: string;
  type: "ceremony" | "activity";
  isFavorite: boolean;
}

interface CeremonyActivityHeaderProps {
  onBackClick: () => void;
  title: string;
  userName?: string;
}

interface CeremonyActivityListProps {
  items: CeremonyActivity[];
  onItemClick: (id: number) => void;
  onToggleFavorite: (id: number) => void;
}

interface CeremonyActivityScreenProps {
  type: "ceremony" | "activity";
  userName?: string;
  onBackClick?: () => void;
  showFavoritesOnly?: boolean;
}

/**
 * คอมโพเนนต์แสดงส่วนหัวของหน้าพิธีกรรมหรือกิจกรรม
 */
export const CeremonyActivityHeader: React.FC<CeremonyActivityHeaderProps> = ({
  onBackClick,
  title,
  userName = "Praewwy :)",
}) => {
  return (
    <div className="bg-orange-500 text-white p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-white">
            <img
              src="/api/placeholder/40/40"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-white text-sm">สวัสดี,ยินดีต้อนรับ</p>
            <h3 className="text-white text-xl font-medium">{userName}</h3>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <svg
              className="w-5 h-5 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>
          <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <svg
              className="w-5 h-5 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* ชื่อหน้า */}
      <div className="flex items-center justify-center mb-4">
        <button onClick={onBackClick} className="absolute left-4 top-16">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h2 className="text-2xl font-semibold">{title}</h2>
      </div>
    </div>
  );
};

/**
 * คอมโพเนนต์แสดงรายการพิธีกรรมหรือกิจกรรม
 */
export const CeremonyActivityList: React.FC<CeremonyActivityListProps> = ({
  items,
  onItemClick,
  onToggleFavorite,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="relative rounded-xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow duration-200"
        >
          <div className="relative">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-40 object-cover cursor-pointer"
              onClick={() => onItemClick(item.id)}
            />
            <button
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white bg-opacity-90 flex items-center justify-center hover:bg-opacity-100 transition-all duration-200 transform hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(item.id);
              }}
            >
              {item.isFavorite ? (
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              )}
            </button>
          </div>
          <div 
            className="p-3 cursor-pointer hover:bg-gray-50 transition-colors duration-200" 
            onClick={() => onItemClick(item.id)}
          >
            <h3 className="text-orange-600 font-medium text-center">
              {item.name}
            </h3>
            <p className="text-gray-600 text-xs text-center mt-1">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * คอมโพเนนต์หลักสำหรับหน้าพิธีกรรมหรือกิจกรรม
 */
export const CeremonyActivityScreen: React.FC<CeremonyActivityScreenProps> = ({
  type,
  showFavoritesOnly = false,
}) => {
  const router = useRouter();
  const [items, setItems] = useState<CeremonyActivity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // ใช้ custom hook สำหรับจัดการ favorites
  const { toggleFavorite, updateItemsFavorites, getFavoritesCount, isLoaded } = useFavoritesActivity();

  // ดึงข้อมูลพิธีกรรมหรือกิจกรรม
  useEffect(() => {
    // จำลองข้อมูล
    const getMockData = () => {
      if (type === "ceremony") {
        return [
          {
            id: 8,
            name: "ขอขมากรรม",
            image: "/images/temple-list/พระพุทธเสฏฐมุนี.jpeg",
            description: "การแก้กรรมอดีต แก้กรรมติดตัวและค้างนาน",
            type: "ceremony",
            isFavorite: false,
          },
         
        ] as CeremonyActivity[];
      } else {
        return [
          {
            id: 1,
            name: "ทำวัตร",
            image: "/images/buddha-object/ทำวัด.jpg",
            description: "เข้าไหว้พระสวดมนต์เข้าถึงพุทธบริษัท",
            type: "activity",
            isFavorite: false,
          },
          {
            id: 2,
            name: "ฟังพระธรรมเทศนา",
            image: "/images/buddha-object/ฟังธรรม.jpg",
            description: "ช่วยให้เราเข้าใจความเป็นธรรมของชีวิต",
            type: "activity",
            isFavorite: false,
          },
          {
            id: 3,
            name: "นั่งสมาธิ",
            image: "/images/buddha-object/สามาธิ.jpg",
            description: "การฝึกสมาธิใช้ความสงบใน ทำความสงบ หรือสติ",
            type: "activity",
            isFavorite: false,
          },
          {
            id: 4,
            name: "เจริญกรรมฐาน",
            image: "/images/buddha-object/เจริญกรรมฐาน.jpg",
            description: "เป็นการเจริญปัญญาเพื่อระงับทุกข์และสะเดาะปัญญา",
            type: "activity",
            isFavorite: false,
          },
        ] as CeremonyActivity[];
      }
    };

    const mockData = getMockData();
    // อัปเดตสถานะ favorite จาก localStorage
    const updatedData = updateItemsFavorites(mockData);
    
    // กรองเฉพาะรายการที่เป็น favorites ถ้า showFavoritesOnly = true
    const finalData = showFavoritesOnly 
      ? updatedData.filter(item => item.isFavorite)
      : updatedData;
    
    setItems(finalData);
    setLoading(false);
  }, [type, updateItemsFavorites, showFavoritesOnly, isLoaded]);

  const handleItemClick = (id: number) => {
    const selectedItem = items.find(item => item.id === id);
    
    if (type === "ceremony") {
      router.push(`/information/8?type=buddha`);
    } else {
      router.push(`/activity/${id}?name=${encodeURIComponent(selectedItem?.name || '')}`);
    }
  };

  const handleToggleFavorite = (id: number) => {
    // อัปเดตใน localStorage ผ่าน hook
    toggleFavorite(id);
    
    // อัปเดต state ของ component
    setItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      );
      
      // ถ้าแสดงเฉพาะ favorites และรายการนี้ถูกยกเลิก favorite ให้ลบออก
      if (showFavoritesOnly) {
        return updatedItems.filter(item => item.isFavorite);
      }
      
      return updatedItems;
    });
  };

  if (loading || !isLoaded) { // รอให้ข้อมูล favorites โหลดเสร็จด้วย
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-orange-500">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  const backgroundClass = type === "ceremony" ? "bg-yellow-100" : "bg-pink-100";

  return (
    <div className="relative min-h-screen">
      {/* พื้นหลังหลัก */}
      <div
        className={`absolute inset-0 z-0 ${backgroundClass} rounded-tl-[50px] mt-[-40px]`}
      />

      {/* เนื้อหาหลัก */}
      <div className="relative z-10">
        {/* รายการ */}
        {items.length > 0 ? (
          <>
            {/* แสดงจำนวนรายการถ้าเป็นหน้า favorites */}
            {showFavoritesOnly && (
              <div className="px-4 pt-4 pb-2">
                <p className="text-gray-600 text-sm text-center">
                  รายการโปรดของคุณ ({getFavoritesCount()} รายการ)
                </p>
              </div>
            )}
            
            <CeremonyActivityList
              items={items}
              onItemClick={handleItemClick}
              onToggleFavorite={handleToggleFavorite}
            />
          </>
        ) : (
          <div className="text-center p-10">
            {showFavoritesOnly ? (
              // แสดงเมื่อไม่มีรายการโปรด
              <>
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  ยังไม่มีรายการโปรด
                </h3>
                <p className="text-gray-500 mb-6 max-w-xs mx-auto">
                  กดปุ่มหัวใจในหน้า{type === "activity" ? "กิจกรรม" : "พิธีกรรม"} เพื่อเพิ่มเข้ารายการโปรด
                </p>
              </>
            ) : (
              // แสดงเมื่อไม่มีข้อมูลทั่วไป
              <>
                <svg
                  className="w-16 h-16 text-gray-400 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="mt-4 text-gray-500">ไม่พบรายการ</p>
              </>
            )}
          </div>
        )}

        <BottomNavigation activePage="profile" />
      </div>
    </div>
  );
};