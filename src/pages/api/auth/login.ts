import type { NextApiRequest, NextApiResponse } from 'next';
import dbService from '@/lib/db';
import { serialize } from 'cookie';

type LoginResponse = {
  success: boolean;
  user?: any;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const user = await dbService.getUserByEmailAndPassword(email, password);

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    // สร้าง user object ที่จะส่งกลับไปให้ client
    const userData = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      birthDate: user.birth_date,
      elementType: user.element_type,
      zodiacSign: user.zodiac_sign,
      bloodGroup: user.blood_group,
      fullName: user.full_name,
      dayOfBirth: user.day_of_birth,
      avatar: user.avatar
    };

    // ตั้งค่า session cookie
    const sessionToken = `user-${user.id}-${Date.now()}`;
    const cookie = serialize('session-token', sessionToken, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });

    res.setHeader('Set-Cookie', cookie);
    return res.status(200).json({ success: true, user: userData });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
}