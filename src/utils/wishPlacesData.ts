// utils/wishPlacesData.ts
export interface WishPlace {
  id: number;
  name: string;
  image: string;
  temple: string;
  wishType: string;
  category: string;
  isFavorite: boolean;
}

// ข้อมูลสถานที่ขอพรทั้งหมด - ใช้ร่วมกันในทุกหน้า
export const getAllWishPlaces = (): WishPlace[] => {
  return [
    // หมวด ภาพรวมทั่วไป
    {
      id: 1,
      name: 'พระศรีศากยมุนี',
      image: '/images/temple-list/พระศรีศากยมุนี.jpg',
      temple: 'วัดสุทัศน์เทพวราราม',
      wishType: 'ภาพรวม<br />ทั่วไป',
      category: 'overview',
      isFavorite: false
    },
    {
      id: 7,
      name: 'ต้นพระศรีมหาโพธิ์',
      image: '/images/temple-list/ต้นพระศรีมหาโพธิ์.jpeg',
      temple: 'วัดสุทัศน์เทพวราราม',
      wishType: 'ภาพรวม<br />ทั่วไป',
      category: 'overview',
      isFavorite: false
    },
    
    // หมวด การงาน การเรียน
    {
      id: 2,
      name: 'พระสุนทรี วาณี',
      image: '/images/temple-list/พระสุนทรีวาณี.jpeg',
      temple: 'วัดสุทัศน์เทพวราราม',
      wishType: 'การงาน<br />การเรียน',
      category: 'work',
      isFavorite: false
    },
    {
      id: 9,
      name: 'พระพรหม',
      image: '/images/temple-list/พระพรหม.jpg',
      temple: 'วัดสุทัศน์เทพวราราม',
      wishType: 'การงาน<br />การเรียน',
      category: 'work',
      isFavorite: false
    },
    
    // หมวด ความรัก คู่ครอง
    {
      id: 3,
      name: 'พระพุทธตรีโลกเชษฐ์',
      image: '/images/temple-list/พระพุทธตรีโลกเชษฐ์.jpg',
      temple: 'วัดสุทัศน์เทพวราราม',
      wishType: 'ความรัก<br />คู่ครอง',
      category: 'love',
      isFavorite: false
    },
    {
      id: 10,
      name: 'พระแม่กวนอิม',
      image: '/images/temple-list/พระแม่กวนอิม.jpg',
      temple: 'วัดสุทัศน์เทพวราราม',
      wishType: 'ความรัก<br />คู่ครอง',
      category: 'love',
      isFavorite: false
    },
    
    // หมวด การเงิน ธุรกิจ
    {
      id: 4,
      name: 'ท้าวเวสสุวรรณ',
      image: '/images/temple-list/ท้าวเวสุวรรณ.jpg',
      temple: 'วัดสุทัศน์เทพวราราม',
      wishType: 'การเงิน<br />ธุรกิจ',
      category: 'finance',
      isFavorite: false
    },
    {
      id: 11,
      name: 'พระพิฆเนศ',
      image: '/images/temple-list/พระพิฆเนศ.jpg',
      temple: 'วัดสุทัศน์เทพวราราม',
      wishType: 'การเงิน<br />ธุรกิจ',
      category: 'finance',
      isFavorite: false
    },
    
    // หมวด โชคลาภ วาสนา
    {
      id: 5,
      name: 'พระรูปสมเด็จพระสังฆราช',
      image: '/images/temple-list/พระรูปสมเด็จพระสังฆราช.jpeg',
      temple: 'วัดสุทัศน์เทพวราราม',
      wishType: 'โชคลาภ<br />วาสนา',
      category: 'fortune',
      isFavorite: false
    },
    {
      id: 8,
      name: 'พระกริ่งใหญ่',
      image: '/images/temple-list/พระกริ่งใหญ่.jpeg',
      temple: 'วัดสุทัศน์เทพวราราม',
      wishType: 'โชคลาภ<br />วาสนา',
      category: 'fortune',
      isFavorite: false
    },
    
    // หมวด สุขภาพ โรคภัย
    {
      id: 6,
      name: 'พระพุทธเสฏฐมุนี',
      image: '/images/temple-list/พระพุทธเสฏฐมุนี.jpeg',
      temple: 'วัดสุทัศน์เทพวราราม',
      wishType: 'สุขภาพ<br />โรคภัย',
      category: 'health',
      isFavorite: false
    },
    {
      id: 12,
      name: 'พระพุทธชินราช',
      image: '/images/temple-list/พระพุทธชินราช.jpg',
      temple: 'วัดสุทัศน์เทพวราราม',
      wishType: 'สุขภาพ<br />โรคภัย',
      category: 'health',
      isFavorite: false
    }
  ];
};

// Helper function สำหรับหาข้อมูลสถานที่จาก ID
export const getWishPlaceById = (id: number): WishPlace | undefined => {
  return getAllWishPlaces().find(place => place.id === id);
};

// Helper function สำหรับกรองตามหมวดหมู่
export const getWishPlacesByCategory = (category: string): WishPlace[] => {
  if (category === 'all') {
    return getAllWishPlaces();
  }
  return getAllWishPlaces().filter(place => place.category === category);
};