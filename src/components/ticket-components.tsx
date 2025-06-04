import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import BottomNavigation from '@/components/BottomNavigation';
import { useAuth } from '@/contexts/AuthContext';
import ProfileSlideMenu from "@/components/ProfileSlideMenu";

// Types
interface Ticket {
  id: number;
  templeName: string;
  templeNameEn: string;
  price: number | 'free';
  image: string;
  description: string;
  descriptionEn: string;
  isFree: boolean;
  qrCodeUrl?: string;
  barcode?: string;
}

interface TicketHeaderProps {
  onBackClick: () => void;
  title: string;
  userName?: string;
  language: 'th' | 'en';
  avatar?: string | '/images/profile/travel/Profile.jpeg';
}

interface TicketListProps {
  tickets: Ticket[];
  onTicketClick: (ticket: Ticket) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  language: 'th' | 'en';
}

interface TicketDetailProps {
  ticket: Ticket;
  onSelectAmount: (amount: number) => void;
  onCustomAmount: (amount: number) => void;
  selectedAmount: number;
  customAmount: string;
  language: 'th' | 'en';
}

interface TicketConfirmationProps {
  ticket: Ticket;
  amount: number;
  onConfirm: () => void;
  language: 'th' | 'en';
}

interface TicketQRCodeProps {
  ticket: Ticket;
  amount: number;
  onUpload: (file: File) => void;
  onConfirmPayment: () => void;
  language: 'th' | 'en';
}

interface TicketSuccessProps {
  ticket: Ticket;
  language: 'th' | 'en';
}

interface TicketScreenProps {
  userName?: string;
  initialTab?: string;
  onBackClick?: () => void;
}

// Language translations
const translations = {
  th: {
    // Header
    greeting: "สวัสดี,ยินดีต้อนรับ",
    search: "ค้นหา...",
    buyTicket: "ซื้อตั๋ว",
    yourTicket: "ตั๋วของคุณ",
    
    // Tabs
    thai: "คนไทย",
    tourist: "TOURIST",
    
    // Ticket List
    free: "ฟรี",
    baht: "บาท",
    freeDonation: "ฟรี / บริจาค",
    
    // Ticket Detail
    freeOrDonation: "ฟรี หรือ บริจาคตามศรัทธา",
    amount: "จำนวนเงิน (บาท)",
    donationLimit: "มูลค่าของเงินบริจาคต้องไม่เกิน 20,000 บาท",
    
    // Confirmation
    confirmPurchase: "ยืนยันการซื้อตั๋ว",
    confirm: "ตกลง",
    
    // QR Code
    scanQR: "สแกนผ่าน QR",
    bank: "ธนาคารกรุงไทย",
    accountNumber: "เลขบัญชี 123-4-456-8889-87",
    accountName: "ชื่อบัญชี",
    uploadedSlip: "สลิปที่อัพโหลด:",
    uploadFile: "อัพโหลดไฟล์",
    changeFile: "เปลี่ยนไฟล์",
    confirmPayment: "ยืนยันการชำระเงิน",
    
    // Loading
    loading: "กำลังโหลด..."
  },
  en: {
    // Header
    greeting: "Hello, Welcome",
    search: "Search...",
    buyTicket: "Buy Ticket",
    yourTicket: "Your Ticket",
    
    // Tabs
    thai: "THAI",
    tourist: "TOURIST",
    
    // Ticket List
    free: "Free",
    baht: "Baht",
    freeDonation: "Free / Donation",
    
    // Ticket Detail
    freeOrDonation: "Free or Donation as you wish",
    amount: "Amount (Baht)",
    donationLimit: "Donation amount must not exceed 20,000 Baht",
    
    // Confirmation
    confirmPurchase: "Confirm Ticket Purchase",
    confirm: "Confirm",
    
    // QR Code
    scanQR: "Scan QR Code",
    bank: "Krung Thai Bank",
    accountNumber: "Account No. 123-4-456-8889-87",
    accountName: "Account Name",
    uploadedSlip: "Uploaded Slip:",
    uploadFile: "Upload File",
    changeFile: "Change File",
    confirmPayment: "Confirm Payment",
    
    // Loading
    loading: "Loading..."
  }
};

/**
 * คอมโพเนนต์แสดงส่วนหัวของหน้าซื้อตั๋ว
 */
export const TicketHeader: React.FC<TicketHeaderProps> = ({ 
  onBackClick, 
  title,
  userName = "Praewwy :)",
  language,
  avatar
}) => {
  const t = translations[language];
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="bg-orange-500 text-white p-4 rounded-b-3xl">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-white">
             <button
               
                onClick={() => setIsMenuOpen(true)}
              >
           <img
              src={avatar || '/api/placeholder/40/40'} 
              alt="Profile"
              className="w-full h-full object-cover"
            />
            </button>
          </div>
          <div>
            <p className="text-white text-sm">{t.greeting}</p>
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
      <div className="flex items-center justify-center relative mb-2">
        <button onClick={onBackClick} className="absolute left-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-2xl font-semibold">{title}</h2>
      </div>
      
      {/* ช่องค้นหา */}
      <div className="relative mt-4">
        <input 
          type="text" 
          placeholder={t.search}
          className="w-full bg-white rounded-full px-10 py-2 text-gray-700"
        />
        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      
    <ProfileSlideMenu
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
          />
        </div>
  );
};

/**
 * คอมโพเนนต์แสดงรายการตั๋ว
 */
export const TicketList: React.FC<TicketListProps> = ({ 
  tickets, 
  onTicketClick, 
  activeTab, 
  onTabChange,
  language
}) => {
  const scrollContainer = useRef<HTMLDivElement>(null);
  const t = translations[language];

  // กรองตั๋วตาม tab ที่เลือก
  const filteredTickets = tickets.filter(ticket => {
    if (activeTab === 'all') return true; // คนไทย = แสดงทั้งหมด
    if (activeTab === 'free') return true; // TOURIST = แสดงทั้งหมดแต่ราคาต่าง
    return true;
  });

  return (
    <div className="p-4 pb-20">
      {/* Tabs */}
      <div className="flex mb-6 justify-center">
        <button
          className={`px-16 py-3 rounded-full text-sm font-medium whitespace-nowrap ${
            activeTab === 'all' 
              ? 'bg-pink-400 text-white' 
              : 'bg-gray-200 text-gray-600'
          }`}
          onClick={() => onTabChange('all')}
        >
          {t.thai}
        </button>
        <button
          className={`px-16 py-3 rounded-full text-sm font-medium whitespace-nowrap ml-2 ${
            activeTab === 'free' 
              ? 'bg-pink-400 text-white' 
              : 'bg-gray-200 text-gray-600'
          }`}
          onClick={() => onTabChange('free')}
        >
          {t.tourist}
        </button>
      </div>
      
      {/* Ticket Cards */}
      <div className="space-y-6">
        {filteredTickets.map(ticket => (
          <div 
            key={ticket.id} 
            className="bg-white rounded-xl overflow-hidden shadow-md"
            onClick={() => onTicketClick(ticket)}
          >
            <div className="relative">
              <img 
                src={ticket.image} 
                alt={language === 'th' ? ticket.templeName : ticket.templeNameEn} 
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-1 rounded-full">
                {language === 'en' ? 
                  // ราคาสำหรับชาวต่างชาติ (fix ราคา)
                  (ticket.id === 1 ? '100 Baht' : '200 Baht')
                  :
                  // ราคาสำหรับคนไทย
                  (ticket.isFree ? t.free : `${ticket.price} ${t.baht}`)
                }
              </div>
            </div>
            <div className="p-4 bg-pink-300">
              <h3 className="text-lg font-medium">
                {language === 'th' ? ticket.templeName : ticket.templeNameEn}
              </h3>
              <p className="text-sm text-white-600 whitespace-pre-wrap">
                {(language === 'th' ? ticket.description : ticket.descriptionEn)
                  .split('\n').map((line, index) => (
                  <span key={index}>
                    {line.trim()}
                    {index < (language === 'th' ? ticket.description : ticket.descriptionEn).split('/').length - 1 && <br />}
                  </span>
                ))}
              </p>
              <button className="w-full mt-4 bg-white text-orange-500 rounded-full py-2 font-medium">
                {language === 'en' ? 
                  // ราคาสำหรับชาวต่างชาติ (fix ราคา)
                  (ticket.id === 1 ? '100 Baht' : '200 Baht')
                  :
                  // ราคาสำหรับคนไทย
                  (ticket.isFree ? t.freeDonation : `${ticket.price} ${t.baht}`)
                }
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * คอมโพเนนต์แสดงรายละเอียดตั๋วและให้เลือกราคา
 */
export const TicketDetail: React.FC<TicketDetailProps> = ({ 
  ticket, 
  onSelectAmount, 
  onCustomAmount,
  selectedAmount,
  customAmount,
  language
}) => {
  const t = translations[language];
  
  // สำหรับชาวต่างชาติ - ไม่แสดงตัวเลือกราคา แสดงเฉพาะราคาที่ fix
  if (language === 'en') {
    const fixedPrice = ticket.id === 1 ? 100 : 200;
    
    return (
      <div className="min-h-screen p-4 bg-orange-500 h-full flex flex-col">
        <h2 className="text-white text-2xl font-semibold mb-6">
          {ticket.templeNameEn}
        </h2>
        
        {/* แสดงราคาที่ fix สำหรับชาวต่างชาติ */}
        <div className="bg-orange-300 rounded-3xl p-6 mb-6">
          <div className="text-center">
            <h3 className="text-white text-xl font-semibold mb-4">Admission Fee</h3>
            <div className="flex items-center justify-center">
              <span className="text-white text-6xl font-bold">{fixedPrice}</span>
              <span className="text-white text-2xl ml-2">THB</span>
            </div>
            <p className="text-white text-sm mt-4">Fixed price for international visitors</p>
          </div>
        </div>
      </div>
    );
  }

  // สำหรับคนไทย - แสดงตัวเลือกราคาแบบเดิม
  const predefinedAmounts = [
    ticket.isFree ? 0 : (ticket.price as number),
    10,
    20,
    30,
    40,
    50
  ];

  return (
    <div className="min-h-screen p-4 bg-orange-500 h-full flex flex-col">
      <h2 className="text-white text-2xl font-semibold mb-6">
        {ticket.templeName}
      </h2>
      <p className="text-white mb-2">
        {ticket.isFree ? t.freeOrDonation : `${ticket.price} ${t.baht}`}
      </p>
      
      {/* ตัวเลือกจำนวนเงิน */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {predefinedAmounts.map((amount, index) => (
          <button 
            key={index}
            className={`py-3 rounded-full ${
              selectedAmount === amount 
                ? 'bg-white text-orange-500' 
                : 'bg-orange-300 text-white'
            }`}
            onClick={() => onSelectAmount(amount)}
          >
            {amount === 0 ? t.free : `${amount} ${t.baht}`}
          </button>
        ))}
      </div>
      
      {/* ใส่จำนวนเงินเอง */}
      <div className="mb-2">
        <label className="text-white bg-white-300 block mb-2">{t.amount}</label>
        <input 
          type="text"
          value={customAmount}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, '');
            onCustomAmount(parseInt(value) || 0);
          }}
          className="w-full p-3 bg-white rounded-full text-right"
          placeholder="0.00"
        />
      </div>
      <p className="text-white text-sm mb-4">{t.donationLimit}</p>
    </div>
  );
};

/**
 * คอมโพเนนต์ยืนยันการซื้อตั๋ว
 */
export const TicketConfirmation: React.FC<TicketConfirmationProps> = ({ 
  ticket, 
  amount, 
  onConfirm,
  language
}) => {
  const t = translations[language];
  
  return (
    <div className="min-h-screen bg-orange-500 flex flex-col">
      {/* พื้นหลังสีส้ม */}
      <div className="flex-1 p-4 flex flex-col mt-5 justify-top items-top">
        {/* การ์ดสีชมพู */}
        <div className="bg-pink-200 rounded-3xl p-8 w-full max-w-md mx-auto shadow-lg">
          
          {/* หัวข้อ */}
          <div className="text-center mb-8">
            <h2 className="text-orange-500 text-2xl font-bold mb-2">
              {language === 'th' ? 'ยืนยันการซื้อตั๋ว' : 'Confirm Ticket'}
            </h2>
            <p className="text-orange-500 text-lg">
              {language === 'th' ? 'ใน' : 'in'} {language === 'th' ? ticket.templeName : ticket.templeNameEn}
            </p>
          </div>
          
          {/* ราคา */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center">
              <span className="text-orange-500 text-7xl font-bold">{amount}</span>
              <span className="text-orange-500 text-2xl font-medium ml-2">THB</span>
            </div>
          </div>
          
          {/* ปุ่มยืนยัน */}
          <button 
            className="w-full bg-white text-orange-500 py-4 rounded-full font-bold text-lg shadow-md hover:shadow-lg transition-shadow"
            onClick={onConfirm}
          >
            {language === 'th' ? 'ยืนยัน' : 'CONFIRM'}
          </button>
          
        </div>
      </div>
    </div>
  );
};

/**
 * คอมโพเนนต์แสดง QR Code สำหรับชำระเงินและอัพโหลดสลิป
 */
export const TicketQRCode: React.FC<TicketQRCodeProps> = ({ 
  ticket, 
  amount, 
  onUpload,
  onConfirmPayment,
  language
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const t = translations[language];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // สร้าง URL สำหรับแสดงรูปภาพ
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      
      onUpload(file);
    }
  };

  // ล้าง URL เมื่อคอมโพเนนต์ถูกทำลาย
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="min-h-screen p-4 bg-orange-500 h-full flex flex-col items-center">
      <div className="bg-pink-100 rounded-3xl p-6 w-full max-w-md">
        <h2 className="text-center text-xl font-semibold mb-6 text-orange-500">
          {t.scanQR}
        </h2>
        
        {/* QR Code */}
        <div className="flex justify-center mb-4">
          <div className="bg-white p-4 rounded-lg">
            <img 
              src="/images/ticket/qr2.png" 
              alt="QR Code for payment" 
              className="w-40 h-40"
            />
          </div>
        </div>
        
        <div className="text-center mb-6">
          <p className="text-medium text-orange-500">{t.bank}</p>
          <p className="text-medium text-orange-500">{t.accountNumber}</p>
          <p className="text-medium text-orange-500">
            {t.accountName} {language === 'th' ? ticket.templeName : ticket.templeNameEn}
          </p>
        </div>
        
        {/* แสดงรูปภาพที่อัพโหลด */}
        {previewUrl && (
          <div className="mb-4">
            <p className="text-center mb-2 font-medium">{t.uploadedSlip}</p>
            <div className="flex justify-center">
              <img 
                src={previewUrl} 
                alt="Uploaded slip" 
                className="max-w-full max-h-64 rounded-lg border-2 border-white"
              />
            </div>
          </div>
        )}
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
        
        <button 
          className="w-full bg-white text-orange-500 py-3 rounded-full font-medium"
          onClick={handleUploadClick}
        >
          {selectedFile ? t.changeFile : t.uploadFile}
        </button>
        
        {selectedFile && (
          <button 
            className="w-full bg-green-500 text-white py-3 rounded-full font-medium mt-2"
            onClick={onConfirmPayment}
          >
            {t.confirmPayment}
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * คอมโพเนนต์แสดงตั๋วที่ซื้อสำเร็จ
 */
export const TicketSuccess: React.FC<TicketSuccessProps> = ({ ticket, language }) => {
  return (
    <div className="min-h-screen bg-yellow-100 flex flex-col p-4">
      {/* ส่วนบนสีส้ม */}
      <div className="bg-orange-500 rounded-3xl p-6 w-full max-w-md">
        
        {/* ภาพตั๋วทั้งหมด */}
        <div className="flex justify-center">
          <img 
            src="/images/ticket/AW.png"
            alt="Ticket" 
            className="w-full max-w-xs object-contain"
          />
        </div>
      </div>
    </div>
  );
};

/**
 * คอมโพเนนต์หลักสำหรับกระบวนการซื้อตั๋ว
 */
export const TicketScreen: React.FC<TicketScreenProps> = ({ 
  userName, 
  initialTab = 'all',
  onBackClick 
}) => {
  const router = useRouter();

  // 
  const [activeTab, setActiveTab] = useState(initialTab);
  const [language, setLanguage] = useState<'th' | 'en'>('th'); 
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'list' | 'detail' | 'confirm' | 'qrcode' | 'success'>('list');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const t = translations[language];

  // ดึงข้อมูลตั๋ว
  useEffect(() => {
    // จำลองข้อมูล
    const mockTickets: Ticket[] = [
      {
        id: 1,
        templeName: 'วัดสุทัศน์เทพวราราม',
        templeNameEn: 'Wat Suthat Thepwararam',
        price: 'free',
        isFree: true,
        image: '/images/ticket/วัดสุทัศน์.jpeg',
        description: 'ฟรี หรือ บริจาคตามศรัทธา',
        descriptionEn: 'Free or Donation as you wish'
      },
      {
        id: 2,
        templeName: 'พิพิธภัณฑ์วัดสุทัศน์',
        templeNameEn: 'Wat Suthat Museum',
        price: 50,
        isFree: false,
        image: '/images/ticket/พิพิธภัณฑ์ตำหนักสมเด็จพระสังฆราช.jpeg',
        description: 'ค่าธรรมเนียม : คนไทย 50 บาท/ชาวต่างชาติ 200 บาท \n ยกเว้นค่าเข้าชม : นักเรียน-นักศึกษาปริญญาตรี (แสดงบัตร)/ \n ผู้สูงอายุตั้งแต่ 60 ปีขึ้นไป/พระภิกษุสงฆ์-สามเณร/ผู้พิการ',
        descriptionEn: 'Admission Fee: Thai 50 Baht / Foreigner 200 Baht \n Free Admission: Students (with ID) / \n Senior citizens 60+ / Monks / Disabled persons'
      },
    ];
    
    setTickets(mockTickets);
    setLoading(false);
  }, []);

  // เมื่อเปลี่ยน tab จะเปลี่ยนภาษาด้วย
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'all') {
      setLanguage('th'); // คนไทย = ภาษาไทย
    } else if (tab === 'free') {
      setLanguage('en'); // TOURIST = ภาษาอังกฤษ
    }
  };

  const handleBackClick = () => {
    if (step === 'list') {
      if (onBackClick) {
        onBackClick();
      } else {
        router.push('/dashboard');
      }
    } else if (step === 'detail') {
      setStep('list');
    } else if (step === 'confirm') {
      setStep('detail');
    } else if (step === 'qrcode') {
      setStep('confirm');
    } else if (step === 'success') {
      setStep('list');
    }
  };

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    
    if (language === 'en') {
      // สำหรับชาวต่างชาติ - fix ราคา ไม่ให้เลือก
      const foreignerPrice = ticket.id === 1 ? 100 : 200; // วัดสุทัศน์ = 100, พิพิธภัณฑ์ = 200
      setSelectedAmount(foreignerPrice);
      setCustomAmount(foreignerPrice.toString());
    } else {
      // สำหรับคนไทย - ราคาปกติ
      setSelectedAmount(ticket.isFree ? 0 : ticket.price as number);
      setCustomAmount(ticket.isFree ? '0' : (ticket.price as number).toString());
    }
    
    setStep('detail');
  };

  const handleSelectAmount = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount(amount.toString());
  };

  const handleCustomAmount = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount(amount.toString());
  };

  const handleConfirm = () => {
    setStep('confirm');
  };

  const handleProceedToPayment = () => {
    setStep('qrcode');
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    // จำลองการส่งไฟล์ไปยังเซิร์ฟเวอร์และรับ QR Code URL กับ Barcode กลับมา
    if (selectedTicket) {
      const updatedTicket: Ticket = {
        ...selectedTicket,
        qrCodeUrl: `/api/qrcode/${selectedTicket.id}`,
        barcode: `9 789870 ${Math.floor(Math.random() * 1000000)}`
      };
      setSelectedTicket(updatedTicket);
    }
  };

  const handleConfirmPayment = () => {
    // ส่งข้อมูลการชำระเงินและไฟล์ไปยังเซิร์ฟเวอร์ (จำลอง)
    setStep('success');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-orange-500">{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ส่วนหัว */}
      <TicketHeader
        onBackClick={handleBackClick}
        title={step === 'success' ? t.yourTicket : t.buyTicket}
        userName={user?.fullName || 'Guest'} 
        language={language}
        avatar={user?.avatar || '/images/profile/travel/Profile.jpeg'} 
      />
      
      {/* เนื้อหาตามขั้นตอน */}
      {step === 'list' && (
        <TicketList 
          tickets={tickets}
          onTicketClick={handleTicketClick}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          language={language}
        />
      )}
      
      {step === 'detail' && selectedTicket && (
        <>
          <TicketDetail 
            ticket={selectedTicket}
            onSelectAmount={handleSelectAmount}
            onCustomAmount={handleCustomAmount}
            selectedAmount={selectedAmount}
            customAmount={customAmount}
            language={language}
          />
          
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white">
            <button 
              className="w-full bg-pink-400 text-white py-3 rounded-full font-medium"
              onClick={handleConfirm}
            >
              {language === 'th' ? 'ซื้อตั๋ว' : 'Buy Ticket'}
            </button>
          </div>
        </>
      )}
      
      {step === 'confirm' && selectedTicket && (
        <TicketConfirmation 
          ticket={selectedTicket}
          amount={selectedAmount}
          onConfirm={handleProceedToPayment}
          language={language}
        />
      )}
      
      {step === 'qrcode' && selectedTicket && (
        <TicketQRCode 
          ticket={selectedTicket}
          amount={selectedAmount}
          onUpload={handleFileUpload}
          onConfirmPayment={handleConfirmPayment}
          language={language}
        />
      )}
      
      {step === 'success' && selectedTicket && (
        <TicketSuccess 
          ticket={selectedTicket} 
          language={language}
        />
      )}
      
      {/* Navbar ด้านล่าง (แสดงเฉพาะหน้าแรก) */}
      {step === 'list' && (
        <BottomNavigation activePage="profile" />
      )}
    </div>
  );
};