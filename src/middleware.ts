// middleware.ts - Conditional approach

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // *** ปล่อย static files ทั้งหมดไปเลย ***
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname === '/manifest.json' ||
    pathname === '/sw.js' ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // *** หน้าที่ไม่ต้องป้องกัน ***
  const publicPaths = ['/', '/login', '/signup', '/set-password', '/forgot-password'];
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // *** ตรวจสอบ token เฉพาะหน้าที่ต้องป้องกัน ***
  try {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    console.log('🔐 Middleware check:', pathname, 'Has token:', !!token);

    if (!token) {
      console.log('❌ No token, redirecting to login');
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // ตรวจสอบอายุ token
    const now = Math.floor(Date.now() / 1000);
    const loginTime = Number(token.loginTime) || Number(token.iat) || 0;
    const sessionAge = now - loginTime;
    const maxAge = 6 * 60 * 60; // 6 ชั่วโมง

    if (sessionAge > maxAge) {
      console.log('❌ Token expired, redirecting to login');
      const loginUrl = new URL('/login?reason=expired', request.url);
      const response = NextResponse.redirect(loginUrl);
      
      // ล้าง cookies
      response.cookies.delete('next-auth.session-token');
      response.cookies.delete('next-auth.callback-url');
      response.cookies.delete('next-auth.csrf-token');
      
      return response;
    }

    console.log('✅ Token valid, allowing access');
    return NextResponse.next();

  } catch (error) {
    console.error('❌ Middleware error:', error);
    // ถ้าเกิด error ให้ผ่านไปเลย เพื่อไม่ให้แอพเสีย
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - files with extensions
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};