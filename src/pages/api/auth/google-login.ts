// สร้างไฟล์: /pages/api/auth/google-login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { OAuth2Client } from 'google-auth-library';
import dbService from '@/lib/db';
import { serialize } from 'cookie';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

type GoogleLoginResponse = {
  success: boolean;
  user?: any;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GoogleLoginResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ success: false, error: 'Google credential is required' });
    }

    // ตรวจสอบ Google ID token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    
    if (!payload || !payload.email) {
      return res.status(400).json({ success: false, error: 'Invalid Google token' });
    }

    // เริ่มต้น database
    await dbService.init();

    // ตรวจสอบว่ามี user ในระบบหรือยัง
    let dbUser = await dbService.getUserByEmail(payload.email);

    if (!dbUser) {
      // สร้าง user ใหม่ถ้ายังไม่มี
      const newUser = {
        email: payload.email,
        full_name: payload.name || '',
        avatar: payload.picture || null,
        created_at: new Date().toISOString()
      };
      
      const userId = await dbService.addUser(newUser);
      dbUser = await dbService.getUserById(userId);
      
      // ตรวจสอบว่าสร้าง user สำเร็จหรือไม่
      if (!dbUser) {
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to create user account' 
        });
      }
    } else {
      // อัปเดตข้อมูลที่อาจเปลี่ยนแปลงจาก Google (แต่เก็บข้อมูลที่ user แก้ไขเอง)
      const shouldUpdate = {
        needsUpdate: false,
        updates: [] as string[],
        values: [] as any[]
      };

      // อัปเดต avatar เฉพาะถ้าไม่มี หรือ Google มีข้อมูลใหม่
      if (!dbUser.avatar && payload.picture) {
        shouldUpdate.needsUpdate = true;
        shouldUpdate.updates.push('avatar = ?');
        shouldUpdate.values.push(payload.picture);
      }

      // *** ไม่อัปเดต full_name เพราะ user อาจแก้ไขแล้ว ***
      // เก็บข้อมูลที่ user แก้ไขไว้เป็นหลัก

      if (shouldUpdate.needsUpdate) {
        await dbService.updateUser(dbUser.id!, shouldUpdate.updates, shouldUpdate.values);
        const updatedUser = await dbService.getUserById(dbUser.id!);
        
        // ตรวจสอบว่าอัปเดตสำเร็จหรือไม่
        if (updatedUser) {
          dbUser = updatedUser;
        }
      }
    }

    // ตรวจสอบอีกครั้งว่า dbUser ไม่เป็น null
    if (!dbUser || !dbUser.id) {
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to retrieve user data' 
      });
    }

    // บันทึกการ login
    await dbService.recordLogin(
      dbUser.id,
      req.headers['x-forwarded-for'] as string || req.socket.remoteAddress,
      req.headers['user-agent'] as string
    );
    console.log(`Login recorded for user: ${dbUser.email} (Google)`);

    // สร้าง user object ที่จะส่งกลับ (เหมือนกับ login API เดิม)
    const userData = {
      id: dbUser.id,
      email: dbUser.email,
      phone: dbUser.phone,
      birthDate: dbUser.birth_date,
      elementType: dbUser.element_type,
      zodiacSign: dbUser.zodiac_sign,
      bloodGroup: dbUser.blood_group,
      fullName: dbUser.full_name,
      dayOfBirth: dbUser.day_of_birth,
      avatar: dbUser.avatar
    };

    // ตั้งค่า session cookie เหมือนกับ login API เดิม
    const sessionToken = `user-${dbUser.id}-${Date.now()}`;
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
    console.error('Google login error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Google login failed' 
    });
  }
}