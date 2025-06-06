// pages/api/admin/users.ts
import { NextApiRequest, NextApiResponse } from 'next';
import dbService from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Get user email from header (optional for testing)
    const userEmail = req.headers['user-email'] as string;
    console.log('Accessing admin API with email:', userEmail);

    // Initialize database
    await dbService.init();
    
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

    return res.status(200).json({
      success: true,
      users: users || [],
      stats: visitStats,
      currentUser: userEmail
    });

  } catch (error) {
    console.error('Admin API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}