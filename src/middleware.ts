// middleware.ts - Fixed for Cloud Run production

import { withAuth } from 'next-auth/middleware';
import type { NextRequest } from 'next/server';
import type { NextRequestWithAuth } from 'next-auth/middleware'; 
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl;

    // หน้าที่ไม่ต้องเช็ค authentication
    const publicPages = ['/', '/login', '/signup','/set-password', '/forgot-password'];
    if (publicPages.includes(pathname)) {
      return NextResponse.next();
    }

    const token = req.nextauth.token;

    // *** เพิ่ม debug log สำหรับ production ***
    console.log('🔐 Middleware - Path:', pathname);
    console.log('🔐 Middleware - Has token:', !!token);
    console.log('🔐 Middleware - Token ID:', token?.id);

    // ถ้าไม่มี token หรือไม่มี user id
    if (!token || !token.id) {
      console.log('❌ No valid token found, redirecting to login');
      const response = NextResponse.redirect(new URL('/login?reason=no-token', req.url));
      
      // *** เพิ่มการล้าง cookies ที่อาจจะติดค้าง ***
      response.cookies.delete('next-auth.session-token');
      response.cookies.delete('next-auth.callback-url');
      response.cookies.delete('next-auth.csrf-token');
      
      return response;
    }

    // ตรวจสอบอายุ session = 6 ชั่วโมง
    const now = Math.floor(Date.now() / 1000);
    const loginTime = Number(token.loginTime) || Number(token.iat) || 0;
    const sessionAge = now - loginTime;
    const maxAge = 6 * 60 * 60;

    console.log('🕐 Middleware - Session age:', sessionAge, 'seconds');
    console.log('🕐 Middleware - Max age:', maxAge, 'seconds');

    if (sessionAge > maxAge) {
      const hoursAge = (sessionAge / 3600).toFixed(1);
      console.log(`❌ Session expired after 6 hours: age=${hoursAge}h, max=6h`);
      
      const response = NextResponse.redirect(new URL('/login?reason=expired', req.url));
      
      // ล้าง NextAuth cookies
      response.cookies.delete('next-auth.session-token');
      response.cookies.delete('next-auth.callback-url');
      response.cookies.delete('next-auth.csrf-token');
      response.cookies.delete('session-token');
      
      return response;
    }

    // เพิ่ม warning เมื่อ session ใกล้หมดอายุ
    const remainingTime = maxAge - sessionAge;
    if (remainingTime < 1 * 60 * 60) {
      const remainingMinutes = Math.floor(remainingTime / 60);
      console.log(`⚠️ Session expiring soon: ${remainingMinutes} minutes remaining`);
      
      const response = NextResponse.next();
      response.headers.set('X-Session-Warning', 'expiring-soon');
      response.headers.set('X-Session-Remaining', remainingTime.toString());
      return response;
    }

    console.log('✅ Middleware - Session valid, proceeding');
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // อนุญาตให้เข้าหน้า public
        const publicPages = ['/', '/login', '/signup','/set-password', '/forgot-password'];
        if (publicPages.includes(pathname)) {
          return true;
        }
        
        // *** เพิ่ม debug log ***
        console.log('🔐 Authorized callback - Path:', pathname);
        console.log('🔐 Authorized callback - Has token:', !!token);
        console.log('🔐 Authorized callback - Token ID:', token?.id);
        
        // ตรวจสอบ token
        if (!token || !token.id) {
          console.log('❌ Authorized callback - No valid token');
          return false;
        }
        
        // ตรวจสอบอายุ session = 6 ชั่วโมง
        const now = Math.floor(Date.now() / 1000);
        const loginTime = Number(token.loginTime) || Number(token.iat) || 0;
        const sessionAge = now - loginTime;
        const maxAge = 6 * 60 * 60;
        
        if (sessionAge > maxAge) {
          console.log('❌ Authorized callback - Session expired after 6 hours');
          return false;
        }
        
        console.log('✅ Authorized callback - Token valid');
        return true;
      },
    },
  }
);

// กำหนด matcher สำหรับ middleware
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