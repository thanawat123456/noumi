export interface WishPlace {
  id: number;
  name: string;
  image: string;
  temple: string;
  wishType: string;
  category: string;
  isFavorite: boolean;
}

export interface WishCategory {
  id: string;
  name: string;
  icon: string; 
}

// ข้อมูลหมวดหมู่ 6 หมวด
export const WISH_CATEGORIES: WishCategory[] = [
  {
    id: "overview",
    name: "ภาพรวม\nทั่วไป",
    icon: "overview"
  },
  {
    id: "work",
    name: "การงาน\nการเรียน", 
    icon: "work"
  },
  {
    id: "love",
    name: "ความรัก\nคู่ครอง",
    icon: "love"
  },
  {
    id: "finance",
    name: "การเงิน\nธุรกิจ",
    icon: "finance"
  },
  {
    id: "fortune",
    name: "โชคลาภ\nวาสนา",
    icon: "fortune"
  },
  {
    id: "health",
    name: "สุขภาพ\nโรคภัย",
    icon: "health"
  }
];

export const WISH_PLACES_DATA: WishPlace[] = [
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
    id: 4,
    name: 'ต้นพระศรีมหาโพธิ์',
    image: '/images/temple-list/ต้นพระศรีมหาโพธิ์.jpeg',
    temple: 'วัดสุทัศน์เทพวราราม',
    wishType: 'ภาพรวม<br />ทั่วไป',
    category: 'overview',
    isFavorite: false
  },
  
  {
    id: 2,
    name: 'พระสุนทรี วาณี',
    image: '/images/temple-list/พระสุนทรีวาณี.jpeg',
    temple: 'วัดสุทัศน์เทพวราราม',
    wishType: 'การงาน<br />การเรียน',
    category: 'work',
    isFavorite: false
  },
  // {
  //   id: 9,
  //   name: 'พระพรหม',
  //   image: '/images/temple-list/พระพรหม.jpg',
  //   temple: 'วัดสุทัศน์เทพวราราม',
  //   wishType: 'การงาน<br />การเรียน',
  //   category: 'work',
  //   isFavorite: false
  // },
  
  // หมวด ความรัก คู่ครอง
  {
    id: 5,
    name: 'พระพุทธตรีโลกเชษฐ์',
    image: '/images/temple-list/พระพุทธตรีโลกเชษฐ์.jpg',
    temple: 'วัดสุทัศน์เทพวราราม',
    wishType: 'โชคลาภ<br />วาสนา',
    category: 'fortune',
    isFavorite: false
  },
  {
    id: 3,
    name: 'พระพุทธรังสีมุทราภัย',
    image: '/images/temple-list/พระพุทธรังสีมุทราภัย.jpeg',
    temple: 'วัดสุทัศน์เทพวราราม',
    wishType: 'โชคลาภ<br />วาสนา',
    category: 'fortune',
    isFavorite: false
  },
  
  // หมวด การเงิน ธุรกิจ
  {
    id: 7,
    name: 'ท้าวเวสสุวรรณ',
    image: '/images/temple-list/ท้าวเวสุวรรณ.jpg',
    temple: 'วัดสุทัศน์เทพวราราม',
    wishType: 'การเงิน<br />ธุรกิจ',
    category: 'finance',
    isFavorite: false
  },
  // {
  //   id: 11,
  //   name: 'เจ้าแม่กวนอิม',
  //   image: '/images/temple-list/เจ้าแม่กวนอิม.jpg',
  //   temple: 'วัดสุทัศน์เทพวราราม',
  //   wishType: 'การเงิน<br />ธุรกิจ',
  //   category: 'finance',
  //   isFavorite: false
  // },
  
  // หมวด โชคลาภ วาสนา
  {
    id: 9,
    name: 'พระรูปสมเด็จพระสังฆราช',
    image: '/images/temple-list/พระรูปสมเด็จพระสังฆราช.jpeg',
    temple: 'วัดสุทัศน์เทพวราราม',
     wishType: 'การงาน<br />การเรียน',
    category: 'work',
    isFavorite: false
  },
  {
    id: 6,
    name: 'พระกริ่งใหญ่',
    image: '/images/temple-list/พระกริ่งใหญ่.jpeg',
    temple: 'วัดสุทัศน์เทพวราราม',
    wishType: 'สุขภาพ<br />โรคภัย',
    category: 'health',
    isFavorite: false
  },
  
  // หมวด สุขภาพ โรคภัย
  {
    id: 8,
    name: 'พระพุทธเสฏฐมุนี',
    image: '/images/temple-list/พระพุทธเสฏฐมุนี.jpeg',
    temple: 'วัดสุทัศน์เทพวราราม',
    wishType: 'ความรัก<br />คู่ครอง',
    category: 'love',
    isFavorite: false
  },
  // {
  //   id: 12,
  //   name: 'พระพุทธชินราช',
  //   image: '/images/temple-list/พระพุทธชินราช.jpg',
  //   temple: 'วัดสุทัศน์เทพวราราม',
  //   wishType: 'สุขภาพ<br />โรคภัย',
  //   category: 'health',
  //   isFavorite: false
  // }
];

// ฟังก์ชันช่วยสำหรับกรองข้อมูลตามหมวดหมู่
export const getPlacesByCategory = (category: string): WishPlace[] => {
  if (category === 'all') {
    return WISH_PLACES_DATA;
  }
  return WISH_PLACES_DATA.filter(place => place.category === category);
};

// ฟังก์ชันค้นหาสถานที่
export const searchPlaces = (query: string, category: string = 'all'): WishPlace[] => {
  const places = getPlacesByCategory(category);
  if (!query.trim()) {
    return places;
  }
  
  return places.filter(place => 
    place.name.toLowerCase().includes(query.toLowerCase()) ||
    place.temple.toLowerCase().includes(query.toLowerCase())
  );
};