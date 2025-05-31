import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useFavoritesActivity } from "@/hooks/useFavoritesActivity";

export default function WhiteHeaderProfile() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { getFavoritesCount, isLoaded } = useFavoritesActivity();

  // ตรวจสอบว่าอยู่ในโหมด favorites หรือไม่
  const isInFavoritesMode = router.asPath.includes('favorites=true');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleFavoritesClick = () => {
    if (isInFavoritesMode) {
      // ถ้าอยู่ในโหมด favorites แล้ว ให้กลับไปดูทั้งหมด
      const currentPath = router.pathname;
      router.push(currentPath);
    } else {
      // ถ้าไม่ได้อยู่ในโหมด favorites ให้ไปยังหน้าเดียวกันในโหมด favorites
      const currentPath = router.pathname;
      
      // ตรวจสอบว่าอยู่หน้าไหน
      if (currentPath === '/ceremonies') {
        router.push("/ceremonies?favorites=true");
      } else {
        // default ไปหน้า activities
        router.push("/activities?favorites=true");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-[#FF7A05]">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4 pt-8 pl-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-white">
            <img
              src={user?.avatar || "/api/placeholder/48/48"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-[#FF7A05] text-sm">สวัสดี,ยินดีต้อนรับ</p>
            <h3 className="text-[#FF7A05] text-xl font-medium">
              {user?.fullName || "Praewwy :)"}
            </h3>
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="w-10 h-10 rounded-full bg-[#FF7A05] flex items-center justify-center ml-25">
            <svg
              className="w-6 h-6 text-white"
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
            {/* <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span> */}
          </button>
        </div>
        <div className="relative">
          <button 
            onClick={handleFavoritesClick}
            className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 transition-colors duration-200 ${
              isInFavoritesMode 
                ? 'bg-pink-500 hover:bg-pink-600' 
                : 'bg-[#FF7A05] hover:bg-orange-600'
            }`}
          >
            <svg
              className="w-6 h-6 text-white"
              fill={isInFavoritesMode ? "currentColor" : "none"}
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
    </>
  );
}