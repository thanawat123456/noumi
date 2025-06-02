import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import dbService from '@/lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    
    const {
      email,
      password,
      phone,
      fullName,
      birthDate,
      dayOfBirth,
      elementType,
      zodiacSign,
      bloodGroup,
      avatar
    } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const currentUser = await dbService.getUserByEmail(email);
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];

    if (email && email !== currentUser.email) {
      // Check if new email already exists
      const existingUser = await dbService.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      updates.push('email = ?');
      values.push(email);
    }

    if (password) {
      // Hash new password
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push('password = ?');
      values.push(hashedPassword);
    }

    if (phone !== undefined) {
      updates.push('phone = ?');
      values.push(phone || null);
    }

    if (fullName !== undefined) {
      updates.push('full_name = ?');
      values.push(fullName || null);
    }

    if (birthDate !== undefined) {
      updates.push('birth_date = ?');
      values.push(birthDate || null);
    }

    if (dayOfBirth !== undefined) {
      updates.push('day_of_birth = ?');
      values.push(dayOfBirth || null);
    }

    if (elementType !== undefined) {
      updates.push('element_type = ?');
      values.push(elementType || null);
    }

    if (zodiacSign !== undefined) {
      updates.push('zodiac_sign = ?');
      values.push(zodiacSign || null);
    }

    if (bloodGroup !== undefined) {
      updates.push('blood_group = ?');
      values.push(bloodGroup || null);
    }

    if (avatar !== undefined) {
      updates.push('avatar = ?');
      values.push(avatar || null);
    }

    // Add user ID for WHERE clause
    values.push(currentUser.id);

    // Execute update
    if (updates.length > 0) {
      await dbService.updateUser(currentUser.id!, updates, values);
    }

    // Get updated user data
    const updatedUser = await dbService.getUserById(currentUser.id!);
    
    if (!updatedUser) {
      return res.status(500).json({ error: 'Failed to get updated user data' });
    }

    const userResponse = {
      id: updatedUser.id,
      email: updatedUser.email,
      phone: updatedUser.phone,
      fullName: updatedUser.full_name,
      birthDate: updatedUser.birth_date,
      dayOfBirth: updatedUser.day_of_birth,
      elementType: updatedUser.element_type,
      zodiacSign: updatedUser.zodiac_sign,
      bloodGroup: updatedUser.blood_group,
      avatar: updatedUser.avatar
    };

    return res.status(200).json({
      success: true,
      user: userResponse,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

