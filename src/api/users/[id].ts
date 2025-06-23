import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import dbService from '@/lib/db';

/**
 * แปลง camelCase เป็น snake_case สำหรับฐานข้อมูล
 */
const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

/**
 * แปลง database object เป็น camelCase สำหรับ frontend
 */
const dbUserToFrontend = (dbUser: any) => {
  return {
    id: dbUser.id,
    email: dbUser.email,
    phone: dbUser.phone,
    birthDate: dbUser.birth_date,
    elementType: dbUser.element_type,
    zodiacSign: dbUser.zodiac_sign,
    bloodGroup: dbUser.blood_group,
    fullName: dbUser.full_name,
    dayOfBirth: dbUser.day_of_birth,
    avatar: dbUser.avatar,
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Initialize database
    await dbService.init();
    
    // ตรวจสอบ session
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized' 
      });
    }

    const { id } = req.query;
    const userId = parseInt(id as string);

    // ตรวจสอบว่า user สามารถเข้าถึงข้อมูลตัวเองได้เท่านั้น
    const sessionUserId = parseInt(session.user?.id || '0');
    if (userId !== sessionUserId) {
      return res.status(403).json({ 
        success: false, 
        error: 'Forbidden - You can only access your own data' 
      });
    }

    if (req.method === 'GET') {
      // ดึงข้อมูลผู้ใช้
      try {
        const dbUser = await dbService.getUserById(userId);
        if (!dbUser) {
          return res.status(404).json({
            success: false,
            error: 'User not found'
          });
        }

        const user = dbUserToFrontend(dbUser);
        return res.status(200).json({
          success: true,
          user: user
        });
      } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }
    } 
    
    else if (req.method === 'PUT' || req.method === 'PATCH') {
      // อัปเดตข้อมูลผู้ใช้
      try {
        const updateData = req.body;
        
        // ตรวจสอบว่ามีข้อมูลที่จะอัปเดต
        if (!updateData || Object.keys(updateData).length === 0) {
          return res.status(400).json({
            success: false,
            error: 'No update data provided'
          });
        }

        // แปลง object เป็น arrays สำหรับ dbService.updateUser
        const updateFields: string[] = [];
        const updateValues: any[] = [];

        Object.entries(updateData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            const dbFieldName = camelToSnake(key);
            updateFields.push(dbFieldName);
            updateValues.push(value);
          }
        });

        // อัปเดตข้อมูลในฐานข้อมูล
        if (updateFields.length > 0) {
          await dbService.updateUser(userId, updateFields, updateValues);
        }
        
        // ดึงข้อมูลล่าสุดหลังจากอัปเดต
        const updatedDbUser = await dbService.getUserById(userId);
        if (!updatedDbUser) {
          return res.status(404).json({
            success: false,
            error: 'User not found after update'
          });
        }

        const updatedUser = dbUserToFrontend(updatedDbUser);
        
        return res.status(200).json({
          success: true,
          user: updatedUser,
          message: 'User updated successfully'
        });
      } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to update user'
        });
      }
    }
    
    else {
      // Method not allowed
      res.setHeader('Allow', ['GET', 'PUT', 'PATCH']);
      return res.status(405).json({
        success: false,
        error: `Method ${req.method} not allowed`
      });
    }
    
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}