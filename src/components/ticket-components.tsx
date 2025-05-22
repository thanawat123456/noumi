import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import BottomNavigation from '@/components/BottomNavigation';

// Types
interface Ticket {
  id: number;
  templeName: string;
  price: number | 'free';
  image: string;
  description: string;
  isFree: boolean;
  qrCodeUrl?: string; // เพิ่ม field สำหรับเก็บ QR Code URL
  barcode?: string; // เพิ่ม field สำหรับเก็บ Barcode
}

interface TicketHeaderProps {
  onBackClick: () => void;
  title: string;
  userName?: string;
}

interface TicketListProps {
  tickets: Ticket[];
  onTicketClick: (ticket: Ticket) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface TicketDetailProps {
  ticket: Ticket;
  onSelectAmount: (amount: number) => void;
  onCustomAmount: (amount: number) => void;
  selectedAmount: number;
  customAmount: string;
}

interface TicketConfirmationProps {
  ticket: Ticket;
  amount: number;
  onConfirm: () => void;
}

interface TicketQRCodeProps {
  ticket: Ticket;
  amount: number;
  onUpload: (file: File) => void;
  onConfirmPayment: () => void;
}

interface TicketSuccessProps {
  ticket: Ticket;
}

interface TicketScreenProps {
  userName?: string;
  initialTab?: string;
  onBackClick?: () => void;
}

/**
 * คอมโพเนนต์แสดงส่วนหัวของหน้าซื้อตั๋ว
 */
export const TicketHeader: React.FC<TicketHeaderProps> = ({ 
  onBackClick, 
  title,
  userName = "Praewwy :)" 
}) => {
  return (
    <div className="bg-orange-500 text-white p-4 rounded-b-3xl">
      <div className="flex items-center justify-between mb-2">
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
          placeholder="ค้นหา..." 
          className="w-full bg-white rounded-full px-10 py-2 text-gray-700"
        />
        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
};

/**
 * คอมโพเนนต์แสดงรายการตั๋ว
 */
/**
 * คอมโพเนนต์แสดงรายการตั๋ว
 */
export const TicketList: React.FC<TicketListProps> = ({ 
  tickets, 
  onTicketClick, 
  activeTab, 
  onTabChange 
}) => {
  const scrollContainer = useRef<HTMLDivElement>(null);

  // กรองตั๋วตาม tab ที่เลือก
  const filteredTickets = tickets.filter(ticket => {
    if (activeTab === 'all') return true;
    if (activeTab === 'free') return ticket.isFree;
    if (activeTab === 'paid') return !ticket.isFree;
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
          คนไทย
        </button>
        <button
          className={`px-16 py-3 rounded-full text-sm font-medium whitespace-nowrap ml-2 ${
            activeTab === 'free' 
              ? 'bg-pink-400 text-white' 
              : 'bg-gray-200 text-gray-600'
          }`}
          onClick={() => onTabChange('free')}
        >
          TOURIST
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
                alt={ticket.templeName} 
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-1 rounded-full">
                {ticket.isFree ? 'ฟรี' : `${ticket.price} บาท`}
              </div>
            </div>
            <div className="p-4 bg-pink-300">
              <h3 className="text-lg font-medium">{ticket.templeName}</h3>
              <p className="text-sm text-white-600 whitespace-pre-wrap">
                {ticket.description.split('\n').map((line, index) => (
                  <span key={index}>
                    {line.trim()}
                    {index < ticket.description.split('/').length - 1 && <br />}
                  </span>
                ))}
              </p>
              <button className="w-full mt-4 bg-white text-orange-500 rounded-full py-2 font-medium">
                {ticket.isFree ? 'ฟรี / บริจาค' : `${ticket.price} บาท`}
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
  customAmount
}) => {
  // จำนวนเงินที่เลือกได้
  const predefinedAmounts = [
    ticket.isFree ? 0 : (ticket.price as number),
    10,
    20,
    30,
    40,
    50
  ];

  return (
    <div className=" min-h-screen p-4 bg-orange-500 h-full flex flex-col">
      <h2 className="text-white text-2xl font-semibold mb-6">{ticket.templeName}</h2>
      <p className="text-white mb-2">{ticket.isFree ? 'ฟรี หรือ บริจาคตามศรัทธา' : `${ticket.price} บาท`}</p>
      
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
            {amount === 0 ? 'ฟรี' : `${amount} บาท`}
          </button>
        ))}
      </div>
      
      {/* ใส่จำนวนเงินเอง */}
      <div className="mb-2">
        <label className="text-white bg-white-300 block mb-2">จำนวนเงิน (บาท)</label>
        <input 
          type="text"
          value={customAmount}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, '');
            onCustomAmount(parseInt(value) || 0);
          }}
          className="w-full p-3  bg-white rounded-full text-right"
          placeholder="0.00"
        />
      </div>
      <p className="text-white text-sm mb-4">มูลค่าของเงินบริจาคต้องไม่เกิน 20,000 บาท</p>
    </div>
  );
};

/**
 * คอมโพเนนต์ยืนยันการซื้อตั๋ว
 */
export const TicketConfirmation: React.FC<TicketConfirmationProps> = ({ 
  ticket, 
  amount, 
  onConfirm 
}) => {
  return (
    <div className="p-4 bg-orange-500  h-full flex flex-col items-center">
      <div className="bg-pink-100 rounded-3xl p-6 w-full max-w-md">
        <h2 className="text-center text-orange-500 text-2xl font-semibold mb-2">ยืนยันการซื้อตั๋ว</h2>
        <p className="text-center text-orange-500 mb-6">{ticket.templeName}</p>
        
        <div className="flex items-center justify-center">
          <span className="text-orange-500 text-6xl font-bold">{amount}</span>
          <span className="text-orange-500 text-2xl ml-2">THB</span>
        </div>
        
        <button 
          className="w-full mt-8 bg-white text-orange-500 py-3 rounded-full font-medium"
          onClick={onConfirm}
        >
          ตกลง
        </button>
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
  onConfirmPayment
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
        <h2 className="text-center text-xl font-semibold mb-6 text-orange-500" >สแกนผ่าน QR</h2>
        
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
          <p className="text-medium text-orange-500">ธนาคารกรุงไทย</p>
          <p className="text-medium text-orange-500">เลขบัญชี 123-4-456-8889-87</p>
          <p className="text-medium text-orange-500">ชื่อบัญชี {ticket.templeName}</p>
        </div>
        
        {/* แสดงรูปภาพที่อัพโหลด */}
        {previewUrl && (
          <div className="mb-4">
            <p className="text-center mb-2 font-medium">สลิปที่อัพโหลด:</p>
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
          {selectedFile ? 'เปลี่ยนไฟล์' : 'อัพโหลดไฟล์'}
        </button>
        
        {selectedFile && (
          <button 
            className="w-full bg-green-500 text-white py-3 rounded-full font-medium mt-2"
            onClick={onConfirmPayment}
          >
            ยืนยันการชำระเงิน
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * คอมโพเนนต์แสดงตั๋วที่ซื้อสำเร็จ
 */
/**
 * คอมโพเนนต์แสดงตั๋วที่ซื้อสำเร็จ
 */
/**
 * คอมโพเนนต์แสดงตั๋วที่ซื้อสำเร็จ
 */
export const TicketSuccess: React.FC<TicketSuccessProps> = ({ ticket }) => {
  return (
    <div className="min-h-screen bg-yellow-100 flex flex-col p-4">
      {/* ส่วนบนสีส้ม */}
      <div className="bg-orange-500 rounded-3xl p-6 w-full max-w-md">
        
        {/* ภาพตั๋วทั้งหมด */}
        <div className="flex justify-center">
          <img 
            src="/images/ticket/AW.png"
            alt="Ticket" 
            className="w-full max-w-xs object-contain" // ปรับขนาดให้เหมาะสมกับหน้าจอ
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

  // สถานะต่างๆ
  const [activeTab, setActiveTab] = useState(initialTab);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'list' | 'detail' | 'confirm' | 'qrcode' | 'success'>('list');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // ดึงข้อมูลตั๋ว
  useEffect(() => {
    // จำลองข้อมูล
    const mockTickets: Ticket[] = [
      {
        id: 1,
        templeName: 'วัดสุทัศน์เทพวราราม',
        price: 'free',
        isFree: true,
        image: '/images/ticket/วัดสุทัศน์.jpeg',
        description: 'ฟรี หรือ บริจาคตามศรัทธา'
      },
      {
        id: 2,
        templeName: 'พิพิธภัณฑ์วัดสุทัศน์',
        price: 50,
        isFree: false,
        image: '/images/ticket/พิพิธภัณฑ์ตำหนักสมเด็จพระสังฆราช.jpeg',
        description: 'ค่าธรรมเนียม : คนไทย 50 บาท/ชาวต่างชาติ 200 บาท \n ยกเว้นค่าเข้าชม : นักเรียน-นักศึกษาปริญญาตรี (แสดงบัตร)/ \n ผู้สูงอายุตั้งแต่ 60 ปีขึ้นไป/พระภิกษุสงฆ์-สามเณร/ผู้พิการ'
      },
     
    ];
    
    setTickets(mockTickets);
    setLoading(false);
  }, []);

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
    setSelectedAmount(ticket.isFree ? 0 : ticket.price as number);
    setCustomAmount(ticket.isFree ? '0' : (ticket.price as number).toString());
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
        qrCodeUrl: `/api/qrcode/${selectedTicket.id}`, // จำลอง URL ของ QR Code
        barcode: `9 789870 ${Math.floor(Math.random() * 1000000)}` // จำลอง Barcode
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
          <p className="mt-4 text-orange-500">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ส่วนหัว */}
      <TicketHeader 
        onBackClick={handleBackClick}
        title={step === 'success' ? 'ตั๋วของคุณ' : 'ซื้อตั๋ว'}
        userName={userName}
      />
      
      {/* เนื้อหาตามขั้นตอน */}
      {step === 'list' && (
        <TicketList 
          tickets={tickets}
          onTicketClick={handleTicketClick}
          activeTab={activeTab}
          onTabChange={setActiveTab}
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
          />
          
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white">
            <button 
              className="w-full bg-pink-400 text-white py-3 rounded-full font-medium"
              onClick={handleConfirm}
            >
              ซื้อตั๋ว
            </button>
          </div>
        </>
      )}
      
      {step === 'confirm' && selectedTicket && (
        <TicketConfirmation 
          ticket={selectedTicket}
          amount={selectedAmount}
          onConfirm={handleProceedToPayment}
        />
      )}
      
      {step === 'qrcode' && selectedTicket && (
        <TicketQRCode 
          ticket={selectedTicket}
          amount={selectedAmount}
          onUpload={handleFileUpload}
          onConfirmPayment={handleConfirmPayment}
        />
      )}
      
      {step === 'success' && selectedTicket && (
        <TicketSuccess ticket={selectedTicket} />
      )}
      
      {/* Navbar ด้านล่าง (แสดงเฉพาะหน้าแรก) */}
      {step === 'list' && (
        <BottomNavigation activePage="profile" />
      )}
    </div>
  );
};