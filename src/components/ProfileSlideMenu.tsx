import React, { useState, useEffect } from 'react';
import { X, User, Heart, Bell, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';

interface ProfileSlideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileSlideMenu: React.FC<ProfileSlideMenuProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300); // Match transition duration
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleClose();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    { icon: User, label: 'ตัวฉัน', path: '/profile' },
    { icon: Heart, label: 'สถานที่โปรด', path: '/favorites' },
    { icon: Bell, label: 'การแจ้งเตือน', path: '/notifications' },
    { icon: Settings, label: 'การตั้งค่า', path: '/settings' },
  ];

  if (!isOpen && !isAnimating) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isAnimating ? 'bg-opacity-50' : 'bg-opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* Slide Menu */}
      <div 
        className={`fixed top-0 left-0 h-full w-80 bg-[#FF7A05] z-50 transition-transform duration-300 transform ${
          isAnimating ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full transition-colors z-10"
        >
          <X size={24} />
        </button>

        {/* Profile Header */}
        <div className="pt-16 px-6 pb-8">
          <div className="flex items-center space-x-4">
            <img
              src={user?.avatar || "/images/default-avatar.png"}
              alt="Profile"
              className="w-20 h-20 rounded-full border-4 border-white object-cover"
            />
            <div>
              <h3 className="text-white text-xl font-semibold">
                {user?.fullName || 'ผู้ใช้งาน'}
              </h3>
              <p className="text-white/80 text-sm">
                {user?.email || 'ไม่มีอีเมล'}
              </p>
            </div>
          </div>
        </div>

        {/* White Background Section */}
        <div className="bg-white h-full rounded-tr-[40px] px-6 pt-8">
          {/* Menu Items */}
          <nav>
            <ul className="space-y-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={index}>
                    <a
                      href={item.path}
                      className="flex items-center space-x-4 p-3 hover:bg-orange-50 rounded-lg transition-colors group"
                    >
                      <Icon className="text-[#FF7A05] group-hover:scale-110 transition-transform" size={24} />
                      <span className="text-[#FF7A05] font-medium text-lg">{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Divider */}
          <div className="my-8 h-0.5 bg-[#FF7A05]/20 mx-3"></div>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="w-full bg-white border-2 border-[#FF7A05] rounded-full p-4 flex items-center justify-center space-x-3 hover:bg-orange-50 transition-colors group"
          >
            <LogOut className="text-[#FF7A05] group-hover:scale-110 transition-transform" size={24} />
            <span className="text-[#FF7A05] font-medium text-lg">ออกจากระบบ</span>
          </button>
        </div>
      </div>
    </>
  );
};


export default ProfileSlideMenu;