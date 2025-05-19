import type { NextApiRequest, NextApiResponse } from 'next';
import dbService from '@/lib/db';
import { serialize } from 'cookie';

type SetPasswordResponse = {
  success: boolean;
  user?: any;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SetPasswordResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { userData, password } = req.body;

    if (!userData || !password) {
      return res.status(400).json({ success: false, error: 'User data and password are required' });
    }

    // ตรวจสอบว่ามีอีเมลซ้ำหรือไม่
    const existingUser = await dbService.getUserByEmail(userData.email);
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Email already in use' });
    }

    // เตรียมข้อมูลผู้ใช้สำหรับบันทึกลงฐานข้อมูล
    const newUser = {
      email: userData.email,
      password: password,
      phone: userData.phone,
      full_name: userData.fullName,
      birth_date: userData.birthDate,
      day_of_birth: userData.dayOfBirth,
      element_type: userData.elementType,
      zodiac_sign: userData.zodiacSign,
      blood_group: userData.bloodGroup,
      avatar: userData.avatar,
      created_at: new Date().toISOString()
    };

    // บันทึกผู้ใช้ใหม่ลงฐานข้อมูล
    const userId = await dbService.addUser(newUser);
    const createdUser = await dbService.getUserById(userId);

    if (!createdUser) {
      return res.status(500).json({ success: false, error: 'Failed to create user' });
    }

    // สร้าง user object ที่จะส่งกลับไปให้ client
    const userResponse = {
      id: createdUser.id,
      email: createdUser.email,
      phone: createdUser.phone,
      birthDate: createdUser.birth_date,
      elementType: createdUser.element_type,
      zodiacSign: createdUser.zodiac_sign,
      bloodGroup: createdUser.blood_group,
      fullName: createdUser.full_name,
      dayOfBirth: createdUser.day_of_birth,
      avatar: createdUser.avatar
    };

    // ตั้งค่า session cookie
    const sessionToken = `user-${createdUser.id}-${Date.now()}`;
    const cookie = serialize('session-token', sessionToken, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });

    res.setHeader('Set-Cookie', cookie);
    return res.status(200).json({ success: true, user: userResponse });
  } catch (error: any) {
    console.error('Set password error:', error);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
}