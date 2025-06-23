// import { NextApiRequest, NextApiResponse } from 'next';
// import { getServerSession } from 'next-auth';
// import dbService from '@/lib/db';
// import bcrypt from 'bcryptjs';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'PUT') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   try {
//     // *** เพิ่มการตรวจสอบ authentication ***
//     const session = await getServerSession(req, res, {
//       // ใส่ config จาก [...nextauth].ts หรือ import
//     });

//     console.log('Update request session:', session?.user);

//     await dbService.init(); // *** ต้องมีการ init database ***

//     const {
//       userId,
//       email,
//       password,
//       phone,
//       fullName,
//       birthDate,
//       dayOfBirth,
//       elementType,
//       zodiacSign,
//       bloodGroup,
//       avatar
//     } = req.body;

//     console.log('Update request body:', { userId, email, fullName }); // Debug log

//     // *** ตรวจสอบ authorization - user ต้องแก้ไขข้อมูลตัวเองเท่านั้น ***
//     if (session?.user?.id) {
//       const sessionUserId = parseInt(session.user.id);
//       const requestUserId = parseInt(userId);
      
//       if (sessionUserId !== requestUserId) {
//         return res.status(403).json({ 
//           success: false, 
//           error: 'Forbidden: Cannot update other user\'s data' 
//         });
//       }
//     }

//     // ตรวจสอบว่ามี userId หรือ email
//     if (!userId && !email) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'User ID or Email is required' 
//       });
//     }

//     let currentUser;

//     // ลองหา user จาก userId ก่อน ถ้าไม่มีให้ใช้ email
//     if (userId) {
//       currentUser = await dbService.getUserById(parseInt(userId));
//     } else if (email) {
//       currentUser = await dbService.getUserByEmail(email);
//     }

//     if (!currentUser) {
//       return res.status(404).json({ 
//         success: false, 
//         error: 'User not found' 
//       });
//     }

//     console.log('Current user found:', currentUser.email); // Debug log

//     // Build update query dynamically
//     const updates: string[] = [];
//     const values: any[] = [];

//     if (email && email !== currentUser.email) {
//       // Check if new email already exists
//       const existingUser = await dbService.getUserByEmail(email);
//       if (existingUser && existingUser.id !== currentUser.id) {
//         return res.status(400).json({ 
//           success: false, 
//           error: 'Email already exists' 
//         });
//       }
//       updates.push('email = ?');
//       values.push(email);
//     }

//     if (password) {
//       // Hash new password
//       const hashedPassword = await bcrypt.hash(password, 10);
//       updates.push('password = ?');
//       values.push(hashedPassword);
//     }

//     if (phone !== undefined) {
//       updates.push('phone = ?');
//       values.push(phone || null);
//     }

//     if (fullName !== undefined) {
//       updates.push('full_name = ?');
//       values.push(fullName || null);
//     }

//     if (birthDate !== undefined) {
//       updates.push('birth_date = ?');
//       values.push(birthDate || null);
//     }

//     if (dayOfBirth !== undefined) {
//       updates.push('day_of_birth = ?');
//       values.push(dayOfBirth || null);
//     }

//     if (elementType !== undefined) {
//       updates.push('element_type = ?');
//       values.push(elementType || null);
//     }

//     if (zodiacSign !== undefined) {
//       updates.push('zodiac_sign = ?');
//       values.push(zodiacSign || null);
//     }

//     if (bloodGroup !== undefined) {
//       updates.push('blood_group = ?');
//       values.push(bloodGroup || null);
//     }

//     if (avatar !== undefined) {
//       updates.push('avatar = ?');
//       values.push(avatar || null);
//     }

//     console.log('Updates to apply:', updates); // Debug log

//     // Execute update
//     if (updates.length > 0) {
//       // *** แก้ไขการเรียก updateUser ***
//       await dbService.updateUser(currentUser.id!, updates, values);
//       console.log('Database update completed');
//     } else {
//       console.log('No updates to apply');
//     }

//     // Get updated user data
//     const updatedUser = await dbService.getUserById(currentUser.id!);
    
//     if (!updatedUser) {
//       return res.status(500).json({ 
//         success: false, 
//         error: 'Failed to get updated user data' 
//       });
//     }

//     console.log('Updated user data:', updatedUser.email); // Debug log

//     // ส่งข้อมูลกลับในรูปแบบที่ frontend ต้องการ
//     const userResponse = {
//       id: updatedUser.id,
//       email: updatedUser.email,
//       phone: updatedUser.phone,
//       fullName: updatedUser.full_name,
//       birthDate: updatedUser.birth_date,
//       dayOfBirth: updatedUser.day_of_birth,
//       elementType: updatedUser.element_type,
//       zodiacSign: updatedUser.zodiac_sign,
//       bloodGroup: updatedUser.blood_group,
//       avatar: updatedUser.avatar
//     };

//     return res.status(200).json({
//       success: true,
//       user: userResponse,
//       message: 'Profile updated successfully'
//     });

//   } catch (error) {
//     console.error('Update user error:', error);
//     return res.status(500).json({
//       success: false,
//       error: 'Internal server error'
//     });
//   }
// }