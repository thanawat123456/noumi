import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';

// นิยาม interface สำหรับ Todo
interface Todo {
  id?: number;
  title: string;
  completed: boolean;
  created_at: string;
  user_id: number;
}

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user, isAuthenticated } = useAuth();

  // ฟังก์ชันสำหรับดึงข้อมูล todos
  const fetchTodos = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setTodos([]);
      setIsLoading(false);
      return;
    }

    try {
      // เรียกใช้ API endpoint ที่สร้างไว้
      const response = await axios.get('/api/todos', {
        headers: {
          'x-user-id': user.id.toString() // สำหรับการระบุตัวตนแบบง่าย
        }
      });
      
      if (response.data.success) {
        setTodos(response.data.todos || []);
      } else {
        setTodos([]);
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
      setTodos([]);
    } finally {
      setIsLoading(false);
    }
  }, [user, isAuthenticated]);

  // โหลดข้อมูลเมื่อ component ถูกโหลด
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // เพิ่ม todo
  const addTodo = async (title: string) => {
    if (!title.trim() || !user) return;

    try {
      const response = await axios.post('/api/todos', 
        { title },
        { headers: { 'x-user-id': user.id.toString() } }
      );
      
      if (response.data.success) {
        setTodos(response.data.todos || []);
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  // อัปเดตสถานะ todo
  const toggleTodo = async (id: number, completed: boolean) => {
    if (!user || !id) return;
    
    try {
      await axios.put(`/api/todos/${id}`, 
        { completed },
        { headers: { 'x-user-id': user.id.toString() } }
      );
      
      // อัปเดตสถานะ todo ในรายการท้องถิ่น
      setTodos(prevTodos => 
        prevTodos.map(todo => 
          todo.id === id ? { ...todo, completed } : todo
        )
      );
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  // ลบ todo
  const deleteTodo = async (id: number) => {
    if (!user || !id) return;
    
    try {
      await axios.delete(`/api/todos/${id}`, {
        headers: { 'x-user-id': user.id.toString() }
      });
      
      // ลบ todo จากรายการท้องถิ่น
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    isLoading,
    refetch: fetchTodos
  };
};