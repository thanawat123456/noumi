import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import BottomNavigation from '@/components/BottomNavigation';

// ข้อมูลธาตุประจำวันเกิด
const elementsData = {
  'Monday': { name: 'ธาตุน้ำ', color: '#3498db', bgColor: '#d6eaf8' },
  'Tuesday': { name: 'ธาตุไฟ', color: '#e74c3c', bgColor: '#fadbd8' },
  'Wednesday': { name: 'ธาตุลม', color: '#f1c40f', bgColor: '#fcf3cf' },
  'Thursday': { name: 'ธาตุไม้', color: '#2ecc71', bgColor: '#d5f5e3' },
  'Friday': { name: 'ธาตุดิน', color: '#d35400', bgColor: '#b8a99a' }, // สีดินตามภาพ
  'Saturday': { name: 'ธาตุทอง', color: '#9b59b6', bgColor: '#e8daef' },
  'Sunday': { name: 'ธาตุทอง', color: '#f39c12', bgColor: '#fdebd0' },
};

// ข้อมูลสถานที่ท่องเที่ยวประจำวันเกิด
const travelDestinationsData = {
  'Monday': [
    { name: 'เกาะล้าน', image: '/images/buddha/พระประจำวันจันทร์.jpeg', mapLink: 'https://maps.google.com/?q=เกาะล้าน' },
    { name: 'ทะเลบางแสน', image: '/images/buddha/พระประจำวันจันทร์.jpeg', mapLink: 'https://maps.google.com/?q=ทะเลบางแสน' },
    { name: 'น้ำตกเอราวัณ', image: '/images/buddha/พระประจำวันจันทร์.jpeg', mapLink: 'https://maps.google.com/?q=น้ำตกเอราวัณ' },
  ],
  'Tuesday': [
    { name: 'ดอยอินทนนท์', image: '/images/buddha/พระประจำวันจันทร์.jpeg', mapLink: 'https://maps.google.com/?q=ดอยอินทนนท์' },
    { name: 'ภูกระดึง', image: '/images/buddha/พระประจำวันจันทร์.jpeg', mapLink: 'https://maps.google.com/?q=ภูกระดึง' },
    { name: 'เขาค้อ', image: '/images/buddha/พระประจำวันจันทร์.jpeg', mapLink: 'https://maps.google.com/?q=เขาค้อ' },
  ],
  'Wednesday': [
    { name: 'เกาะพีพี', image: '/images/buddha/พระประจำวันจันทร์.jpeg', mapLink: 'https://maps.google.com/?q=เกาะพีพี' },
    { name: 'อ่าวมาหยา', image: '/images/buddha/พระประจำวันจันทร์.jpeg', mapLink: 'https://maps.google.com/?q=อ่าวมาหยา' },
    { name: 'เกาะช้าง', image: '/images/travel/เกาะช้าง.jpg', mapLink: 'https://maps.google.com/?q=เกาะช้าง' },
  ],
  'Thursday': [
    { name: 'ปาย', image: '/images/travel/ปาย.jpg', mapLink: 'https://maps.google.com/?q=ปาย' },
    { name: 'เชียงคาน', image: '/images/travel/เชียงคาน.jpg', mapLink: 'https://maps.google.com/?q=เชียงคาน' },
    { name: 'น่าน', image: '/images/travel/น่าน.jpg', mapLink: 'https://maps.google.com/?q=น่าน' },
  ],
  'Friday': [
    { name: 'อยุธยา', image: '/images/travel/อยุธยา.jpg', mapLink: 'https://maps.google.com/?q=อยุธยา' },
    { name: 'สุโขทัย', image: '/images/travel/สุโขทัย.jpg', mapLink: 'https://maps.google.com/?q=สุโขทัย' },
    { name: 'กำแพงเพชร', image: '/images/travel/กำแพงเพชร.jpg', mapLink: 'https://maps.google.com/?q=กำแพงเพชร' },
  ],
  'Saturday': [
    { name: 'เกาะสมุย', image: '/images/travel/เกาะสมุย.jpg', mapLink: 'https://maps.google.com/?q=เกาะสมุย' },
    { name: 'เกาะเต่า', image: '/images/travel/เกาะเต่า.jpg', mapLink: 'https://maps.google.com/?q=เกาะเต่า' },
    { name: 'เกาะพะงัน', image: '/images/travel/เกาะพะงัน.jpg', mapLink: 'https://maps.google.com/?q=เกาะพะงัน' },
  ],
  'Sunday': [
    { name: 'เชียงใหม่', image: '/images/travel/เชียงใหม่.jpg', mapLink: 'https://maps.google.com/?q=เชียงใหม่' },
    { name: 'หัวหิน', image: '/images/travel/หัวหิน.jpg', mapLink: 'https://maps.google.com/?q=หัวหิน' },
    { name: 'พัทยา', image: '/images/travel/พัทยา.jpg', mapLink: 'https://maps.google.com/?q=พัทยา' },
  ],
};

// กำหนดเลขมงคลประจำวันเกิด (แยกตามวัน)
const luckyNumbersByDay = {
  'Monday': [36, 41, 59, 68],
  'Tuesday': [17, 24, 33, 89],
  'Wednesday': [22, 45, 54, 63],
  'Thursday': [19, 26, 35, 80],
  'Friday': [14, 23, 59, 86],
  'Saturday': [10, 28, 37, 64],
  'Sunday': [21, 39, 48, 57],
};

// ฟังก์ชันสุ่มสีมงคล
const getLuckyColors = (dayOfWeek: string) => {
  const colorMap = {
    'Monday': ['yellow', 'pink', 'blue'],
    'Tuesday': ['pink', 'white', 'red'],
    'Wednesday': ['green', 'cream', 'yellow'],
    'Thursday': ['orange', 'brown', 'purple'],
    'Friday': ['blue', 'light blue', 'white'],
    'Saturday': ['purple', 'black', 'dark blue'],
    'Sunday': ['red', 'orange', 'pink'],
  };
  
  const defaultColors = ['yellow', 'pink', 'blue'];
  return colorMap[dayOfWeek as keyof typeof colorMap] || defaultColors;
};

// ฟังก์ชันแปลงวันเกิดเป็นวันในสัปดาห์
const getBirthDayOfWeek = (birthDate: string | undefined) => {
  if (!birthDate) {
    return 'Monday'; // ค่าเริ่มต้น
  }
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  try {
    const date = new Date(birthDate);
    
    // ตรวจสอบว่าวันที่ถูกต้องหรือไม่
    if (isNaN(date.getTime())) {
      return 'Monday'; // ค่าเริ่มต้น
    }
    
    return days[date.getDay()];
  } catch (error) {
    return 'Monday'; // ค่าเริ่มต้น
  }
};

// ฟังก์ชันแปลงวันเกิดเป็นราศี
const getZodiacSign = (birthDate: string | undefined) => {
  if (!birthDate) {
    return "Aries"; // ค่าเริ่มต้น
  }
  
  try {
    const date = new Date(birthDate);
    if (isNaN(date.getTime())) {
      return "Aries"; // ค่าเริ่มต้น
    }
    
    const day = date.getDate();
    const month = date.getMonth() + 1;
    
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
    return "Pisces";
  } catch (error) {
    return "Aries"; // ค่าเริ่มต้น
  }
};

const formatBirthDate = (dateString: string | undefined) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return '';
    }
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day} ${getMonthName(month)} ${year}`;
  } catch (error) {
    return '';
  }
};

const getMonthName = (monthNum: string) => {
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  return months[parseInt(monthNum) - 1] || 'JAN';
};

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [luckyNumbers, setLuckyNumbers] = useState<number[]>([]);
  const [luckyColors, setLuckyColors] = useState<string[]>([]);
  const [dayOfWeek, setDayOfWeek] = useState<string>('');
  const [zodiacSign, setZodiacSign] = useState<string>('');
  const [destinations, setDestinations] = useState<any[]>([]);
  const [bgStyles, setBgStyles] = useState({ gradient: '', textColor: '' });
  
  useEffect(() => {
    // ถ้ายังไม่ได้ล็อกอิน ให้ redirect ไปหน้า login
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    
    // ถ้าล็อกอินแล้วและมีข้อมูลผู้ใช้
    if (user) {
      // คำนวณวันในสัปดาห์จากวันเกิด
      let birthDayOfWeek = user.dayOfBirth || '';
      
      if (!birthDayOfWeek && user.birthDate) {
        birthDayOfWeek = getBirthDayOfWeek(user.birthDate);
      } else if (!birthDayOfWeek) {
        birthDayOfWeek = 'Monday'; // ค่าเริ่มต้นถ้าไม่มีข้อมูล
      }
      
      setDayOfWeek(birthDayOfWeek);
      
      // ตั้งค่าพื้นหลังตามวันเกิด
      const elementInfo = elementsData[birthDayOfWeek as keyof typeof elementsData];
      setBgStyles({
        gradient: elementInfo?.bgColor || elementsData['Monday'].bgColor,
        textColor: elementInfo?.color || elementsData['Monday'].color
      });
      
      // ตั้งค่าสถานที่ท่องเที่ยวประจำวันเกิด
      const destinationData = travelDestinationsData[birthDayOfWeek as keyof typeof travelDestinationsData] || travelDestinationsData['Monday'];
      setDestinations(destinationData);
      
      // คำนวณราศี
      const userZodiac = user.zodiacSign || (user.birthDate ? getZodiacSign(user.birthDate) : 'Aries');
      setZodiacSign(userZodiac);
      
      // กำหนดเลขมงคลตามวันเกิด
      const numbers = luckyNumbersByDay[birthDayOfWeek as keyof typeof luckyNumbersByDay] || luckyNumbersByDay['Monday'];
      setLuckyNumbers(numbers);
      
      // สุ่มสีมงคล
      const colors = getLuckyColors(birthDayOfWeek);
      setLuckyColors(colors);
    }
  }, [user, isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">กำลังโหลด...</div>;
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">กรุณาเข้าสู่ระบบ</div>;
  }

  // สีมงคลที่แสดงในหน้า UI
  const colorStyles = {
    yellow: { bg: '#FFD700', text: 'เหลือง' },
    pink: { bg: '#FFC0CB', text: 'ชมพู' },
    blue: { bg: '#87CEEB', text: 'ฟ้า' },
    white: { bg: '#FFFFFF', text: 'ขาว' },
    red: { bg: '#FF6347', text: 'แดง' },
    green: { bg: '#98FB98', text: 'เขียว' },
    cream: { bg: '#FFFDD0', text: 'ครีม' },
    orange: { bg: '#FFA500', text: 'ส้ม' },
    brown: { bg: '#A0522D', text: 'น้ำตาล' },
    purple: { bg: '#DDA0DD', text: 'ม่วง' },
    black: { bg: '#696969', text: 'ดำ' },
    'light blue': { bg: '#ADD8E6', text: 'ฟ้าอ่อน' },
    'dark blue': { bg: '#00008B', text: 'น้ำเงินเข้ม' },
  };
  
  const avatarUrl = user.avatar || '/images/profile1.png';
  const userName = user.fullName || user.email.split('@')[0];
  const formattedBirthDate = user.birthDate ? formatBirthDate(user.birthDate) : '';
  
  return (
    <>
      <Head>
        <title>โปรไฟล์ - NUMMU</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>
      
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white p-4 flex justify-between items-center shadow-sm">
          <button className="text-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="text-orange-500 font-bold text-xl">NUMMU</div>
          <div className="flex space-x-2">
            <button className="bg-orange-500 text-white p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button className="bg-orange-500 text-white p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </header>
        
        {/* Main Content with Birthday-specific Background */}
        <main 
          className="flex-1 pb-16" 
          style={{ 
            background: bgStyles.gradient 
          }}
        >
          
          {/* Profile Section */}
          <div className="relative flex flex-col items-center pt-8 pb-4">
            {/* Edit Profile Button */}
            <Link 
              href="/edit-profile" 
              className="absolute top-2 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium"
            >
              แก้ไขโปรไฟล์
            </Link>
            
            {/* Avatar */}
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white bg-gray-200 shadow-md">
              <img 
                src={avatarUrl} 
                alt="Profile" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/default-avatar.png';
                }}
              />
            </div>
            
            {/* User Info */}
            <h2 
              className="text-xl font-semibold mt-3"
              style={{ color: bgStyles.textColor }}
            >
              {userName}
            </h2>
            {formattedBirthDate && (
              <p 
                className="text-lg mt-1"
                style={{ color: bgStyles.textColor }}
              >
                {formattedBirthDate}
              </p>
            )}
          </div>
          
          {/* Content Container */}
          <div className="mx-4 pb-4">
            {/* Lucky Numbers Section */}
            <div className="mb-4 bg-white bg-opacity-80 rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center">
                <div className="w-1/2 border-r border-amber-300 pr-4">
                  <h3 className="text-orange-500 text-sm mb-2">เลขมงคล</h3>
                  <div className="text-orange-500 text-3xl font-bold">
                    {luckyNumbers && luckyNumbers.length >= 4 ? (
                      <>
                        <span>{luckyNumbers[0]} {luckyNumbers[1]}</span>
                        <br />
                        <span>{luckyNumbers[2]} {luckyNumbers[3]}</span>
                      </>
                    ) : (
                      <span>-- --<br />-- --</span>
                    )}
                  </div>
                </div>
                
                <div className="w-1/2 pl-4">
                  <h3 className="text-orange-500 text-sm mb-2">สีมงคล</h3>
                  <div className="flex justify-around">
                    {luckyColors && luckyColors.length > 0 ? (
                      luckyColors.map((color, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div 
                            className="w-12 h-12 rounded-full mb-1" 
                            style={{ 
                              backgroundColor: colorStyles[color as keyof typeof colorStyles]?.bg || '#CCCCCC' 
                            }}
                          ></div>
                          <span className="text-orange-500 text-xs">
                            {colorStyles[color as keyof typeof colorStyles]?.text || color}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div>ไม่มีข้อมูล</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Zodiac Chart Section */}
            <div className="mb-4 bg-white bg-opacity-80 rounded-xl p-4 shadow-sm">
              <h3 
                className="text-lg mb-4"
                style={{ color: bgStyles.textColor }}
              >
                ราศีประจำตัว
              </h3>
              
              {/* Radar Chart */}
              <div className="flex justify-center items-center mb-4">
                <div className="w-64 h-64 relative">
                  <img 
                    src="/images/ธาตุ1.png" 
                    alt="Zodiac Chart" 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              </div>
              
              <p 
                className="text-center mt-2"
                style={{ color: bgStyles.textColor }}
              >
                ราศี{zodiacSign || 'ไม่ระบุ'}
              </p>
              <p 
                className="text-center overflow-hidden"
                style={{ color: bgStyles.textColor }}
              >
                XXXXXXXXXXXXXXXXXXXXXXXX
              </p>
            </div>
            
            {/* Travel Destinations Section */}
            <div className="mb-8 bg-white bg-opacity-80 rounded-xl p-4 shadow-sm">
              <h3 
                className="text-lg mb-4"
                style={{ color: bgStyles.textColor }}
              >
                สถานที่ท่องเที่ยวประจำวันเกิด
              </h3>
              
              {destinations && destinations.length > 0 ? (
                <div className="flex flex-row space-x-4 overflow-x-auto pb-2">
                  {destinations.map((destination: any, index: number) => (
                    <div 
                      key={index} 
                      className="bg-gradient-to-b from-orange-300 to-orange-400 rounded-xl p-3 w-full max-w-xs flex-shrink-0"
                    >
                      <img 
                        src={destination.image} 
                        alt={destination.name} 
                        className="w-full h-40 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/images/travel/default.jpg";
                        }}
                      />
                      <div className="flex justify-between items-center mt-2">
                        <p 
                          className="text-sm"
                          style={{ color: bgStyles.textColor }}
                        >
                          {destination.name}
                        </p>
                        <a 
                          href={destination.mapLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ backgroundColor: bgStyles.textColor, color: 'white' }}
                        >
                          Google Map
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  ไม่พบข้อมูลสถานที่ท่องเที่ยว กรุณาระบุวันเกิดในโปรไฟล์
                </div>
              )}
            </div>
          </div>
        </main>
        
        {/* Bottom Navigation Bar */}
        <BottomNavigation activePage="profile" />
      </div>
    </>
  );
}