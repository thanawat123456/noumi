// pages/api/users/[id].ts - แก้ไขการตรวจสอบ session

import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import dbService from '@/lib/db';

// *** สร้าง NextAuth config object แยก ***
const authOptions = {
  session: { strategy: 'jwt' as const },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }: { token: any, user?: any }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      if (token?.id) {
        session.user.id = token.id;
      }
      return session;
    }
  }
};

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
    
    // *** ใช้ authOptions ที่สร้างไว้ ***
    const session = await getServerSession(req, res, authOptions);

    console.log('API Session user ID:', session?.user?.id); // Debug log

    if (!session?.user?.id) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized - Please login' 
      });
    }

    const { id } = req.query;
    const userId = parseInt(id as string);

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID'
      });
    }

    // ตรวจสอบว่า user สามารถเข้าถึงข้อมูลตัวเองได้เท่านั้น
    const sessionUserId = parseInt(session.user.id);
    if (userId !== sessionUserId) {
      return res.status(403).json({ 
        success: false, 
        error: 'Forbidden - You can only access your own data' 
      });
    }

    if (req.method === 'GET') {
      try {
        console.log('Fetching user data for ID:', userId);
        
        const dbUser = await dbService.getUserById(userId);
        if (!dbUser) {
          return res.status(404).json({
            success: false,
            error: 'User not found'
          });
        }

        const user = dbUserToFrontend(dbUser);
        console.log('User data found:', user.email);
        
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
      try {
        const updateData = req.body;
        console.log('Update request body:', updateData);
        
        if (!updateData || Object.keys(updateData).length === 0) {
          return res.status(400).json({
            success: false,
            error: 'No update data provided'
          });
        }

        const updateFields: string[] = [];
        const updateValues: any[] = [];

        Object.entries(updateData).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            const dbFieldName = camelToSnake(key);
            updateFields.push(`${dbFieldName} = ?`);
            updateValues.push(value);
          }
        });

        console.log('Update fields:', updateFields);
        console.log('Update values:', updateValues);

        if (updateFields.length > 0) {
          await dbService.updateUser(userId, updateFields, updateValues);
          console.log('Database update completed');
        }
        
        const updatedDbUser = await dbService.getUserById(userId);
        if (!updatedDbUser) {
          return res.status(404).json({
            success: false,
            error: 'User not found after update'
          });
        }

        const updatedUser = dbUserToFrontend(updatedDbUser);
        console.log('Updated user data:', updatedUser.email);
        
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