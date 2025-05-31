import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface BottomNavigationProps {
  activePage?: 'home' | 'ar' | 'moofollow' | 'profile';
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activePage }) => {
  const router = useRouter();

  const currentPath = router.pathname;
  const currentPage =
    activePage ||
    (currentPath === '/' ? 'home' :
     currentPath === '/ar' ? 'ar' :
     currentPath === '/moofollow' ? 'moofollow' : 
     currentPath === '/profile' ? 'profile' : 'home');

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10 max-w-[414px] mx-auto">
      <nav className="flex justify-between h-14 px-4">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center p-2 ${
            currentPage === 'home' ? 'text-orange-500' : 'text-gray-400'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={currentPage === 'home' ? 2 : 1.5}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span className="text-sm mt-1">หน้าหลัก</span>
        </Link>

        {/* Worship */}
        <Link
          href="/sacred-places-moo"
          className={`flex flex-col items-center justify-center p-2 ${
            currentPage === 'ar' ? 'text-orange-500' : 'text-gray-400'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={currentPage === 'ar' ? 2 : 1.5}
              d="M4 8h16M12 4v16"
              transform="rotate(45, 12, 12)"
            />
          </svg>
          <span className="text-sm mt-1">มูตามไกด์</span>
        </Link>

        {/* moofollow */}
        <Link
          href="/moofollow"
          className={`flex flex-col items-center justify-center p-2 ${
            currentPage === 'moofollow' ? 'text-orange-500' : 'text-gray-400'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={currentPage === 'moofollow' ? 2 : 1.5}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
          <span className="text-sm mt-1">มูใกล้ฉัน</span>
        </Link>

        {/* Profile */}
        <Link
          href="/dashboard/profile"
          className={`flex flex-col items-center justify-center p-2 ${
            currentPage === 'profile' ? 'text-orange-500' : 'text-gray-400'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={currentPage === 'profile' ? 2 : 1.5}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span className="text-sm mt-1">ตัวฉัน</span>
        </Link>
      </nav>
    </footer>
  );
};

export default BottomNavigation;