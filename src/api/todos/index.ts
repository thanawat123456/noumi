import type { NextApiRequest, NextApiResponse } from 'next';
import dbService from '@/lib/db';

type TodosResponse = {
  success: boolean;
  todos?: any[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TodosResponse>
) {
  // ตรวจสอบการยืนยันตัวตน (ในตัวอย่างนี้เป็นแบบง่าย ในการใช้งานจริงควรใช้ middleware)
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      return await getTodos(req, res, userId);
    case 'POST':
      return await createTodo(req, res, userId);
    default:
      return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}

async function getTodos(
  req: NextApiRequest, 
  res: NextApiResponse<TodosResponse>,
  userId: number
) {
  try {
    const todos = await dbService.getTodosByUserId(userId);
    return res.status(200).json({ success: true, todos });
  } catch (error) {
    console.error('Get todos error:', error);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
}

async function createTodo(
  req: NextApiRequest, 
  res: NextApiResponse<TodosResponse>,
  userId: number
) {
  try {
    const { title } = req.body;
    
    if (!title) {
      return res.status(400).json({ success: false, error: 'Title is required' });
    }

    const newTodo = {
      title,
      completed: false,
      created_at: new Date().toISOString(),
      user_id: userId
    };

    await dbService.addTodo(newTodo);
    const todos = await dbService.getTodosByUserId(userId);
    
    return res.status(201).json({ success: true, todos });
  } catch (error) {
    console.error('Create todo error:', error);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
}

// Function to get userId from request
// ในโปรเจคจริงควรใช้ middleware authentication เช่น NextAuth.js
function getUserIdFromRequest(req: NextApiRequest): number | null {
  // ในตัวอย่างนี้จะใช้วิธีอย่างง่าย
  // สมมติว่าเรามี userId ใน cookie หรือ header
  
  // สำหรับการทดสอบ
  if (req.headers['x-user-id']) {
    return Number(req.headers['x-user-id']);
  }
  
  // ถ้าใช้ cookie จาก API login
  const sessionToken = req.cookies['session-token'];
  if (sessionToken && sessionToken.startsWith('user-')) {
    const userId = sessionToken.split('-')[1];
    return Number(userId);
  }
  
  return null;
}