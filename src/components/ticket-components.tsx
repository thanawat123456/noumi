import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import BottomNavigation from "@/components/BottomNavigation";
import { useAuth } from "@/contexts/AuthContext";
import ProfileSlideMenu from "@/components/ProfileSlideMenu";
import WhiteHeaderProfile from "./header-profile/white-header";

// Types
interface Ticket {
  id: number;
  templeName: string;
  templeNameEn: string;
  price: number | "free";
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
  language: "th" | "en";
  avatar?: string | "/images/profile/travel/Profile.jpeg";
  step: "list" | "detail" | "confirm" | "qrcode" | "success";
}

interface TicketListProps {
  tickets: Ticket[];
  onTicketClick: (ticket: Ticket) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  language: "th" | "en";
}

interface TicketDetailProps {
  ticket: Ticket;
  onSelectAmount: (amount: number) => void;
  onCustomAmount: (amount: number) => void;
  selectedAmount: number;
  customAmount: string;
  language: "th" | "en";
  onBackClick: () => void;
}

interface TicketConfirmationProps {
  ticket: Ticket;
  amount: number;
  onConfirm: () => void;
  language: "th" | "en";
  onBackClick: () => void;
}

interface TicketQRCodeProps {
  ticket: Ticket;
  amount: number;
  onUpload: (file: File) => void;
  onConfirmPayment: () => void;
  language: "th" | "en";
  onBackClick: () => void;
}

interface TicketSuccessProps {
  ticket: Ticket;
  language: "th" | "en";
}

interface TicketScreenProps {
  userName?: string;
  initialTab?: string;
  onBackClick?: () => void;
}

// Language translations
const translations = {
  th: {
    greeting: "สวัสดี,ยินดีต้อนรับ",
    search: "ค้นหา...",
    buyTicket: "ซื้อตั๋ว",
    yourTicket: "ตั๋วของคุณ",
    thai: "คนไทย",
    tourist: "TOURIST",
    free: "ฟรี",
    baht: "บาท",
    freeDonation: "ฟรี / บริจาค",
    freeOrDonation: "ฟรี หรือ บริจาคตามศรัทธา",
    amount: "จำนวนเงิน (บาท)",
    donationLimit: "มูลค่าของเงินบริจาคต้องไม่เกิน 20,000 บาท",
    confirmPurchase: "ยืนยันการซื้อตั๋ว",
    confirm: "ตกลง",
    scanQR: "สแกนผ่าน QR",
    bank: "ธนาคารกรุงไทย",
    accountNumber: "เลขบัญชี 123-4-456-8889-87",
    accountName: "ชื่อบัญชี",
    uploadedSlip: "สลิปที่อัพโหลด:",
    uploadFile: "อัพโหลดไฟล์",
    changeFile: "เปลี่ยนไฟล์",
    confirmPayment: "ยืนยันการชำระเงิน",
    loading: "กำลังโหลด...",
  },
  en: {
    greeting: "Hello, Welcome",
    search: "Search...",
    buyTicket: "Buy Ticket",
    yourTicket: "Your Ticket",
    thai: "THAI",
    tourist: "TOURIST",
    free: "Free",
    baht: "Baht",
    freeDonation: "Free / Donation",
    freeOrDonation: "Free or Donation as you wish",
    amount: "Amount (Baht)",
    donationLimit: "Donation amount must not exceed 20,000 Baht",
    confirmPurchase: "Confirm Ticket Purchase",
    confirm: "Confirm",
    scanQR: "Scan QR Code",
    bank: "Krung Thai Bank",
    accountNumber: "Account No. 123-4-456-8889-87",
    accountName: "Account Name",
    uploadedSlip: "Uploaded Slip:",
    uploadFile: "Upload File",
    changeFile: "Change File",
    confirmPayment: "Confirm Payment",
    loading: "Loading...",
  },
};

/**
 * Header Component
 */
export const TicketHeader: React.FC<TicketHeaderProps> = ({
  onBackClick,
  title,
  userName = "Praewwy :)",
  language,
  avatar,
  step,
}) => {
  const t = translations[language];
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getHeaderClass = () => {
    if (step === "list" || step === "success") {
      return "bg-[#FF7A05] text-white p-4 rounded-br-3xl";
    } else {
      return "bg-white text-[#FF7A05] p-4 relative z-10";
    }
  };

  const getIconColor = () => {
    if (step === "list" || step === "success") {
      return "text-[#FF7A05]";
    } else {
      return "text-white";
    }
  };

  const getButtonBgColor = () => {
    if (step === "list" || step === "success") {
      return "bg-white";
    } else {
      return "bg-[#FF7A05]";
    }
  };

  const getTextColor = () => {
    if (step === "list" || step === "success") {
      return "text-white";
    } else {
      return "text-[#FF7A05]";
    }
  };

  return (
    <div
      className={getHeaderClass()}
      style={{ borderBottomRightRadius: "50px" }}
    >
      <div className="flex items-center justify-between mb-2 mt-5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-white">
            <button onClick={() => setIsMenuOpen(true)}>
              <img
                src={avatar || "/api/placeholder/40/40"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>
          </div>
          <div>
            <p className={`text-sm ${getTextColor()}`}>{t.greeting}</p>
            <h3 className={`text-xl font-medium ${getTextColor()}`}>
              {userName}
            </h3>
          </div>
        </div>
        <div className="flex space-x-2">
          <Link href="/notifications">
            <button
              className={`w-8 h-8 rounded-full ${getButtonBgColor()} flex items-center justify-center`}
            >
              <svg
                className={`w-5 h-5 ${getIconColor()}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
          </Link>
          <Link href="/favorites">
            <button
              className={`w-8 h-8 rounded-full ${getButtonBgColor()} flex items-center justify-center`}
            >
              <svg
                className={`w-5 h-5 ${getIconColor()}`}
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
            </button>
          </Link>
        </div>
      </div>

      {(step === "list" || step === "success") && (
        <div className="flex items-center justify-center relative mb-2">
          <button onClick={onBackClick} className="absolute left-4">
            <svg
              className={`w-6 h-6 ${getTextColor()}`}
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
          <h2 className={`text-2xl font-semibold ${getTextColor()}`}>
            {title}
          </h2>
        </div>
      )}

      {/* ช่องค้นหา - แสดงเฉพาะ step list เท่านั้น */}
      {step === "list" && (
        <div className="relative mt-4">
          <input
            type="text"
            placeholder={t.search}
            className="w-full bg-white rounded-full px-10 py-2 text-gray-700"
          />
          <svg
            className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      )}

      <ProfileSlideMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </div>
  );
};

/**
 * Ticket List Component
 */
export const TicketList: React.FC<TicketListProps> = ({
  tickets,
  onTicketClick,
  activeTab,
  onTabChange,
  language,
}) => {
  const t = translations[language];

  const filteredTickets = tickets.filter((ticket) => {
    return true;
  });

  return (
    <div className="p-4 pb-20">
      <div className="flex mb-6 justify-center">
        <button
          className={`px-16 py-3 rounded-full text-sm font-medium whitespace-nowrap ${
            activeTab === "all"
              ? "bg-pink-400 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
          onClick={() => onTabChange("all")}
        >
          {t.thai}
        </button>
        <button
          className={`px-16 py-3 rounded-full text-sm font-medium whitespace-nowrap ml-2 ${
            activeTab === "free"
              ? "bg-pink-400 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
          onClick={() => onTabChange("free")}
        >
          {t.tourist}
        </button>
      </div>

      <div className="space-y-6">
        {filteredTickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-white rounded-xl overflow-hidden shadow-md"
            onClick={() => onTicketClick(ticket)}
          >
            <div className="relative">
              <img
                src={ticket.image}
                alt={
                  language === "th" ? ticket.templeName : ticket.templeNameEn
                }
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4 bg-[#FF7A05] text-white px-4 py-1 rounded-full">
                {language === "en"
                  ? ticket.id === 1
                    ? "100 Baht"
                    : "200 Baht"
                  : ticket.isFree
                  ? t.free
                  : `${ticket.price} ${t.baht}`}
              </div>
            </div>
            <div className="p-4 bg-pink-300">
              <h3 className="text-lg font-medium">
                {language === "th" ? ticket.templeName : ticket.templeNameEn}
              </h3>
              <p className="text-sm text-white-600 whitespace-pre-wrap">
                {(language === "th" ? ticket.description : ticket.descriptionEn)
                  .split("\n")
                  .map((line, index) => (
                    <span key={index}>
                      {line.trim()}
                      {index <
                        (language === "th"
                          ? ticket.description
                          : ticket.descriptionEn
                        ).split("\n").length -
                          1 && <br />}
                    </span>
                  ))}
              </p>
              <button className="w-full mt-4 bg-white text-[#FF7A05] rounded-full py-2 font-medium">
                {language === "en"
                  ? ticket.id === 1
                    ? "BUY TICKETS"
                    : "BUY TICKETS"
                  : "ซื้อตั๋ว"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Ticket Detail Component
 */
export const TicketDetail: React.FC<TicketDetailProps> = ({
  ticket,
  onSelectAmount,
  onCustomAmount,
  selectedAmount,
  customAmount,
  language,
  onBackClick,
}) => {
  const t = translations[language];

  if (language === "en") {
    const fixedPrice = ticket.id === 1 ? 100 : 200;

    return (
      <div className="min-h-screen bg-white-100 relative">
        <div className="bg-[#FF7A05] rounded-tr-3xl p-4 min-h-screen relative z-20">
          <div className="flex items-center justify-center relative pt-4 pb-6">
            <button onClick={onBackClick} className="absolute left-0">
              <svg
                className="w-6 h-6 text-white"
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
            <h2 className="text-white text-2xl font-semibold">Buy Ticket</h2>
          </div>

          <div className="w-11/12 h-1 bg-white/30 mb-8 mx-auto"></div>

          <div className="pt-4">
            <h2 className="text-white text-2xl font-semibold mb-6">
              {ticket.templeNameEn}
            </h2>

            <div className="bg-orange-300 rounded-3xl p-6 mb-6">
              <div className="text-center">
                <h3 className="text-white text-xl font-semibold mb-4">
                  Admission Fee
                </h3>
                <div className="flex items-center justify-center">
                  <span className="text-white text-6xl font-bold">
                    {fixedPrice}
                  </span>
                  <span className="text-white text-2xl ml-2">THB</span>
                </div>
                <p className="text-white text-sm mt-4">
                  Fixed price for international visitors
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const predefinedAmounts = [
    ticket.isFree ? 0 : (ticket.price as number),
    10,
    20,
    30,
    40,
    50,
  ];

  return (
    <div className="min-h-screen bg-white relative">
      <div
        className="bg-[#FF7A05] rounded-tr-full p-4 min-h-screen relative z-20"
        style={{ borderTopRightRadius: "70px" }} // เพิ่มค่าส่วนตัวเพื่อโค้งมากขึ้น
      >
        {" "}
        <div className="flex items-center justify-center relative pt-4 pb-6">
          <button onClick={onBackClick} className="absolute left-0">
            <svg
              className="w-6 h-6 text-white"
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
          <h2 className="text-white text-2xl font-semibold">ซื้อตั๋ว</h2>
        </div>
        <div className="w-11/12 h-1 bg-white/30 mb-8 mx-auto"></div>
        <div className="pt-4">
          <h2 className="text-white text-2xl font-semibold mb-6">
            {ticket.templeName}
          </h2>
          <p className="text-white mb-2">
            {ticket.isFree ? t.freeOrDonation : `${ticket.price} ${t.baht}`}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {predefinedAmounts.map((amount, index) => (
              <button
                key={index}
                className={`py-3 rounded-full ${
                  selectedAmount === amount
                    ? "bg-white text-[#FF7A05]"
                    : "bg-orange-300 text-white"
                }`}
                onClick={() => onSelectAmount(amount)}
              >
                {amount === 0 ? t.free : `${amount} ${t.baht}`}
              </button>
            ))}
          </div>

          <div className="mb-2">
            <label className="text-white block mb-2">{t.amount}</label>
            <input
              type="text"
              value={customAmount}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                onCustomAmount(parseInt(value) || 0);
              }}
              className="w-full p-3 bg-white rounded-full text-right placeholder-gray-400"
              style={{
                color: "#FF7A05",
                boxShadow: "inset 0 4px 4px rgba(0, 0, 0, 0.2)", // inner shadow
              }}
              placeholder="0.00"
            />
          </div>
          <p className="text-white text-sm mb-4">{t.donationLimit}</p>
        </div>
      </div>
    </div>
  );
};

/**
 * Ticket Confirmation Component
 */
export const TicketConfirmation: React.FC<TicketConfirmationProps> = ({
  ticket,
  amount,
  onConfirm,
  language,
  onBackClick,
}) => {
  const t = translations[language];

  return (
    <div className="min-h-screen bg-white-100 relative">
      <div
        className="bg-[#FF7A05] rounded-tr-3xl min-h-screen relative z-20"
        style={{ borderTopRightRadius: "70px" }}
      >
        <div className="flex items-center justify-center relative pt-4 pb-6 px-4">
          <button onClick={onBackClick} className="absolute left-4">
            <svg
              className="w-6 h-6 text-white"
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
          <h2 className="text-white text-2xl font-semibold">ซื้อตั๋ว</h2>
        </div>

        <div className="w-11/12 h-1 bg-white/30 mb-8 mx-auto"></div>
        <div className="pt-8 p-4">
          <div className="flex flex-col justify-center items-center">
            <div className="bg-pink-200 rounded-3xl p-8 w-full max-w-md mx-auto shadow-lg">
              <div className="text-center mb-8">
                <h2 className="text-[#FF7A05] text-2xl font-bold mb-2">
                  {language === "th" ? "ยืนยันการซื้อตั๋ว" : "Confirm Ticket"}
                </h2>
                <p className="text-[#FF7A05] text-lg">
                  {language === "th" ? "ใน" : "in"}{" "}
                  {language === "th" ? ticket.templeName : ticket.templeNameEn}
                </p>
              </div>

              <div className="text-center mb-8">
                <div className="flex items-center justify-center">
                  <span className="text-[#FF7A05] text-7xl font-bold">
                    {amount}
                  </span>
                  <span className="text-[#FF7A05] text-2xl font-medium ml-2">
                    THB
                  </span>
                </div>
              </div>

              <button
                className="w-full bg-white text-[#FF7A05] py-4 rounded-full font-bold text-lg shadow-md hover:shadow-lg transition-shadow"
                onClick={onConfirm}
              >
                {language === "th" ? "ยืนยัน" : "CONFIRM"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Ticket QR Code Component
 */
export const TicketQRCode: React.FC<TicketQRCodeProps> = ({
  ticket,
  amount,
  onUpload,
  onConfirmPayment,
  language,
  onBackClick,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const t = translations[language];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);

      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);

      onUpload(file);
    }
  };

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
    <div className="min-h-screen bg-white-100 relative">
      <div
        className="bg-[#FF7A05] rounded-tr-3xl min-h-screen relative z-20"
        style={{ borderTopRightRadius: "70px" }}
      >
        <div className="flex items-center justify-center relative pt-4 pb-6 px-4">
          <button onClick={onBackClick} className="absolute left-4">
            <svg
              className="w-6 h-6 text-white"
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
          <h2 className="text-white text-2xl font-semibold">ซื้อตั๋ว</h2>
        </div>

        <div className="w-11/12 h-1 bg-white/30 mb-8 mx-auto"></div>

        <div className="pt-8 p-4 flex flex-col items-center">
          <div className="bg-pink-100 rounded-3xl p-6 w-full max-w-md">
            <h2 className="text-center text-xl font-semibold mb-6 text-[#FF7A05]">
              {t.scanQR}
            </h2>

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
              <p className="text-medium text-[#FF7A05]">{t.bank}</p>
              <p className="text-medium text-[#FF7A05]">{t.accountNumber}</p>
              <p className="text-medium text-[#FF7A05]">
                {t.accountName}{" "}
                {language === "th" ? ticket.templeName : ticket.templeNameEn}
              </p>
            </div>

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
              className="w-full bg-white text-[#FF7A05] py-3 rounded-full font-medium"
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
      </div>
    </div>
  );
};

/**
 * Ticket Success Component
 */
/**
 * Ticket Success Component - Updated with curved background
 */

export const TicketSuccess: React.FC<TicketSuccessProps> = ({
  ticket,
  language,
}) => {
  // กำหนดสีและรูปภาพตามภาษา
  const getBackgroundColor = () => {
    return language === "th" ? "bg-[#FFE999]" : "bg-[#FFDCE6]";
  };

  const getTicketImage = () => {
    return language === "th"
      ? "/images/ticket/AW.png"
      : "/images/ticket/AW2.png";
  };

  return (
    <div className={`min-h-screen ${getBackgroundColor()} relative`}>
      {/* White section covering full width and half height with curved bottom-left */}
      <div
        className="bg-white w-full absolute top-0 left-0 right-0 z-10"
        style={{
          height: "30.5vh",
          borderBottomLeftRadius: "13rem",
        }}
      ></div>

      {/* Ticket content */}
      <div className="relative z-20 pt-16">
        <div className="flex justify-center px-4">
          <div className="w-full max-w-md">
            <img
              src={getTicketImage()}
              alt="Ticket"
              className="w-full max-w-[300px] mx-auto object-contain drop-shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const TicketScreen: React.FC<TicketScreenProps> = ({
  userName,
  initialTab = "all",
  onBackClick,
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [language, setLanguage] = useState<"th" | "en">("th");
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<
    "list" | "detail" | "confirm" | "qrcode" | "success"
  >("list");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const t = translations[language];

  useEffect(() => {
    const mockTickets: Ticket[] = [
      {
        id: 1,
        templeName: "วัดสุทัศน์เทพวราราม",
        templeNameEn: "Wat Suthat Thepwararam",
        price: "free",
        isFree: true,
        image: "/images/ticket/วัดสุทัศน์.jpeg",
        description: "ฟรี หรือ บริจาคตามศรัทธา",
        descriptionEn: "100 Baht",
      },
      {
        id: 2,
        templeName: "พิพิธภัณฑ์ตำหนักสมเด็จพระสังฆราช",
        templeNameEn: "The Patriarch is Palace Museum (Pae), Wat Suthat",
        price: 50,
        isFree: false,
        image: "/images/ticket/พิพิธภัณฑ์ตำหนักสมเด็จพระสังฆราช.jpeg",
        description:
          "ค่าธรรมเนียม : คนไทย 50 บาท/ชาวต่างชาติ 200 บาท \n ยกเว้นค่าเข้าชม : นักเรียน-นักศึกษาปริญญาตรี (แสดงบัตร)/ \n ผู้สูงอายุตั้งแต่ 60 ปีขึ้นไป/พระภิกษุสงฆ์-สามเณร/ผู้พิการ",
        descriptionEn: "200 Baht",
      },
    ];

    setTickets(mockTickets);
    setLoading(false);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "all") {
      setLanguage("th");
    } else if (tab === "free") {
      setLanguage("en");
    }
  };

  const handleBackClick = () => {
    if (step === "list") {
      if (onBackClick) {
        onBackClick();
      } else {
        router.push("/dashboard");
      }
    } else if (step === "detail") {
      setStep("list");
    } else if (step === "confirm") {
      setStep("detail");
    } else if (step === "qrcode") {
      setStep("confirm");
    } else if (step === "success") {
      setStep("list");
    }
  };

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);

    if (language === "en") {
      const foreignerPrice = ticket.id === 1 ? 100 : 200;
      setSelectedAmount(foreignerPrice);
      setCustomAmount(foreignerPrice.toString());
    } else {
      setSelectedAmount(ticket.isFree ? 0 : (ticket.price as number));
      setCustomAmount(
        ticket.isFree ? "0" : (ticket.price as number).toString()
      );
    }

    setStep("detail");
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
    setStep("confirm");
  };

  const handleProceedToPayment = () => {
    setStep("qrcode");
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    if (selectedTicket) {
      const updatedTicket: Ticket = {
        ...selectedTicket,
        qrCodeUrl: `/api/qrcode/${selectedTicket.id}`,
        barcode: `9 789870 ${Math.floor(Math.random() * 1000000)}`,
      };
      setSelectedTicket(updatedTicket);
    }
  };

  const handleConfirmPayment = () => {
    setStep("success");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF7A05] mx-auto"></div>
          <p className="mt-4 text-[#FF7A05]">{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <TicketHeader
        onBackClick={handleBackClick}
        title={step === "success" ? t.yourTicket : t.buyTicket}
        userName={user?.fullName || "Guest"}
        language={language}
        avatar={user?.avatar || "/images/profile/travel/Profile.jpeg"}
        step={step}
      />

      {step === "list" && (
        <TicketList
          tickets={tickets}
          onTicketClick={handleTicketClick}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          language={language}
        />
      )}

      {step === "detail" && selectedTicket && (
        <>
          <TicketDetail
            ticket={selectedTicket}
            onSelectAmount={handleSelectAmount}
            onCustomAmount={handleCustomAmount}
            selectedAmount={selectedAmount}
            customAmount={customAmount}
            language={language}
            onBackClick={handleBackClick}
          />

          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white z-30">
            <button
              className="w-full bg-pink-400 text-white py-3 rounded-full font-medium"
              onClick={handleConfirm}
            >
              {language === "th" ? "ซื้อตั๋ว" : "Buy Ticket"}
            </button>
          </div>
        </>
      )}

      {step === "confirm" && selectedTicket && (
        <TicketConfirmation
          ticket={selectedTicket}
          amount={selectedAmount}
          onConfirm={handleProceedToPayment}
          language={language}
          onBackClick={handleBackClick}
        />
      )}

      {step === "qrcode" && selectedTicket && (
        <TicketQRCode
          ticket={selectedTicket}
          amount={selectedAmount}
          onUpload={handleFileUpload}
          onConfirmPayment={handleConfirmPayment}
          language={language}
          onBackClick={handleBackClick}
        />
      )}

      {step === "success" && selectedTicket && (
        <TicketSuccess ticket={selectedTicket} language={language} />
      )}

      {step === "list" && <BottomNavigation activePage="profile" />}
    </div>
  );
};
