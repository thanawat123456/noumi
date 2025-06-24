// pages/api/auth/[...nextauth].ts - Fixed for Cloud Run

import NextAuth, { Session, User } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbService from '@/lib/db';
import { updateUserData } from '@/lib/userUpdateHelper';

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

// *** Environment-based configuration ***
const isProduction = process.env.NODE_ENV === 'production';
const cloudRunUrl = process.env.NEXTAUTH_URL || process.env.NEXTAUTH_URL_INTERNAL;

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        try {
          await dbService.init();
          
          const user = await dbService.getUserByEmailAndPassword(
            credentials.email,
            credentials.password
          );
          
          if (user) {
            await dbService.recordLogin(user.id!);
            console.log(`Login recorded for user ${user.email} (credentials)`);
            
            return {
              id: user.id?.toString() || '',
              email: user.email,
              name: user.full_name || '',
              image: user.avatar || null
            };
          }
          return null;
        } catch (error) {
          console.error('Login error:', error);
          return null;
        }
      }
    })
  ],
  
  // *** Session configuration - 6 hours ***
  session: {
    strategy: 'jwt',
    maxAge: 6 * 60 * 60, // 6 ชั่วโมง
    updateAge: 1 * 60 * 60, // อัปเดตทุก 1 ชั่วโมง
  },
  
  // *** Cookie configuration - Fixed for Cloud Run ***
  cookies: {
    sessionToken: {
      name: isProduction ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax', // เปลี่ยนจาก 'none' เป็น 'lax'
        path: '/',
        secure: isProduction, // Environment-based
        maxAge: 6 * 60 * 60, // 6 ชั่วโมง
      },
    },
    callbackUrl: {
      name: isProduction ? '__Secure-next-auth.callback-url' : 'next-auth.callback-url',
      options: {
        sameSite: 'lax', // เปลี่ยนจาก 'none'
        path: '/',
        secure: isProduction,
      },
    },
    csrfToken: {
      name: isProduction ? '__Host-next-auth.csrf-token' : 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax', // เปลี่ยนจาก 'none'
        path: '/',
        secure: isProduction,
      },
    },
  },
  
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await dbService.init();
        
        if (account?.provider === 'google' && profile?.email) {
          let dbUser = await dbService.getUserByEmail(profile.email);
          
          if (!dbUser) {
            const newUser = {
              email: profile.email,
              full_name: profile.name || '',
              avatar: profile.image || null,
              created_at: new Date().toISOString()
            };
            
            const userId = await dbService.addUser(newUser);
            dbUser = await dbService.getUserById(userId);
          } else {
            const shouldUpdateAvatar = !dbUser.avatar && profile.image;
            
            if (shouldUpdateAvatar) {
              await updateUserData(dbUser.id!, {
                avatar: profile.image
              });
              dbUser = await dbService.getUserById(dbUser.id!);
            }
          }
          
          if (dbUser && dbUser.id) {
            await dbService.recordLogin(dbUser.id);
            console.log(`Login recorded for user ${dbUser.email} (Google)`);
            
            user.id = dbUser.id.toString();
            user.name = dbUser.full_name || profile.name || '';
            user.email = dbUser.email;
            user.image = dbUser.avatar || profile.image || null;
          }
        }
        
        return true;
      } catch (error) {
        console.error('Sign-in error:', error);
        return false;
      }
    },
    
    // *** Redirect callback - Fixed for Cloud Run ***
    async redirect({ url, baseUrl }) {
      // ใช้ Cloud Run URL เป็น baseUrl
      const actualBaseUrl = cloudRunUrl || baseUrl;
      
      // ถ้า url เป็น relative path
      if (url.startsWith("/")) return `${actualBaseUrl}${url}`;
      
      // ถ้า url เป็น same origin
      else if (new URL(url).origin === actualBaseUrl) return url;
      
      // Default กลับไป baseUrl
      return actualBaseUrl;
    },
    
    async session({ session, token }) {
      console.log('👤 Session: Creating session for token:', token.id);
      
      if (token?.id && session.user) {
        session.user.id = String(token.id);
      }
      
      return session;
    },
    
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.loginTime = Math.floor(Date.now() / 1000);
        token.iat = Math.floor(Date.now() / 1000);
        
        console.log('🔐 JWT: Setting loginTime for user:', user.id, 'at:', token.loginTime);
        
        // ลบข้อมูลอื่นออกเพื่อลดขนาด
        delete token.name;
        delete token.email;
        delete token.picture;
      }
      
      // ตรวจสอบว่า token หมดอายุหรือไม่ (6 ชั่วโมง)
      const now = Math.floor(Date.now() / 1000);
      const loginTime = Number(token.loginTime) || Number(token.iat) || 0;
      const tokenAge = now - loginTime;
      const maxAge = 6 * 60 * 60; // 6 ชั่วโมง
      
      console.log('🕐 JWT: Token age check - age:', tokenAge, 'max:', maxAge, 'hours:', (tokenAge / 3600).toFixed(1));
      
      if (tokenAge > maxAge) {
        console.log('❌ JWT: Token expired after 6 hours, forcing re-login');
        return {}; // ส่ง empty token เพื่อให้ logout
      }
      
      return token;
    }
  },
  
  pages: {
    signIn: '/login',
    error: '/login'
  },
  
  debug: !isProduction, // Debug เฉพาะ development
  
  secret: process.env.NEXTAUTH_SECRET
});