import type { NextApiRequest, NextApiResponse } from 'next';
import dbService from '@/lib/db';

type SignupResponse = {
  success: boolean;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SignupResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const userData = req.body;

    if (!userData.email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    // ตรวจสอบว่ามีอีเมลซ้ำหรือไม่
    const existingUser = await dbService.getUserByEmail(userData.email);
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Email already in use' });
    }

    // เก็บข้อมูลผู้ใช้ไว้ใน session เพื่อใช้ในขั้นตอนต่อไป
    // ในกรณีนี้เราจะเก็บข้อมูลไว้ใน req.session
    // (คุณอาจต้องใช้ library เช่น next-session หรือ iron-session)
    // แต่เพื่อความง่ายในตัวอย่างนี้ เราจะส่งข้อมูลกลับไปที่ client และให้ client เก็บไว้

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Signup error:', error);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
}