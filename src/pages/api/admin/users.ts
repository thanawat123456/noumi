// pages/api/admin/users.ts
import { NextApiRequest, NextApiResponse } from 'next';
import dbService from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Get user email from request header or query
    // คุณอาจต้องส่ง user email มาจาก frontend ผ่าน header หรือ query parameter
    const userEmail = req.headers['user-email'] as string || req.query.userEmail as string;
    
    if (!userEmail) {
      return res.status(401).json({ success: false, error: 'No user email provided' });
    }
    
    // Get user data to check if admin
    const user = await dbService.getUserByEmail(userEmail);
    
    // Check if user is admin
    const isAdmin = user?.email === 'admin' || 
                   user?.full_name === 'admin' || 
                   user?.email?.includes('admin') ||  // ตรวจสอบว่ามีคำว่า admin ใน email
                   user?.full_name?.toLowerCase() === 'admin';
    
    if (!isAdmin) {
      return res.status(403).json({ success: false, error: 'Unauthorized - Admin access only' });
    }

    // Get all users from database
    await dbService.init();
    
    // ใช้ method ที่มีอยู่แล้วใน dbService
    // หรือคุณอาจต้องเพิ่ม method getAllUsers() ใน db.ts
    const users = await dbService.getAllUsers();
    
    // ดึงสถิติการเข้าชม
    const visitStats = await dbService.getVisitStats();

    return res.status(200).json({
      success: true,
      users: users || [],
      stats: visitStats
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
}