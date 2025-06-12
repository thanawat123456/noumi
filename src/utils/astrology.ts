// utils/astrology.ts
export interface AstrologyData {
  zodiacSign: string;
  elementType: string;
  dayOfBirth: string;
}

// 12 ราศี และช่วงวันที่ (ตาม English name เพื่อ mapping กับข้อมูลเดิม)
const zodiacSigns = [
  { name: 'มกราคม', nameEn: 'Capricorn', start: { month: 12, day: 22 }, end: { month: 1, day: 19 } },
  { name: 'กุมภ์', nameEn: 'Aquarius', start: { month: 1, day: 20 }, end: { month: 2, day: 18 } },
  { name: 'มีน', nameEn: 'Pisces', start: { month: 2, day: 19 }, end: { month: 3, day: 20 } },
  { name: 'เมษ', nameEn: 'Aries', start: { month: 3, day: 21 }, end: { month: 4, day: 19 } },
  { name: 'พฤษภ', nameEn: 'Taurus', start: { month: 4, day: 20 }, end: { month: 5, day: 20 } },
  { name: 'เมิถุน', nameEn: 'Gemini', start: { month: 5, day: 21 }, end: { month: 6, day: 20 } },
  { name: 'กรกฎ', nameEn: 'Cancer', start: { month: 6, day: 21 }, end: { month: 7, day: 22 } },
  { name: 'สิงห์', nameEn: 'Leo', start: { month: 7, day: 23 }, end: { month: 8, day: 22 } },
  { name: 'กันย์', nameEn: 'Virgo', start: { month: 8, day: 23 }, end: { month: 9, day: 22 } },
  { name: 'ตุลย์', nameEn: 'Libra', start: { month: 9, day: 23 }, end: { month: 10, day: 22 } },
  { name: 'พิจิก', nameEn: 'Scorpio', start: { month: 10, day: 23 }, end: { month: 11, day: 21 } },
  { name: 'ธนู', nameEn: 'Sagittarius', start: { month: 11, day: 22 }, end: { month: 12, day: 21 } }
];

// ธาตุตามราศี (ตามข้อมูลจาก zodiacElementsData)
const elementsByZodiac: { [key: string]: string } = {
  'เมษ': 'ไฟ',       // Aries - ธาตุไฟ
  'สิงห์': 'ไฟ',      // Leo - ธาตุไฟ  
  'ธนู': 'ไฟ',        // Sagittarius - ธาตุไฟ
  'พฤษภ': 'ดิน',      // Taurus - ธาตุดิน
  'กันย์': 'ดิน',      // Virgo - ธาตุดิน
  'มกราคม': 'ดิน',    // Capricorn - ธาตุดิน
  'เมิถุน': 'ลม',     // Gemini - ธาตุลม
  'ตุลย์': 'ลม',       // Libra - ธาตุลม
  'กุมภ์': 'ลม',       // Aquarius - ธาตุลม
  'กรกฎ': 'น้ำ',      // Cancer - ธาตุน้ำ
  'พิจิก': 'น้ำ',      // Scorpio - ธาตุน้ำ
  'มีน': 'น้ำ'         // Pisces - ธาตุน้ำ
};

// วันในสัปดาห์ (ภาษาไทย)
const daysOfWeek = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

/**
 * คำนวณราศีจากวันเดือนปีเกิด
 */
export function calculateZodiacSign(birthDate: string): string {
  if (!birthDate) return '';
  
  const date = new Date(birthDate);
  const month = date.getMonth() + 1; // getMonth() returns 0-11
  const day = date.getDate();
  
  for (const zodiac of zodiacSigns) {
    // กรณีราศีข้ามปี (เช่น มกราคม เริ่ม 22 ธ.ค. - 19 ม.ค.)
    if (zodiac.start.month > zodiac.end.month) {
      if ((month === zodiac.start.month && day >= zodiac.start.day) ||
          (month === zodiac.end.month && day <= zodiac.end.day)) {
        return zodiac.name;
      }
    } else {
      // กรณีราศีปกติ
      if ((month === zodiac.start.month && day >= zodiac.start.day) ||
          (month === zodiac.end.month && day <= zodiac.end.day) ||
          (month > zodiac.start.month && month < zodiac.end.month)) {
        return zodiac.name;
      }
    }
  }
  
  return '';
}

/**
 * คำนวณธาตุจากราศี
 */
export function calculateElement(zodiacSign: string): string {
  return elementsByZodiac[zodiacSign] || '';
}

/**
 * คำนวณวันในสัปดาห์จากวันเกิด
 */
export function calculateDayOfWeek(birthDate: string): string {
  if (!birthDate) return '';
  
  const date = new Date(birthDate);
  const dayIndex = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  return daysOfWeek[dayIndex];
}

/**
 * คำนวณข้อมูลโหราศาสตร์ทั้งหมดจากวันเกิด
 */
export function calculateAstrologyData(birthDate: string): AstrologyData {
  const zodiacSign = calculateZodiacSign(birthDate);
  const elementType = calculateElement(zodiacSign);
  const dayOfBirth = calculateDayOfWeek(birthDate);
  
  return {
    zodiacSign,
    elementType,
    dayOfBirth
  };
}

/**
 * รายการราศีทั้งหมด (สำหรับ dropdown)
 */
export function getAllZodiacSigns(): string[] {
  return zodiacSigns.map(z => z.name);
}

/**
 * รายการธาตุทั้งหมด (สำหรับ dropdown)
 */
export function getAllElements(): string[] {
  return ['ไฟ', 'ดิน', 'ลม', 'น้ำ'];
}

/**
 * รายการวันในสัปดาห์ (สำหรับ dropdown)
 */
export function getAllDaysOfWeek(): string[] {
  return daysOfWeek;
}

/**
 * ดึงข้อมูลราศีแบบละเอียด (สำหรับใช้กับข้อมูล zodiacElementsData)
 */
export function getZodiacEnglishName(thaiZodiacName: string): string {
  const zodiac = zodiacSigns.find(z => z.name === thaiZodiacName);
  return zodiac?.nameEn || '';
}

/**
 * แปลงชื่อราศีจากภาษาอังกฤษเป็นไทย
 */
export function getZodiacThaiName(englishZodiacName: string): string {
  const zodiac = zodiacSigns.find(z => z.nameEn === englishZodiacName);
  return zodiac?.name || '';
}