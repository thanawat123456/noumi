// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // ฟังก์ชันสำหรับรับค่าเริ่มต้น
  const readValue = (): T => {
    // เช็คว่าอยู่ใน browser หรือไม่
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      // ดึงค่าจาก localStorage
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  // state เก็บค่าปัจจุบัน
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // ฟังก์ชันอัปเดต state และ localStorage
  const setValue = (value: T): void => {
    try {
      // เก็บค่าที่ state
      setStoredValue(value);
      
      // บันทึกลง localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  // อ่านค่าจาก localStorage เมื่อ key เปลี่ยน
  useEffect(() => {
    setStoredValue(readValue());
  }, [key]);

  return [storedValue, setValue];
}