import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import BottomNavigation from "@/components/BottomNavigation";
import HeaderProfile from "@/components/header-profile/header-profile";
import ProfileSlideMenu from '@/components/ProfileSlideMenu';

// Types
interface Temple {
  id: number;
  name: string;
  image: string;
  address?: string;
  description?: string;
  highlighted: boolean;
  type: number;
}

// interface BuddhaStatue {
//   id: number;
//   name: string;
//   templeId: number;
//   templeName: string;
//   image: string;
//   benefits: string[];
//   description?: string;
//   popular: boolean;
// }

// Sacred Places Page (shows all temples)
export default function SacredPlaces() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("ทั้งหมด");
  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const tabs = ["ทั้งหมด", "นิยม", "ใหม่"];

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Fetch temples data
  useEffect(() => {
    const fetchTemples = async () => {
      try {
        // In a real app, replace with actual API call
        // const response = await axios.get('/api/temples');
        // setTemples(response.data);

        // Simulated data
        setTemples([
          {
            id: 1,
            name: "วัดสุทัศน์เทพวราราม",
            image: "/images/sacred-place/วัดสุทัศน์.jpg",
            address: "แขวงวัดราชบพิธ เขตพระนคร กรุงเทพมหานคร",
            description:
              "วัดสุทัศน์เทพวรารามเป็นพระอารามหลวงชั้นเอก ชนิดราชวรมหาวิหาร เป็นวัดที่พระบาทสมเด็จพระพุทธยอดฟ้าจุฬาโลกมหาราช รัชกาลที่ 1 โปรดให้สร้างขึ้น",
            highlighted: true,
            type: 1,
          },
          {
            id: 2,
            name: "ศาลเจ้าพ่อเสือ",
            image: "/images/sacred-place/ศาลเจ้าพ่อเสือ.jpg",
            address: "ถนนสาทรใต้ แขวงยานนาวา เขตสาทร กรุงเทพมหานคร",
            description:
              "ศาลเจ้าโบราณที่มีความสำคัญและเก่าแก่ของชุมชนจีนในย่านเจริญกรุง",
            highlighted: false,
            type: 1,
          },
          {
            id: 3,
            name: "วัดเทพมณเฑียร ",
            image: "/images/sacred-place/วัดเทพมณเฑียร.jpg",
            address:
              "ถนนหน้าพระลาน แขวงพระบรมมหาราชวัง เขตพระนคร กรุงเทพมหานคร",
            description:
              'วัดพระศรีรัตนศาสดาราม หรือที่เรียกกันทั่วไปว่า "วัดพระแก้ว" เป็นวัดที่มีความสำคัญมากที่สุดแห่งหนึ่งในประเทศไทย',
            highlighted: false,
            type: 2,
          },
          {
            id: 4,
            name: "เทวสถานสำหรับพระนคร",
            image: "/images/sacred-place/เทวสถานพระนคร.jpeg",
            address: "ถนนราชดำเนินนอก เขตป้อมปราบศัตรูพ่าย กรุงเทพมหานคร",
            description: "สถานที่สำหรับเข้าปฏิบัติธรรมและสวดมนตร์",
            highlighted: false,
            type: 0,
          },
        ]);

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch temples:", error);
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchTemples();
    }
  }, [isAuthenticated]);

  // Filter temples based on search query and active tab
  const filteredTemples = temples.filter((temple) => {
    const matchesSearch = temple.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    if (activeTab === "ทั้งหมด") {
      return matchesSearch;
    } else if (activeTab === "นิยม") {
      // This would normally use a popularity metric from your API
      return matchesSearch && temple.type == 1;
    } else if (activeTab === "ใหม่") {
      // This would normally use a creation date from your API
       return matchesSearch && temple.type == 2;
    }

    return matchesSearch;
  });

  const handleTempleClick = (templeId: number) => {
    if (templeId === 1) {
      router.push(`/sacred-places/${templeId}`);
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
        <title>สถานที่ศักดิ์สิทธิ์ - Nummu App</title>
        <meta
          name="description"
          content="ค้นหาสถานที่ศักดิ์สิทธิ์ทั่วประเทศไทย"
        />
      </Head>

      <div className="min-h-screen bg-gray-100 pb-20">
        {/* Header */}
        <div className="bg-orange-500 text-white p-4 rounded-b-3xl">
           <HeaderProfile onProfileClick={() => setIsMenuOpen(true)} />
          <div className="flex items-center justify-between mb-4 relative pt-8 pb-4">
            <div className="flex items-center space-x-3">
              <Link href="/dashboard" className="mr-2">
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
              </Link>
            </div>
            <h2 className="text-3xl font-semibold absolute left-1/2 -translate-x-1/2">
              สถานที่
            </h2>
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="ค้นหาชื่อวัด..."
              className="w-full bg-white rounded-full px-10 py-2 text-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 py-6">
          {/* Tabs */}
          <div className="flex justify-center space-x-3 mb-6 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <div key={tab} className="relative">
                <button
                  onClick={() => setActiveTab(tab)}
                  className={`w-24 text-center px-6 py-2 rounded-full text-sm font-medium transition duration-300
    ${
      activeTab === tab
        ? "bg-[#FF8CB7] text-white font-bold"
        : "bg-[#FFDCE6] text-[#FF8CB7] mb-1.5"
    }`}
                  style={
                    activeTab === tab
                      ? { boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.4)" }
                      : undefined
                  }
                >
                  {tab}
                </button>

                {/* gradient underline สำหรับ active tab */}
                {activeTab === tab && (
                  <div
                    className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 w-4/5 h-1 rounded-full bg-[#FF8CB7]"
                    style={{ boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.2)" }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Temple List */}
          {filteredTemples.length > 0 ? (
            <div className="space-y-4">
              {filteredTemples.map((temple) => (
                <div
                  key={temple.id}
                  className={`rounded-3xl overflow-hidden cursor-pointer shadow-md transition transform hover:scale-105`}
                  onClick={() => handleTempleClick(temple.id)}
                >
                  <div className="flex h-28">
                    {/* Text Section */}
                    <div
                      className={`flex-1 px-4 py-2 flex flex-col justify-center items-center ${
                        temple.highlighted ? "bg-yellow-400" : "bg-[#5E5E5F]"
                      }`}
                    >
                      <h3
                        className={`font-semibold text-lg text-center ${
                          temple.highlighted
                            ? "text-orange-600"
                            : "text-[#919191]"
                        }`}
                      >
                        {temple.name}
                      </h3>
                    </div>

                    {/* Image Section */}
                    <div className="w-1/2 relative">
                      <img
                        src={temple.image}
                        alt={temple.name}
                        className={`w-full h-full object-cover ${
                          !temple.highlighted ? "opacity-40" : ""
                        }`}
                      />
                      <span className="absolute top-2 right-2 text-[#DADADA] text-xs font-semibold px-2 py-1 rounded-full">
                        เพิ่มเติม
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="mt-4 text-gray-500">ไม่พบวัดที่คุณกำลังค้นหา</p>
            </div>
          )}
        </div>

        <BottomNavigation activePage="profile" />
        <ProfileSlideMenu 
          isOpen={isMenuOpen} 
          onClose={() => setIsMenuOpen(false)}
        />
      </div>
    </>
  );
}
