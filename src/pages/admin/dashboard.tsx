// pages/admin/dashboard.tsx - Updated to show login count statistics
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import Head from 'next/head';
import { Users, Eye, Calendar, LogOut, Search, Filter, RefreshCw, LogIn } from 'lucide-react';
import axios from 'axios';

interface UserData {
  id: number;
  email: string;
  full_name?: string;
  phone?: string;
  birth_date?: string;
  created_at?: string;
  avatar?: string | null;
  last_login?: string;
  login_count?: number;
}

interface DashboardStats {
  totalUsers: number;
  totalLogins: number;        // *** เปลี่ยนจากการเข้าชม เป็นจำนวน login ทั้งหมด ***
  todayLogins: number;        // *** จำนวน login วันนี้ ***
  weeklyLogins: number;       // *** จำนวน login สัปดาห์นี้ ***
  monthlyLogins: number;      // *** จำนวน login เดือนนี้ ***
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, logout, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<UserData[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalLogins: 0,
    todayLogins: 0,
    weeklyLogins: 0,
    monthlyLogins: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  // Check if user is admin
  useEffect(() => {
    // รอให้ auth โหลดเสร็จก่อน
    if (authLoading) {
      console.log('Auth is still loading...');
      return;
    }
    
    console.log('Current user:', user); // Debug log
    
    if (!user) {
      console.log('No user found, redirecting to login...');
      router.push('/login');
      return;
    }

    // Check if user is admin (email or fullName is "admin")
    const isAdmin = user.email === 'admin' || 
                   user.fullName === 'admin' || 
                   user.email.includes('admin') ||  // ตรวจสอบว่ามีคำว่า admin ใน email
                   user.fullName?.toLowerCase() === 'admin';
    
    console.log('Is Admin:', isAdmin); // Debug log
    console.log('User email:', user.email); // Debug log
    console.log('User fullName:', user.fullName); // Debug log
    
    if (!isAdmin) {
      alert('คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
      router.push('/');  // เปลี่ยนไปหน้าแรกแทน
      return;
    }

    // Fetch data if admin
    fetchDashboardData();
  }, [user, router, authLoading]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // ตรวจสอบว่ามี user ก่อนเรียก API
      if (!user || !user.email) {
        console.error('No user data available');
        return;
      }
      
      // *** เรียก API สถิติการ login ***
      const [usersResponse, loginStatsResponse] = await Promise.all([
        // ดึงข้อมูลผู้ใช้
        axios.get('/api/admin/users', {
          headers: {
            'user-email': user.email
          }
        }),
        // ดึงสถิติการ login
        axios.get('/api/admin/login-stats', {
          headers: {
            'user-email': user.email
          }
        })
      ]);

      if (usersResponse.data.success) {
        setUsers(usersResponse.data.users);

        // *** ใช้สถิติการ login จาก API ***
        if (loginStatsResponse.data.success) {
          setStats({
            totalUsers: usersResponse.data.users.length,
            totalLogins: loginStatsResponse.data.stats.totalLogins || 0,
            todayLogins: loginStatsResponse.data.stats.todayLogins || 0,
            weeklyLogins: loginStatsResponse.data.stats.weeklyLogins || 0,
            monthlyLogins: loginStatsResponse.data.stats.monthlyLogins || 0,
          });
        } else {
          // *** Fallback: คำนวณจาก login_count ของ users ***
          const totalUsers = usersResponse.data.users.length;
          const totalLogins = usersResponse.data.users.reduce((sum: number, user: UserData) => 
            sum + (user.login_count || 0), 0
          );
          
          // คำนวณการ login ในช่วงเวลาต่างๆ (ใช้ last_login เป็นตัวประมาณ)
          const now = new Date();
          const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          
          // ประมาณการ login (ใช้ users ที่ login ในช่วงเวลานั้นคูณด้วย login_count เฉลี่ย)
          const avgLoginCount = totalLogins / (totalUsers || 1);
          
          const todayLoginUsers = usersResponse.data.users.filter((user: UserData) => 
            user.last_login && new Date(user.last_login) >= todayStart
          ).length;
          
          const weeklyLoginUsers = usersResponse.data.users.filter((user: UserData) => 
            user.last_login && new Date(user.last_login) >= weekStart
          ).length;
          
          const monthlyLoginUsers = usersResponse.data.users.filter((user: UserData) => 
            user.last_login && new Date(user.last_login) >= monthStart
          ).length;
          
          setStats({
            totalUsers,
            totalLogins,
            todayLogins: Math.round(todayLoginUsers * avgLoginCount),
            weeklyLogins: Math.round(weeklyLoginUsers * avgLoginCount),
            monthlyLogins: Math.round(monthlyLoginUsers * avgLoginCount),
          });
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      alert('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    router.push('/dashboard');
  };

  const handleRefresh = () => {
    fetchDashboardData();
  };

  // Filter users based on search term and date filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.phone?.includes(searchTerm));
    
    if (!matchesSearch) return false;
    
    // Date filtering
    if (filterBy === 'all') return true;
    
    const userDate = user.last_login ? new Date(user.last_login) : 
                    user.created_at ? new Date(user.created_at) : null;
    
    if (!userDate) return false;
    
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const weekStart = new Date(now.setDate(now.getDate() - 7));
    const monthStart = new Date(now.setMonth(now.getMonth() - 1));
    
    switch (filterBy) {
      case 'today':
        return userDate >= todayStart;
      case 'week':
        return userDate >= weekStart;
      case 'month':
        return userDate >= monthStart;
      default:
        return true;
    }
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return '-';
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-orange-500">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard - NUMMU</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>

      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="px-4 py-4 flex justify-between items-center">
            <div>
              <h1 className=" mt-3 text-2xl font-bold text-gray-800">ผู้ดูแลระบบ</h1>
              <p className="text-sm text-gray-800">ยินดีต้อนรับ, {user?.fullName || 'Admin'}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleRefresh}
                className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                <RefreshCw className="w-4 h-4" />
                <span>รีเฟรช</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>หน้าหลัก</span>
              </button>
            </div>
          </div>
        </header>

        {/* Stats Cards - Updated to show login statistics */}
        <div className="px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-blue-500" />
                <span className="text-sm text-gray-500">ทั้งหมด</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalUsers}</p>
              <p className="text-sm text-gray-600">ผู้ใช้งาน</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <LogIn className="w-8 h-8 text-green-500" />
                <span className="text-sm text-gray-500">วันนี้</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stats.todayLogins}</p>
              <p className="text-sm text-gray-600">เข้าชม</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-8 h-8 text-purple-500" />
                <span className="text-sm text-gray-500">สัปดาห์นี้</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stats.weeklyLogins}</p>
              <p className="text-sm text-gray-600">เข้าชม</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <Eye className="w-8 h-8 text-orange-500" />
                <span className="text-sm text-gray-500">รวมทั้งหมด</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalLogins}</p>
              <p className="text-sm text-gray-600">เข้าชม</p>
            </div>
          </div>

          {/* User List Section */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">รายชื่อผู้ใช้งาน</h2>
              
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                 <input
                    type="text"
                    placeholder="ค้นหาด้วยอีเมล, ชื่อ หรือเบอร์โทร..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-400 text-gray-500 placeholder-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                    />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-600" />
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value as any)}
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-500"
                  >
                    <option value="all">ทั้งหมด</option>
                    <option value="today">เข้าใช้วันนี้</option>
                    <option value="week">เข้าใช้สัปดาห์นี้</option>
                    <option value="month">เข้าใช้เดือนนี้</option>
                  </select>
                </div>
              </div>
            </div>

            {/* User Table - Added Login Count Column */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ผู้ใช้งาน
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      อีเมล
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      จำนวนเข้าชม
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      เข้าสู่ระบบล่าสุด
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      วันที่สมัคร
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentUsers.length > 0 ? (
                    currentUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3">
                              <img
                                src={user.avatar || '/images/profile/travel/Profile.jpeg'}
                                alt={user.full_name || 'User'}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/images/default-avatar.png';
                                }}
                              />
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.full_name || 'ไม่ระบุชื่อ'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center">
                            <LogIn className="w-4 h-4 text-green-500 mr-2" />
                            <span className="font-semibold text-green-600">
                              {user.login_count || 0} ครั้ง
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(user.last_login)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(user.created_at)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        ไม่พบข้อมูลผู้ใช้งาน
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t flex justify-between items-center">
              <p className="text-sm text-gray-600">
                {indexOfFirstUser + 1} - {Math.min(indexOfLastUser, filteredUsers.length )}  
                  จาก {filteredUsers.length} ผู้ใช้งาน
              </p>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ก่อนหน้า
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded ${
                        currentPage === pageNum
                          ? 'bg-orange-500 text-white'
                          : 'border hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ถัดไป
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}