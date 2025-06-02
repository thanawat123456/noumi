import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { ArrowLeft, Camera, Save, Calendar, Phone, Mail, User, Droplet, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';

export default function Settings() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    fullName: '',
    birthDate: '',
    dayOfBirth: '',
    elementType: '',
    zodiacSign: '',
    bloodGroup: '',
    avatar: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [avatarPreview, setAvatarPreview] = useState('');

  // Element types and zodiac signs options
  const elementTypes = ['ไม้', 'ไฟ', 'ดิน', 'โลหะ', 'น้ำ'];
  const zodiacSigns = ['ชวด', 'ฉลู', 'ขาล', 'เถาะ', 'มะโรง', 'มะเส็ง', 'มะเมีย', 'มะแม', 'วอก', 'ระกา', 'จอ', 'กุน'];
  const bloodGroups = ['A', 'B', 'AB', 'O'];
  const daysOfWeek = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

  // Load user data
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
    
    if (user) {
      setFormData({
        email: user.email || '',
        password: '', // Don't pre-fill password
        confirmPassword: '',
        phone: user.phone || '',
        fullName: user.fullName || '',
        birthDate: user.birthDate || '',
        dayOfBirth: user.dayOfBirth || '',
        elementType: user.elementType || '',
        zodiacSign: user.zodiacSign || '',
        bloodGroup: user.bloodGroup || '',
        avatar: user.avatar || ''
      });
      setAvatarPreview(user.avatar || '');
    }
  }, [user, isAuthenticated, isLoading, router]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle avatar upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Here you would typically upload to a server
    // For now, we'll store as base64
    const base64 = await convertToBase64(file);
    setFormData(prev => ({
      ...prev,
      avatar: base64
    }));
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords if changing
    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'รหัสผ่านไม่ตรงกัน' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const updateData: any = {
        email: formData.email,
        phone: formData.phone,
        fullName: formData.fullName,
        birthDate: formData.birthDate,
        dayOfBirth: formData.dayOfBirth,
        elementType: formData.elementType,
        zodiacSign: formData.zodiacSign,
        bloodGroup: formData.bloodGroup,
        avatar: formData.avatar
      };

      // Only include password if it's being changed
      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await axios.put('/api/user/update', updateData);

      if (response.data.success) {
        setMessage({ type: 'success', text: 'บันทึกข้อมูลสำเร็จ' });
        
        // Update local storage and context
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          password: '',
          confirmPassword: ''
        }));
      } else {
        throw new Error(response.data.error || 'Failed to update');
      }
    } catch (error: any) {
      console.error('Update error:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-[#FF7A05]">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>การตั้งค่า - Nummu App</title>
      </Head>

      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-[#FF7A05] text-white p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-semibold">การตั้งค่า</h1>
            <div className="w-10"></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 max-w-2xl mx-auto">
          {/* Message */}
          {message.text && (
            <div className={`mb-4 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#FF7A05] mb-4">รูปโปรไฟล์</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={avatarPreview || '/images/default-avatar.png'}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover border-4 border-[#FF7A05]/20"
                  />
                  <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-[#FF7A05] text-white p-2 rounded-full cursor-pointer hover:bg-[#E56A00] transition-colors">
                    <Camera size={16} />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <div>
                  <p className="text-sm text-gray-600">คลิกที่ไอคอนกล้องเพื่อเปลี่ยนรูป</p>
                  <p className="text-xs text-gray-500">รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 5MB</p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-[#FF7A05] mb-4">ข้อมูลส่วนตัว</h2>
              
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User size={16} className="mr-2 text-[#FF7A05]" />
                  ชื่อ-นามสกุล
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A05]"
                  placeholder="กรอกชื่อ-นามสกุล"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Mail size={16} className="mr-2 text-[#FF7A05]" />
                  อีเมล
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A05]"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Phone size={16} className="mr-2 text-[#FF7A05]" />
                  เบอร์โทรศัพท์
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A05]"
                  placeholder="08X-XXX-XXXX"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} className="mr-2 text-[#FF7A05]" />
                  วันเกิด
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A05]"
                />
              </div>
            </div>

            {/* Birth and Zodiac Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-[#FF7A05] mb-4">ข้อมูลดวงชะตา</h2>
              
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Star size={16} className="mr-2 text-[#FF7A05]" />
                  วันเกิด (วันในสัปดาห์)
                </label>
                <select
                  name="dayOfBirth"
                  value={formData.dayOfBirth}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A05]"
                >
                  <option value="">เลือกวันเกิด</option>
                  {daysOfWeek.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">ธาตุประจำตัว</label>
                <select
                  name="elementType"
                  value={formData.elementType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A05]"
                >
                  <option value="">เลือกธาตุ</option>
                  {elementTypes.map(element => (
                    <option key={element} value={element}>{element}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">ปีนักษัตร</label>
                <select
                  name="zodiacSign"
                  value={formData.zodiacSign}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A05]"
                >
                  <option value="">เลือกปีนักษัตร</option>
                  {zodiacSigns.map(zodiac => (
                    <option key={zodiac} value={zodiac}>{zodiac}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Droplet size={16} className="mr-2 text-[#FF7A05]" />
                  หมู่เลือด
                </label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A05]"
                >
                  <option value="">เลือกหมู่เลือด</option>
                  {bloodGroups.map(blood => (
                    <option key={blood} value={blood}>{blood}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-[#FF7A05] mb-4">เปลี่ยนรหัสผ่าน</h2>
              <p className="text-sm text-gray-600 mb-4">เว้นว่างไว้หากไม่ต้องการเปลี่ยนรหัสผ่าน</p>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">รหัสผ่านใหม่</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A05]"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">ยืนยันรหัสผ่านใหม่</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A05]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF7A05] text-white py-3 rounded-full font-medium hover:bg-[#E56A00] transition-colors disabled:bg-gray-400 flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save size={20} className="mr-2" />
                  บันทึกการเปลี่ยนแปลง
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}