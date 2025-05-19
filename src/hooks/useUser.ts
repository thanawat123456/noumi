// src/hooks/useUser.ts
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfile {
  id: number;
  email: string;
  phone?: string;
  birthDate?: string;
  elementType?: string;
  zodiacSign?: string;
  bloodGroup?: string;
}

export const useUser = () => {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!isAuthenticated || !user) {
        setProfile(null);
        setIsLoading(false);
        return;
      }

      try {
        // โดยปกติคุณอาจจะดึงข้อมูลเพิ่มเติมจาก API หรือฐานข้อมูล
        // แต่ในกรณีนี้เราใช้ข้อมูลจาก auth context โดยตรง
        setProfile({
          id: user.id,
          email: user.email,
          phone: user.phone,
          birthDate: user.birthDate,
          elementType: user.elementType,
          zodiacSign: user.zodiacSign,
          bloodGroup: user.bloodGroup
        });
      } catch (error) {
        console.error('Error loading user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [user, isAuthenticated]);

  return { profile, isLoading };
};