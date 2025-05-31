import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Link from 'next/link';

// Add interface for props
interface HeaderProfileProps {
  onProfileClick?: () => void;
}

export default function HeaderProfile({ onProfileClick }: HeaderProfileProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-[#FF8CB7]">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4 mt-4">
        <div className="flex items-center space-x-3">
          {/* Add onClick handler to the profile image container */}
          <button 
            onClick={onProfileClick}
            className="w-12 h-12 rounded-full overflow-hidden bg-white border-0 p-0 cursor-pointer"
          >
            <img
              src={user?.avatar || "/images/profile/travel/Profile.jpeg"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </button>
          <div>
            <p className="text-white text-sm">สวัสดี,ยินดีต้อนรับ</p>
            <h3 className="text-white text-xl font-medium">
              {user?.fullName || "Praewwy :)"}
            </h3>
          </div>
        </div>
        <div className="flex space-x-3">
          <Link href="/notifications" passHref>
            <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center ml-20">
              <svg
                className="w-6 h-6 text-[#FF7A05]"
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
          </Link>
        </div>
        <div>
          <Link href="/favorites" passHref>
          <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
            <svg
              className="w-6 h-6 text-[#FF7A05]"
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
          </Link>
        </div>
      </div>
    </>
  );
}