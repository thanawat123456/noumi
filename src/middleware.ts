// middleware.ts - Complete file with 6 hours session expiry

import { withAuth } from 'next-auth/middleware';
import type { NextRequest } from 'next/server';
import type { NextRequestWithAuth } from 'next-auth/middleware'; 
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl;

    // หน้าที่ไม่ต้องเช็ค authentication
    const publicPages = ['/', '/login', '/signup', '/forgot-password'];
    if (publicPages.includes(pathname)) {
      return NextResponse.next();
    }

    const token = req.nextauth.token;

    // ถ้าไม่มี token หรือไม่มี user id
    if (!token || !token.id) {
      console.log('No valid token found, redirecting to login');
      return NextResponse.redirect(new URL('/login?reason=no-token', req.url));
    }

    // *** ตรวจสอบอายุ session = 6 ชั่วโมง ***
    const now = Math.floor(Date.now() / 1000);
    const loginTime = Number(token.loginTime) || Number(token.iat) || 0;
    const sessionAge = now - loginTime;
    const maxAge = 6 * 60 * 60; // 6 ชั่วโมง (เปลี่ยนจาก 24 ชั่วโมง)

    if (sessionAge > maxAge) {
      const hoursAge = (sessionAge / 3600).toFixed(1);
      console.log(`Session expired after 6 hours: age=${hoursAge}h, max=6h`);
      
      // *** สร้าง response ที่ล้าง cookies และ redirect ***
      const response = NextResponse.redirect(new URL('/login?reason=expired', req.url));
      
      // ล้าง NextAuth cookies
      response.cookies.delete('next-auth.session-token');
      response.cookies.delete('next-auth.callback-url');
      response.cookies.delete('next-auth.csrf-token');
      
      // ล้าง cookies อื่นๆ ที่เกี่ยวข้อง
      response.cookies.delete('session-token');
      
      return response;
    }

    // *** เพิ่ม warning เมื่อ session ใกล้หมดอายุ (เหลือ 1 ชั่วโมง) ***
    const remainingTime = maxAge - sessionAge;
    if (remainingTime < 1 * 60 * 60) { // เหลือเวลาน้อยกว่า 1 ชั่วโมง
      const remainingMinutes = Math.floor(remainingTime / 60);
      console.log(`Session expiring soon: ${remainingMinutes} minutes remaining`);
      
      // เพิ่ม header เพื่อแจ้งเตือน client
      const response = NextResponse.next();
      response.headers.set('X-Session-Warning', 'expiring-soon');
      response.headers.set('X-Session-Remaining', remainingTime.toString());
      return response;
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // อนุญาตให้เข้าหน้า public
        const publicPages = ['/', '/login', '/signup', '/forgot-password'];
        if (publicPages.includes(pathname)) {
          return true;
        }
        
        // ตรวจสอบ token
        if (!token || !token.id) {
          return false;
        }
        
        // *** ตรวจสอบอายุ session = 6 ชั่วโมง ***
        const now = Math.floor(Date.now() / 1000);
        const loginTime = Number(token.loginTime) || Number(token.iat) || 0;
        const sessionAge = now - loginTime;
        const maxAge = 6 * 60 * 60; // 6 ชั่วโมง (เปลี่ยนจาก 24 ชั่วโมง)
        
        if (sessionAge > maxAge) {
          console.log('Session expired after 6 hours in authorized callback');
          return false;
        }
        
        return true;
      },
    },
  }
);

// *** กำหนด matcher สำหรับ middleware ***
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|icons).*)',
  ],
};