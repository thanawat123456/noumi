import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

// Types
interface WishCategory {
  id: string;
  name: string;
}

interface WishPlace {
  id: number;
  name: string;
  image: string;
  temple: string;
  wishType: string;
  category: string;
  isFavorite: boolean;
}

interface WishPlacesHeaderProps {
  onBackClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  userName?: string;
}

interface WishCategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

interface WishPlacesListProps {
  places: WishPlace[];
  onPlaceClick: (id: number) => void;
  onToggleFavorite: (id: number) => void;
}

interface QuickWishOptionsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

interface WishPlacesScreenProps {
  initialCategory?: string;
  userName?: string;
}

/**
 * คอมโพเนนต์แสดงหน้าสถานที่ขอตามพร
 */
export const WishPlacesHeader: React.FC<WishPlacesHeaderProps> = ({ 
  onBackClick, 
  searchQuery, 
  onSearchChange, 
  userName = "Praewwy :)" 
}) => {
  return (
    <div className="bg-orange-500 text-white p-4 rounded-b-3xl">
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
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* ชื่อหน้า */}
      <div className="flex items-center mb-4">
        <button onClick={onBackClick} className="mr-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-2xl font-semibold">สถานที่ขอตามพร</h2>
      </div>
      
      {/* ช่องค้นหา */}
      <div className="relative">
        <input 
          type="text" 
          placeholder="ค้นหาพระพุทธรูป..." 
          className="w-full bg-white rounded-full px-10 py-2 text-gray-700"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
};

/**
 * แท็บหมวดหมู่สำหรับเลือกประเภทของพร
 */
export const WishCategoryTabs: React.FC<WishCategoryTabsProps> = ({ activeCategory, onCategoryChange }) => {
  const categories: WishCategory[] = [
    { id: 'all', name: 'ทั้งหมด' },
    { id: 'overview', name: 'ภาพรวม' },
    { id: 'work', name: 'การงาน' },
    { id: 'love', name: 'ความรัก' },
    { id: 'finance', name: 'การเงิน' },
    { id: 'fortune', name: 'โชคลาภ' },
    { id: 'health', name: 'โรคภัย' }
  ];
  
  return (
    <div className="bg-white rounded-full p-2 flex space-x-1 overflow-x-auto scrollbar-hide">
      {categories.map(category => (
        <button
          key={category.id}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
            activeCategory === category.id 
              ? 'bg-pink-400 text-white' 
              : 'bg-gray-100 text-gray-600'
          }`}
          onClick={() => onCategoryChange(category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

/**
 * แสดงการ์ดสถานที่และพระพุทธรูปที่ขอพรได้
 */
export const WishPlacesList: React.FC<WishPlacesListProps> = ({ places, onPlaceClick, onToggleFavorite }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {places.map(place => (
        <div key={place.id} className="bg-white rounded-lg overflow-hidden shadow">
          <div className="relative">
            <img 
              src={place.image} 
              alt={place.name} 
              className="w-full h-48 object-cover"
              onClick={() => onPlaceClick(place.id)}
            />
            <button 
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white bg-opacity-70 flex items-center justify-center"
              onClick={() => onToggleFavorite(place.id)}
            >
              {place.isFavorite ? (
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
            </button>
          </div>
          <div className="p-3 flex justify-between items-center" onClick={() => onPlaceClick(place.id)}>
            <div>
              <h3 className="text-orange-600 font-medium">{place.name}</h3>
              <p className="text-gray-500 text-sm">{place.temple}</p>
            </div>
            <div className="bg-yellow-100 text-yellow-800 rounded-full px-3 py-1 text-xs">
              {place.wishType}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * แสดงตัวเลือกเร็วด้านล่างสำหรับเลือกประเภทพร
 */
export const QuickWishOptions: React.FC<QuickWishOptionsProps> = ({ activeCategory, onCategoryChange }) => {
  const options = [
    { id: 'overview', name: 'ภาพรวมทั่วไป', icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 3C10.22 3 8.47991 3.52784 6.99987 4.51677C5.51983 5.50571 4.36628 6.91131 3.68509 8.55585C3.0039 10.2004 2.82567 12.01 3.17294 13.7558C3.5202 15.5016 4.37737 17.1053 5.63604 18.364C6.89472 19.6226 8.49836 20.4798 10.2442 20.8271C11.99 21.1743 13.7996 20.9961 15.4442 20.3149C17.0887 19.6337 18.4943 18.4802 19.4832 17.0001C20.4722 15.5201 21 13.78 21 12C21 9.61305 20.0518 7.32387 18.364 5.63604C16.6761 3.94821 14.3869 3 12 3ZM12 19C10.6155 19 9.26216 18.5895 8.11101 17.8203C6.95987 17.0511 6.06266 15.9579 5.53285 14.6788C5.00303 13.3997 4.86441 11.9923 5.13451 10.6344C5.4046 9.27657 6.07129 8.02922 7.05026 7.05026C8.02922 6.07129 9.27657 5.4046 10.6344 5.13451C11.9923 4.86441 13.3997 5.00303 14.6788 5.53285C15.9579 6.06266 17.0511 6.95987 17.8203 8.11101C18.5895 9.26216 19 10.6155 19 12C19 13.8565 18.2625 15.637 16.9497 16.9497C15.637 18.2625 13.8565 19 12 19Z" />
        <circle cx="12" cy="12" r="5" />
      </svg>
    )},
    { id: 'work', name: 'การงานการเรียน', icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )},
    { id: 'love', name: 'ความรักคู่ครอง', icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )},
    { id: 'finance', name: 'การเงินธุรกิจ', icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )}
  ];
  
  return (
    <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 py-2">
      <div className="grid grid-cols-4 gap-2 px-4">
        {options.map(option => (
          <button
            key={option.id}
            className={`flex flex-col items-center ${
              activeCategory === option.id ? 'text-pink-500' : 'text-gray-500'
            }`}
            onClick={() => onCategoryChange(option.id)}
          >
            <div className={`p-2 rounded-full ${
              activeCategory === option.id ? 'bg-pink-100' : 'bg-gray-100'
            }`}>
              {option.icon}
            </div>
            <span className="text-xs mt-1">{option.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * คอมโพเนนต์หลักที่รวมทุกส่วนเข้าด้วยกัน
 */
export const WishPlacesScreen: React.FC<WishPlacesScreenProps> = ({ initialCategory = 'all', userName }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [wishPlaces, setWishPlaces] = useState<WishPlace[]>([]);
  const [loading, setLoading] = useState(true);
  
  // จำลองข้อมูลสถานที่ขอพร
  useEffect(() => {
    const mockWishPlaces: WishPlace[] = [
      {
        id: 1,
        name: 'พระศรีศากยมุนี',
        image: '/api/placeholder/400/300',
        temple: 'วัดสุทัศน์เทพวราราม',
        wishType: 'ภาพรวมทั่วไป',
        category: 'overview',
        isFavorite: false
      },
      {
        id: 2,
        name: 'พระสุนทรี วาณี',
        image: '/api/placeholder/400/300',
        temple: 'วัดสุทัศน์เทพวราราม',
        wishType: 'การงานการเรียน',
        category: 'work',
        isFavorite: false
      },
      {
        id: 3,
        name: 'พระพุทธรังสีมุนราชัย',
        image: '/api/placeholder/400/300',
        temple: 'วัดสุทัศน์เทพวราราม',
        wishType: 'ความรักคู่ครอง',
        category: 'love',
        isFavorite: false
      },
      {
        id: 4,
        name: 'ท้าวเวสสุวรรณ',
        image: '/api/placeholder/400/300',
        temple: 'วัดสุทัศน์เทพวราราม',
        wishType: 'การเงินธุรกิจ',
        category: 'finance',
        isFavorite: false
      },
      {
        id: 5,
        name: 'พระพุทธรูปปางลีลา',
        image: '/api/placeholder/400/300',
        temple: 'วัดสุทัศน์เทพวราราม',
        wishType: 'โชคลาภวาสนา',
        category: 'fortune',
        isFavorite: false
      },
      {
        id: 6,
        name: 'พระพุทธชินราช',
        image: '/api/placeholder/400/300',
        temple: 'วัดสุทัศน์เทพวราราม',
        wishType: 'โรคภัยไข้เจ็บ',
        category: 'health',
        isFavorite: false
      }
    ];
    
    setWishPlaces(mockWishPlaces);
    setLoading(false);
  }, []);
  
  // กรองสถานที่ตามการค้นหาและหมวดหมู่ที่เลือก
  const filteredPlaces = wishPlaces.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeCategory === 'all') {
      return matchesSearch;
    }
    
    return matchesSearch && place.category === activeCategory;
  });
  
  const handleBackClick = () => {
    router.push('/dashboard');
  };
  
  const handlePlaceClick = (placeId: number) => {
    router.push(`/wish-places/${placeId}`);
  };
  
  const handleToggleFavorite = (placeId: number) => {
    setWishPlaces(prevPlaces => 
      prevPlaces.map(place => 
        place.id === placeId 
          ? { ...place, isFavorite: !place.isFavorite } 
          : place
      )
    );
  };
  
  if (loading) {
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
    <div className="min-h-screen bg-gray-100 pb-24">
      {/* ส่วนหัว */}
      <WishPlacesHeader 
        onBackClick={handleBackClick}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        userName={userName}
      />
      
      {/* Main Content */}
      <div className="px-4 py-4">
        {/* แท็บหมวดหมู่ */}
        <div className="mb-4">
          <WishCategoryTabs 
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
        
        {/* รายการสถานที่ */}
        {filteredPlaces.length > 0 ? (
          <WishPlacesList 
            places={filteredPlaces}
            onPlaceClick={handlePlaceClick}
            onToggleFavorite={handleToggleFavorite}
          />
        ) : (
          <div className="text-center py-10">
            <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-4 text-gray-500">ไม่พบสถานที่ที่คุณกำลังค้นหา</p>
          </div>
        )}
      </div>
      
      {/* ตัวเลือกเร็ว */}
      <QuickWishOptions 
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      
      {/* Navbar ด้านล่าง */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3">
        <Link href="/dashboard" className="flex flex-col items-center text-gray-400">
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
        <Link href="/fortunes" className="flex flex-col items-center text-pink-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <span className="text-xs mt-1">ดวง</span>
        </Link>
        <Link href="/dashboard/profile" className="flex flex-col items-center text-gray-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs mt-1">โปรไฟล์</span>
        </Link>
      </nav>
    </div>
  );
};