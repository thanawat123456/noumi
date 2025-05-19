import type { NextApiRequest, NextApiResponse } from 'next';
import dbService from '@/lib/db';

type TodoResponse = {
  success: boolean;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TodoResponse>
) {
  // ตรวจสอบการยืนยันตัวตน
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  const { id } = req.query;
  const todoId = Number(id);

  if (isNaN(todoId)) {
    return res.status(400).json({ success: false, error: 'Invalid todo ID' });
  }

  switch (req.method) {
    case 'PUT':
      return await updateTodo(req, res, todoId, userId);
    case 'DELETE':
      return await deleteTodo(req, res, todoId, userId);
    default:
      return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}

async function updateTodo(
  req: NextApiRequest, 
  res: NextApiResponse<TodoResponse>,
  todoId: number,
  userId: number
) {
  try {
    const { completed } = req.body;
    
    if (completed === undefined) {
      return res.status(400).json({ success: false, error: 'Completed status is required' });
    }

    await dbService.updateTodo(todoId, completed);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Update todo error:', error);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
}

async function deleteTodo(
  req: NextApiRequest, 
  res: NextApiResponse<TodoResponse>,
  todoId: number,
  userId: number
) {
  try {
    await dbService.deleteTodo(todoId);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Delete todo error:', error);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
}

// Function to get userId from request
function getUserIdFromRequest(req: NextApiRequest): number | null {
  // ในตัวอย่างนี้จะใช้วิธีอย่างง่าย
  
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