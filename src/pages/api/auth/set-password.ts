// src/pages/api/auth/set-password.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbService from '@/lib/db';

type SetPasswordResponse = {
  success: boolean;
  user?: any;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SetPasswordResponse>
) {
  console.log('Set-password API called with method:', req.method);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  console.log('Request body:', req.body);
  
  try {
    const { userData, password } = req.body;

    if (!userData || !password) {
      console.log('Missing data:', { userData: !!userData, password: !!password });
      return res.status(400).json({ success: false, error: 'User data and password are required' });
    }

    console.log('User data received:', {
      email: userData.email,
      hasPassword: !!password
    });

    try {
      const existingUser = await dbService.getUserByEmail(userData.email);
      
      if (existingUser) {
        console.log('Email already exists:', userData.email);
        return res.status(400).json({ success: false, error: 'Email already in use' });
      }
      
      console.log('Email is available, creating user...');
      
      const newUser = {
        email: userData.email,
        password: password,
        phone: userData.phone,
        full_name: userData.fullName,
        birth_date: userData.birthDate,
        day_of_birth: userData.dayOfBirth,
        element_type: userData.elementType,
        zodiac_sign: userData.zodiacSign,
        blood_group: userData.bloodGroup,
        avatar: userData.avatar,
        created_at: new Date().toISOString()
      };

      console.log('Prepared user data:', newUser);
      
      // บันทึกผู้ใช้ใหม่ลงฐานข้อมูล
      const userId = await dbService.addUser(newUser);
      console.log('User created with ID:', userId);
      
      const createdUser = await dbService.getUserById(userId);
      
      if (!createdUser) {
        console.log('Failed to retrieve created user');
        return res.status(500).json({ success: false, error: 'Failed to create user' });
      }
      
      console.log('User retrieved successfully');
      
      // สร้าง user object ที่จะส่งกลับไปให้ client
      const userResponse = {
        id: createdUser.id,
        email: createdUser.email,
        phone: createdUser.phone,
        birthDate: createdUser.birth_date,
        elementType: createdUser.element_type,
        zodiacSign: createdUser.zodiac_sign,
        bloodGroup: createdUser.blood_group,
        fullName: createdUser.full_name,
        dayOfBirth: createdUser.day_of_birth,
        avatar: createdUser.avatar
      };
      
      console.log('Sending user response:', userResponse);
      return res.status(200).json({ success: true, user: userResponse });
    } catch (dbError) {
      console.error('Database operation error:', dbError);
      return res.status(500).json({ success: false, error: `Database error:` });
    }
  } catch (error) {
    console.error('Set password error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown server error' 
    });
  }
}