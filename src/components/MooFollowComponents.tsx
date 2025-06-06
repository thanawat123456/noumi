import React, { useState } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/router";
import { useFavorites } from "@/hooks/useFavoritesMoo";
import { useAuth } from "@/contexts/AuthContext";
import BottomNavigation from "@/components/BottomNavigation";
import Link from "next/link";
import ProfileSlideMenu from "@/components/ProfileSlideMenu";

interface MooFollowItem {
  id: number;
  title: string;
  description: string;
  image: string;
}

const MooFollowScreen: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [activeTab, setActiveTab] = useState<"story" | "journey">("story");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Initial data for story items (links to /place/[id])
  const initialStoryItems: MooFollowItem[] = [
    {
      id: 1,
      title: "เปรตวัดสุทัศน์",
      description:
        "ที่มาของเปรตวัดสุทัศน์ แท้จริงมาจากจิตรกรรมฝาผนังวัดสุทัศน์",
      image: "/images/เปรต.png",
    },
    {
      id: 2,
      title: "พระธรรมเทศนา",
      description: "การแสดงพระธรรมเทศนาของพระพุทธเจ้า",
      image: "/images/temple-list/พระศรีศากยมุนี.jpeg",
    },
    {
      id: 3,
      title: "หลวงพ่อกลักฝิ่น",
      description: "ที่มาของหลวงพ่อกลักฝิ่นจากความการเลิกทำความชั่ว",
      image: "/images/temple-list/หลวงพ่อลักฝิ่น.jpg",
    },
    {
      id: 4,
      title: "ต้นพระศรีมหาโพธิ์",
      description: "การเดินทางของต้นโพธิ์ 2 ต้นจากแหล่ง 2 สถานที่ศักดิ์สิทธิ์",
      image: "/images/temple-list/ต้นพระศรีมหาโพธิ์.jpeg",
    },
  ];

  // Initial data for journey items (links to /journey/[id])
  const initialJourneyItems: MooFollowItem[] = [
    {
      id: 5,
      title: "ตายแล้วไปไหน",
      description:
        "เส้นทางที่จะช่วยทำให้คุณเกิดแสงแห่งธรรมจากการเรียนรู้ กฎแห่งกรรม พร้อมช่วยเสริมเส้นบุญ เส้นทานให้คุณได้มากขึ้น",
      image: "/images/ตายแล้วไปไหน.png",
    },
    {
      id: 6,
      title: "เส้นทางแก้กรรม",
      description:
        "เส้นทางที่จะช่วยให้คุณพ้นทุกข์ไม่ว่าจะเกิดจากทางความคิดหรือจิตใจ หากคุณต้องการหนทางแห่งการดับทุกข์ เลือกใช้เส้นทางนี้เลย",
      image: "/images/เส้นทางแก้กรรม.png",
    },
  ];

  const currentItems =
    activeTab === "story" ? initialStoryItems : initialJourneyItems;
  const displayItems = showFavoritesOnly
    ? currentItems.filter((item) => isFavorite(item.id))
    : currentItems;

  const handleItemClick = (id: number) => {
    const path =
      activeTab === "story" ? `/place/${id}` : `/place/journey/${id}`;
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-white pb-8 pt-safe">
        <div className="px-4 pt-6 pb-4">
          <div className="flex items-center mt-8 justify-between">
            <div className="flex items-center space-x-3">
              <button
                className="w-15 h-15 rounded-full overflow-hidden bg-gray-200 border-0 p-0"
                onClick={() => setIsMenuOpen(true)}
              >
                <img
                  src={user?.avatar || "/images/profile/travel/Profile.jpeg"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </button>
              <div>
                <p className="text-orange-400 text-sm">สวัสดี, ยินดีต้อนรับ</p>
                <h3 className="text-orange-400 font-medium">
                  {user?.fullName || user?.email?.split("@")[0] || "ผู้ใช้"} :)
                </h3>
              </div>
            </div>
            <div className="flex space-x-2">
              <Link href="/notifications" passHref>
                <button className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
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
              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  showFavoritesOnly ? "bg-pink-500" : "bg-orange-500"
                }`}
              >
                <Heart className="w-5 h-5 text-white" fill="white" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 mt-7">
          <div className="flex justify-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setActiveTab("story")}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  activeTab === "story"
                    ? "bg-[#FF7A05] text-white font-bold"
                    : "bg-[#FFDCE6] text-[#FF8CB7] mb-1.5"
                }`}
                style={
                  activeTab === "story"
                    ? { boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.4)" }
                    : undefined
                }
              >
                มูตามเรื่องเล่า
              </button>
              {activeTab === "story" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 rounded-full transform translate-y-2"></div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setActiveTab("journey")}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  activeTab === "journey"
                    ? "bg-[#FF7A05] text-white font-bold"
                    : "bg-[#FFDCE6] text-[#FF8CB7] mb-1.5"
                }`}
                style={
                  activeTab === "journey"
                    ? { boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.4)" }
                    : undefined
                }
              >
                มูตามเส้นทาง
              </button>
              {activeTab === "journey" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 rounded-full transform translate-y-2"></div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-orange-500 min-h-screen pb-20 rounded-tl-[50px] mt-4">
        <div
          className={`px-4 pt-8 ${
            activeTab === "story" ? "grid grid-cols-2 gap-4" : "space-y-4"
          }`}
        >
          {displayItems.length > 0 ? (
            displayItems.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-2xl overflow-hidden shadow-sm ${
                  activeTab === "journey" ? "relative" : ""
                }`}
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className={`w-full object-cover cursor-pointer ${
                      activeTab === "story" ? "h-32" : "h-48"
                    }`}
                    onClick={() => handleItemClick(item.id)}
                  />
                  <button
                    onClick={() => toggleFavorite(item.id)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isFavorite(item.id)
                          ? "text-orange-500 fill-orange-500"
                          : "text-orange-500"
                      }`}
                    />
                  </button>
                </div>
                <div
                  className="p-3 cursor-pointer"
                  onClick={() => handleItemClick(item.id)}
                >
                  <h3 className="text-orange-600 font-medium text-center">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-xs text-center mt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center pt-20">
              <Heart className="w-16 h-16 text-white/50 mb-4" />
              <p className="text-white text-center">
                ยังไม่มีรายการโปรด
                <br />
                กดหัวใจที่รายการเพื่อเพิ่มรายการโปรด
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activePage="moofollow" />
      <ProfileSlideMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </div>
  );
};

export default MooFollowScreen;
