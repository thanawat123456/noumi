// middleware.ts - Fixed for GCP Production

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // *** เพิ่ม debugging ***
  console.log('🔍 Middleware:', pathname);

  // *** ปล่อย static files และ API routes ***
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/public') ||
    pathname.includes('.') ||
    pathname === '/manifest.json' ||
    pathname === '/sw.js' ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
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
      secret: process.env.NEXTAUTH_SECRET,
      // *** เพิ่ม configuration สำหรับ GCP ***
      secureCookie: process.env.NODE_ENV === 'production',
      cookieName: process.env.NODE_ENV === 'production' 
        ? '__Secure-next-auth.session-token' 
        : 'next-auth.session-token'
    });

    console.log('🔐 Middleware check:', {
      pathname,
      hasToken: !!token,
      tokenId: token?.id,
      userAgent: request.headers.get('user-agent')?.substring(0, 50)
    });

    if (!token || !token.id) {
      console.log('❌ No valid token, redirecting to login');
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      loginUrl.searchParams.set('reason', 'no-session');
      
      const response = NextResponse.redirect(loginUrl);
      
      // *** ล้าง cookies ที่อาจจะ corrupted ***
      response.cookies.delete('next-auth.session-token');
      response.cookies.delete('__Secure-next-auth.session-token');
      response.cookies.delete('next-auth.callback-url');
      response.cookies.delete('__Secure-next-auth.callback-url');
      response.cookies.delete('next-auth.csrf-token');
      response.cookies.delete('__Host-next-auth.csrf-token');
      
      return response;
    }

    // *** ตรวจสอบอายุ token ***
    const now = Math.floor(Date.now() / 1000);
    const loginTime = Number(token.loginTime) || Number(token.iat) || 0;
    const sessionAge = now - loginTime;
    const maxAge = 6 * 60 * 60; // 6 ชั่วโมง

    console.log('🕐 Token age check:', {
      sessionAge,
      maxAge,
      hoursOld: (sessionAge / 3600).toFixed(1),
      isExpired: sessionAge > maxAge
    });

    if (sessionAge > maxAge) {
      console.log('❌ Token expired, redirecting to login');
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('reason', 'expired');
      
      const response = NextResponse.redirect(loginUrl);
      
      // *** ล้าง cookies ทั้งหมด ***
      response.cookies.delete('next-auth.session-token');
      response.cookies.delete('__Secure-next-auth.session-token');
      response.cookies.delete('next-auth.callback-url');
      response.cookies.delete('__Secure-next-auth.callback-url');
      response.cookies.delete('next-auth.csrf-token');
      response.cookies.delete('__Host-next-auth.csrf-token');
      
      return response;
    }

    console.log('✅ Token valid, allowing access');
    return NextResponse.next();

  } catch (error) {
    console.error('❌ Middleware error:', error);
    
    // *** ถ้า error ให้ redirect ไป login ***
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    loginUrl.searchParams.set('reason', 'middleware-error');
    
    const response = NextResponse.redirect(loginUrl);
    
    // *** ล้าง cookies ที่อาจจะมีปัญหา ***
    response.cookies.delete('next-auth.session-token');
    response.cookies.delete('__Secure-next-auth.session-token');
    response.cookies.delete('next-auth.callback-url');
    response.cookies.delete('__Secure-next-auth.callback-url');
    response.cookies.delete('next-auth.csrf-token');
    response.cookies.delete('__Host-next-auth.csrf-token');
    
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, robots.txt, etc.
     * - files with extensions
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|sw.js|.*\\..*).*)',
  ],
};