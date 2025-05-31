import { useState, useEffect, useCallback } from 'react';

// Types
interface CeremonyActivity {
  id: number;
  name: string;
  image: string;
  description: string;
  type: "ceremony" | "activity";
  isFavorite: boolean;
}

interface UseFavoritesActivityReturn {
  favorites: number[];
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  updateItemsFavorites: (items: CeremonyActivity[]) => CeremonyActivity[];
  getFavoritesCount: () => number;
  clearAllFavorites: () => void;
  isLoaded: boolean; // เพิ่ม flag เพื่อบอกว่าข้อมูลโหลดเสร็จแล้ว
}

const STORAGE_KEY = 'nummu_favorites_activity';

/**
 * Custom hook สำหรับจัดการ favorites ของกิจกรรมและพิธีกรรม
 * จะเก็บข้อมูลใน localStorage เพื่อให้คงอยู่แม้รีเฟรชหน้าจอ
 */
export const useFavoritesActivity = (): UseFavoritesActivityReturn => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // โหลดข้อมูล favorites จาก localStorage เมื่อเริ่มต้น
  useEffect(() => {
    // รอให้ component mount เสร็จก่อน
    const loadFavorites = () => {
      try {
        if (typeof window !== 'undefined') {
          const savedFavorites = localStorage.getItem(STORAGE_KEY);
          if (savedFavorites) {
            const parsedFavorites = JSON.parse(savedFavorites);
            if (Array.isArray(parsedFavorites)) {
              setFavorites(parsedFavorites);
            }
          }
        }
      } catch (error) {
        console.error('Error loading favorites from localStorage:', error);
        // หากเกิดข้อผิดพลาด ให้ล้างข้อมูลที่เสียหาย
        if (typeof window !== 'undefined') {
          localStorage.removeItem(STORAGE_KEY);
        }
      } finally {
        setIsLoaded(true);
      }
    };

    // ใช้ setTimeout เพื่อให้แน่ใจว่า component mount เสร็จแล้ว
    const timer = setTimeout(loadFavorites, 0);
    return () => clearTimeout(timer);
  }, []);

  // บันทึกข้อมูลลง localStorage เมื่อ favorites เปลี่ยนแปลง
  useEffect(() => {
    if (!isLoaded) return; // ไม่บันทึกถ้ายังโหลดไม่เสร็จ

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  }, [favorites, isLoaded]);

  // ฟังก์ชันสำหรับเปิด/ปิด favorite
  const toggleFavorite = useCallback((id: number) => {
    setFavorites(prev => {
      const isFavorited = prev.includes(id);
      if (isFavorited) {
        // ลบออกจาก favorites
        return prev.filter(favoriteId => favoriteId !== id);
      } else {
        // เพิ่มเข้า favorites
        return [...prev, id];
      }
    });
  }, []);

  // ฟังก์ชันตรวจสอบว่าไอเท็มใดเป็น favorite หรือไม่
  const isFavorite = useCallback((id: number): boolean => {
    return favorites.includes(id);
  }, [favorites]);

  // ฟังก์ชันอัปเดตสถานะ favorite ของรายการไอเท็ม
  const updateItemsFavorites = useCallback((items: CeremonyActivity[]): CeremonyActivity[] => {
    return items.map(item => ({
      ...item,
      isFavorite: favorites.includes(item.id)
    }));
  }, [favorites]);

  // ฟังก์ชันนับจำนวน favorites
  const getFavoritesCount = useCallback((): number => {
    return favorites.length;
  }, [favorites]);

  // ฟังก์ชันล้าง favorites ทั้งหมด
  const clearAllFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    updateItemsFavorites,
    getFavoritesCount,
    clearAllFavorites,
    isLoaded
  };
};