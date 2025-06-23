// pages/api/admin/database-status.ts
// API สำหรับตรวจสอบสถานะ database

import type { NextApiRequest, NextApiResponse } from 'next';
import dbService from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // ตรวจสอบสิทธิ์ admin (ถ้าต้องการ)
    const userEmail = req.headers['user-email'] as string;
    if (!userEmail?.includes('admin')) {
      return res.status(403).json({ 
        success: false, 
        error: 'Access denied. Admin rights required.' 
      });
    }

    console.log('🔍 Checking database status...');

    // ดึงข้อมูลสถานะ database
    const dbInfo = await dbService.getDatabaseInfo();
    
    // ดึงข้อมูลสถิติการเข้าชม
    const visitStats = await dbService.getVisitStats();
    
    // ดึงข้อมูล users ล่าสุด
    const recentUsers = await dbService.runQuery(`
      SELECT id, email, full_name, last_login, login_count, created_at
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    const status = {
      database: dbInfo,
      visitStats,
      recentUsers: recentUsers || [],
      serverTime: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown'
    };

    console.log('✅ Database status retrieved successfully');

    return res.status(200).json({
      success: true,
      status
    });

  } catch (error) {
    console.error('❌ Error checking database status:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to check database status',
    });
  }
}