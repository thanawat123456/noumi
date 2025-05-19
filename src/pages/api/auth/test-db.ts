// src/pages/api/test-db.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbService from '@/lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log('DB Test API called');
    
    // ทดสอบการเชื่อมต่อและสร้างตาราง
    await dbService.init();
    console.log('Database initialized successfully');
    
    // ทดสอบดึงข้อมูลผู้ใช้ (แค่ตรวจสอบว่าทำงานได้)
    const testUser = await dbService.getUserByEmail('test@example.com');
    console.log('Test query result:', testUser ? 'User found' : 'No user found');
    
    return res.status(200).json({ 
      success: true, 
      message: 'Database connection successful',
      hasTestUser: !!testUser
    });
  } catch (error) {
    console.error('Database test error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}