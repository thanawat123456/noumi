// pages/api/admin/users.ts - Fixed for PostgreSQL
import { NextApiRequest, NextApiResponse } from 'next';
import dbService from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Get user email from header (optional for testing)
    const userEmail = req.headers['user-email'] as string;
    console.log('🔐 Accessing admin API with email:', userEmail);

    // ตรวจสอบสิทธิ์ admin (เพิ่มเติม)
    if (userEmail && !userEmail.includes('admin') && userEmail !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Access denied. Admin rights required.' 
      });
    }

    // Initialize database
    await dbService.init();
    
    // *** การใช้ runQuery กับ PostgreSQL ไม่ต้องแก้อะไร เพราะไม่มี parameters ***
    // Get all users with all fields including last_login
    const users = await dbService.runQuery(`
      SELECT 
        id,
        email,
        phone,
        full_name,
        birth_date,
        day_of_birth,
        element_type,
        zodiac_sign,
        blood_group,
        avatar,
        created_at,
        last_login,
        login_count
      FROM users 
      ORDER BY created_at DESC
    `);
    
    // ดึงสถิติการเข้าชม
    const visitStats = await dbService.getVisitStats();

    console.log(`✅ Retrieved ${users?.length || 0} users for admin dashboard`);

    return res.status(200).json({
      success: true,
      users: users || [],
      stats: visitStats,
      currentUser: userEmail,
      count: users?.length || 0
    });

  } catch (error: any) {
    console.error('❌ Admin API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}