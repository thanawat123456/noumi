// pages/api/admin/login-stats.ts - API สำหรับดึงสถิติการ login
import type { NextApiRequest, NextApiResponse } from 'next';
import dbService from '@/lib/db';

interface LoginStats {
  totalLogins: number;
  todayLogins: number;
  weeklyLogins: number;
  monthlyLogins: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // ตรวจสอบสิทธิ์ admin
    const userEmail = req.headers['user-email'] as string;
    if (!userEmail || (!userEmail.includes('admin') && userEmail !== 'admin')) {
      return res.status(403).json({ 
        success: false, 
        error: 'Access denied. Admin rights required.' 
      });
    }

    await dbService.init();

    // *** ใช้ method ที่มีอยู่แล้วในระบบ ***
    const visitStats = await dbService.getVisitStats();

    // *** ดึงข้อมูลเพิ่มเติมจาก login_history และ users ***
    
    // นับจำนวน login ทั้งหมดจาก login_history table
    const totalLoginResult = await dbService.runQuery(`
      SELECT COUNT(*) as count FROM login_history
    `);

    // นับจำนวน login ตามช่วงเวลา
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const monthStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const [todayLoginResult, weekLoginResult, monthLoginResult] = await Promise.all([
      dbService.runQuery(`
        SELECT COUNT(*) as count FROM login_history 
        WHERE login_at >= ?
      `, [todayStart]),
      
      dbService.runQuery(`
        SELECT COUNT(*) as count FROM login_history 
        WHERE login_at >= ?
      `, [weekStart]),
      
      dbService.runQuery(`
        SELECT COUNT(*) as count FROM login_history 
        WHERE login_at >= ?
      `, [monthStart])
    ]);

    const stats: LoginStats = {
      totalLogins: totalLoginResult[0]?.count || 0,
      todayLogins: todayLoginResult[0]?.count || 0,
      weeklyLogins: weekLoginResult[0]?.count || 0,
      monthlyLogins: monthLoginResult[0]?.count || 0,
    };

    console.log('📊 Login stats from login_history:', stats);
    console.log('📊 Visit stats from getVisitStats:', visitStats);

    return res.status(200).json({
      success: true,
      stats,
      visitStats, // เพิ่มข้อมูลจาก getVisitStats ด้วย
      source: 'login_history'
    });

  } catch (error) {
    console.error('Error fetching login statistics:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch login statistics'
    });
  }
}