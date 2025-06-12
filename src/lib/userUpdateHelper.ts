// /lib/userUpdateHelper.ts
import dbService from '@/lib/db';

interface UserUpdateData {
  email?: string;
  phone?: string;
  birthDate?: string;
  elementType?: string;
  zodiacSign?: string;
  bloodGroup?: string;
  fullName?: string;
  dayOfBirth?: string;
  avatar?: string | null;
}

/**
 * Helper function เพื่ออัปเดตข้อมูลผู้ใช้ในฐานข้อมูล
 * แปลง object เป็น arrays ที่ต้องการสำหรับ dbService.updateUser
 */
export const updateUserData = async (userId: number, updates: UserUpdateData): Promise<void> => {
  const updateFields: string[] = [];
  const updateValues: any[] = [];

  // แปลง object เป็น arrays สำหรับ SQL UPDATE
  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      // แปลง camelCase เป็น snake_case สำหรับฐานข้อมูล
      const dbFieldName = camelToSnake(key);
      updateFields.push(dbFieldName);
      updateValues.push(value);
    }
  });

  // เรียกฟังก์ชัน updateUser ด้วย parameters ที่ถูกต้อง
  if (updateFields.length > 0) {
    await dbService.updateUser(userId, updateFields, updateValues);
  }
};

/**
 * แปลง camelCase เป็น snake_case
 */
const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

/**
 * ดึงข้อมูลผู้ใช้จากฐานข้อมูลและแปลงเป็น User interface
 */
export const getUserFromDatabase = async (userId: number): Promise<any> => {
  const dbUser = await dbService.getUserById(userId);
  
  if (!dbUser) {
    throw new Error('User not found');
  }

  // แปลง database fields เป็น camelCase สำหรับ frontend
  return {
    id: dbUser.id,
    email: dbUser.email,
    phone: dbUser.phone,
    birthDate: dbUser.birth_date,
    elementType: dbUser.element_type,
    zodiacSign: dbUser.zodiac_sign,
    bloodGroup: dbUser.blood_group,
    fullName: dbUser.full_name,
    dayOfBirth: dbUser.day_of_birth,
    avatar: dbUser.avatar,
  };
};

