import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useAuth } from "@/contexts/AuthContext";
import BottomNavigation from "@/components/BottomNavigation";
import HeaderProfile from "@/components/header-profile/header-profile";
import Link from "next/link";

// Types
interface BuddhaStatue {
  id: number;
  name: string;
  templeId: number;
  templeName: string;
  image: string;
  benefits: string[];
  description?: string;
  popular: boolean;
}

interface Temple {
  id: number;
  name: string;
  image: string;
  address?: string;
  description?: string;
}

// Buddha Statues Page (shows all Buddha statues in a temple)
export default function TempleBuddhaStatues() {
  const router = useRouter();
  const { templeId } = router.query;
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("ทั้งหมด");
  const [temple, setTemple] = useState<Temple | null>(null);
  const [buddhaStatues, setBuddhaStatues] = useState<BuddhaStatue[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs = ["ทั้งหมด", "ที่นิยม"];

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Fetch temple and Buddha statues data
  useEffect(() => {
    const fetchData = async () => {
      if (!templeId || !isAuthenticated) return;

      try {
        // In a real app, these would be actual API calls
        // const templeResponse = await axios.get(`/api/temples/${templeId}`);
        // const statuesResponse = await axios.get(`/api/temples/${templeId}/buddha-statues`);

        // Simulated data
        // Set temple data
        setTemple({
          id: Number(templeId),
          name: "วัดสุทัศน์เทพวราราม",
          image: "/images/home/วัดสุทัศน์.jpg",
          address: "แขวงวัดราชบพิธ เขตพระนคร กรุงเทพมหานคร",
          description:
            "วัดสุทัศน์เทพวรารามเป็นพระอารามหลวงชั้นเอก ชนิดราชวรมหาวิหาร",
        });

        // Set Buddha statues data
        setBuddhaStatues([
          {
            id: 1,
            name: "พระศรีศากยมุนี",
            templeId: Number(templeId),
            templeName: "วัดสุทัศน์เทพวราราม",
            image: "/images/temple-list/พระศรีศากยมุนี.jpeg",
            benefits: ["ภาพรวมทั่วไป"],
            description: "พระพุทธรูปประธานในพระอุโบสถ",
            popular: true,
          },
          {
            id: 2,
            name: "พระสุนทรี วาณี",
            templeId: Number(templeId),
            templeName: "วัดสุทัศน์เทพวราราม",
            image: "/images/temple-list/พระสุนทรีวาณี.jpeg",
            benefits: ["การงานการเรียน"],
            description: "พระพุทธรูปประจำวิหารด้านทิศตะวันออก",
            popular: true,
          },
          {
            id: 3,
            name: "พระพุทธรังสีมุทราภัย",
            templeId: Number(templeId),
            templeName: "วัดสุทัศน์เทพวราราม",
            image: "/images/temple-list/พระพุทธรังสีมุทราภัย.jpeg",
            benefits: ["โชคลาภวาสนา"],
            description: "พระพุทธรูปประจำวิหารด้านทิศใต้",
            popular: false,
          },
          {
            id: 4,
            name: "ต้นพระศรีมหาโพธิ์",
            templeId: Number(templeId),
            templeName: "วัดสุทัศน์เทพวราราม",
            image: "/images/temple-list/ต้นพระศรีมหาโพธิ์.jpeg",
            benefits: ["ภาพรวมทั่วไป"],
            description: "ต้นโพธิ์ศักดิ์สิทธิ์ภายในวัด",
            popular: true,
          },
          {
            id: 5,
            name: "พระพุทธตรีโลกเชษฐ์",
            templeId: Number(templeId),
            templeName: "วัดสุทัศน์เทพวราราม",
            image: "/images/temple-list/พระพุทธตรีโลกเชษฐ์ .jpg",
            benefits: ["โชคลาภวาสนา"],
            description: "พระพุทธรูปปางนาคปรก",
            popular: false,
          },
          {
            id: 6,
            name: "พระกริ่งใหญ่",
            templeId: Number(templeId),
            templeName: "วัดสุทัศน์เทพวราราม",
            image: "/images/temple-list/พระกริ่งใหญ่.jpeg",
            benefits: ["สุขภาพโรคภัย"],
            description: "พระพุทธรูปปางลีลาศิลปะสุโขทัย",
            popular: true,
          },
          {
            id: 7,
            name: "ท้าวเวสสุวรรณ",
            templeId: Number(templeId),
            templeName: "วัดสุทัศน์เทพวราราม",
            image: "/images/temple-list/ท้าวเวสุวรรณ.jpg",
            benefits: ["การเงินธุรกิจ"],
            description: "พระพุทธรูปปางลีลาศิลปะสุโขทัย",
            popular: true,
          },
          {
            id: 8,
            name: "พระพุทธเสฏฐมุนี",
            templeId: Number(templeId),
            templeName: "วัดสุทัศน์เทพวราราม",
            image: "/images/temple-list/พระพุทธเสฏฐมุนี.jpeg",
            benefits: ["ความรักคู่ครอง"],
            description: "พระพุทธรูปปางลีลาศิลปะสุโขทัย",
            popular: true,
          },
          {
            id: 9,
            name: "พระรูปสมเด็จพระสังฆราช",
            templeId: Number(templeId),
            templeName: "วัดสุทัศน์เทพวราราม",
            image: "/images/temple-list/พระรูปสมเด็จพระสังฆราช.jpeg",
            benefits: ["การเรียนการงาน"],
            description: "พระพุทธรูปปางลีลาศิลปะสุโขทัย",
            popular: true,
          },
        ]);

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [templeId, isAuthenticated]);

  // Filter Buddha statues based on active tab
  const filteredStatues = buddhaStatues.filter((statue) => {
    if (activeTab === "ทั้งหมด") {
      return true;
    } else if (activeTab === "ที่นิยม") {
      return statue.popular;
    }
    return true;
  });

  const handleBuddhaStatueClick = (statueId: number) => {
    router.push(`/information/${statueId}?type=buddha`);
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
        <title>{temple?.name || "พระพุทธรูป"} - Nummu App</title>
        <meta
          name="description"
          content={`พระพุทธรูปในวัด${temple?.name || ""}`}
        />
      </Head>

      <div className="min-h-screen bg-gray-100 pb-20">
        {/* Header */}
        <div className="bg-orange-500 text-white p-4 rounded-b-3xl">
          <HeaderProfile />
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
            <h2 className="text-3xl text-nowrap font-semibold absolute left-1/2 -translate-x-1/2">
              วัดสุทัศนเทพวราราม
            </h2>
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

          {/* Buddha Statues List */}
          {filteredStatues.length > 0 ? (
            <div className="space-y-6">
              {filteredStatues.map((statue) => (
                <div
                  key={statue.id}
                  className="flex items-center justify-between border-t border-orange-200 pt-4"
                  onClick={() => handleBuddhaStatueClick(statue.id)}
                >
                  {/* รูปภาพ */}
                  <div className="flex items-center">
                    <div className="w-24 h-35 rounded-3xl overflow-hidden">
                      <img
                        src={statue.image}
                        alt={statue.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* ข้อมูล */}
                    <div className="ml-4">
                      <h3 className="text-orange-600 font-bold text-lg">
                        {statue.name}
                      </h3>
                      <p className="text-rose-400 text-sm">
                        {statue.templeName}
                      </p>
                      <p className="text-gray-400 text-sm font-medium mt-11">
                        เพิ่มเติม
                      </p>
                    </div>
                  </div>

                  {/* ป้ายผลบุญ */}
                  <div className="flex flex-col items-end">
                    {statue.benefits.map((benefit, index) => (
                      <span
                        key={index}
                        className="bg-[#FFC800] text-[#FF7A05] font-bold text-md px-2 py-2 w-24 rounded-xl text-center mt-11 cursor-pointer"
                      >
                        {benefit}
                      </span>
                    ))}
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
              <p className="mt-4 text-gray-500">ไม่พบพระพุทธรูปในวัดนี้</p>
            </div>
          )}
        </div>

        <BottomNavigation activePage="profile" />
      </div>
    </>
  );
}
