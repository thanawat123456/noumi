// pages/api/auth/[...nextauth].ts - Updated for Cloud Run, TypeScript, and login issue handling
import NextAuth, { Session, User } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbService from '@/lib/db';
import { updateUserData } from '@/lib/userUpdateHelper';
import { NextApiRequest } from 'next';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

// ตรวจสอบตัวแปรสภาพแวดล้อม
const requiredEnvVars = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'NEXTAUTH_SECRET'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Environment-based configuration
const isProduction = process.env.NODE_ENV === 'production';
const cloudRunUrl = process.env.NEXTAUTH_URL || process.env.NEXTAUTH_URL_INTERNAL;

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: 'select_account',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    CredentialsProvider({
  name: 'Credentials',
  credentials: {
    email: { label: 'Email', type: 'email' },
    password: { label: 'Password', type: 'password' },
  },
  async authorize(credentials: any, req: any) {
    console.log('🔐 NextAuth authorize called with:', credentials?.email);

    if (!(await dbService.healthCheck())) {
      console.error('❌ Database is not healthy during authorize');
      return null;
    }

    if (!credentials?.email || !credentials?.password) {
      console.log('❌ Missing credentials');
      return null;
    }

    try {
      await dbService.init();
      const user = await dbService.getUserByEmailAndPassword(credentials.email, credentials.password);

      if (!user || user.id == null) return null;

      const ipAddress = (req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown')
        .toString().split(',')[0].trim();
      const userAgent = req.headers['user-agent']?.toString() || 'unknown';

      await dbService.recordLogin(user.id, ipAddress, userAgent);
      return {
        id: user.id.toString(),
        email: user.email,
        name: user.full_name || '',
        image: user.avatar || null,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('❌ Authorize error:', {
          message: error.message,
          stack: error.stack,
          code: (error as any).code,
          errno: (error as any).errno,
        });
      } else {
        console.error('❌ Unknown authorize error:', error);
      }
      return null;
    }
  },
}),

  ],

  session: {
    strategy: 'jwt',
    maxAge: 6 * 60 * 60, // 6 ชั่วโมง
    updateAge: 1 * 60 * 60, // อัปเดตทุก 1 ชั่วโมง
  },

  cookies: {
    sessionToken: {
      name: isProduction ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: isProduction,
        maxAge: 6 * 60 * 60,
      },
    },
    callbackUrl: {
      name: isProduction ? '__Secure-next-auth.callback-url' : 'next-auth.callback-url',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: isProduction,
      },
    },
    csrfToken: {
      name: isProduction ? '__Host-next-auth.csrf-token' : 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: isProduction,
      },
    },
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('🔄 SignIn callback called for:', user.email, 'via', account?.provider);

      try {
        if (!(await dbService.healthCheck())) {
          console.error('❌ Database is not healthy during signIn');
          return false;
        }

        await dbService.init();

        if (account?.provider === 'google' && profile?.email) {
          console.log('🔍 Processing Google OAuth sign-in');
          let dbUser = await dbService.getUserByEmail(profile.email);

          if (!dbUser) {
            console.log('👤 Creating new user from Google OAuth');
            const newUser = {
              email: profile.email,
              full_name: profile.name || profile.email.split('@')[0],
              avatar: profile.image || null,
              created_at: new Date().toISOString(),
            };
            const userId = await dbService.addUser(newUser);
            dbUser = await dbService.getUserById(userId);
          } else {
            const shouldUpdateAvatar = !dbUser.avatar && profile.image;
            if (shouldUpdateAvatar) {
              await updateUserData(dbUser.id!, { avatar: profile.image });
              dbUser = await dbService.getUserById(dbUser.id!);
            }
          }

          if (dbUser && dbUser.id !== undefined && dbUser.id !== null) {
            // ใช้ account providerAccountId หรือ fallback เพราะ req ไม่มีใน signIn callback
            const ipAddress = null; // ไม่มี IP จริง
            const userAgent = account?.provider || 'google';

            await dbService.recordLogin(dbUser.id, ipAddress, userAgent);

            console.log(`✅ Login recorded for user ${dbUser.email} (Google)`);

            user.id = dbUser.id.toString();
            user.name = dbUser.full_name || profile.name || '';
            user.email = dbUser.email;
            user.image = dbUser.avatar || profile.image || null;
          } else {
            console.warn('⚠️ Invalid user data, aborting sign-in');
            return false;
          }
        }

        return true;
      } catch (error: any) {
        console.error('❌ SignIn callback error:', {
          message: error.message || 'Unknown error',
          stack: error.stack,
          code: error.code,
          errno: error.errno,
        });
        return false;
      }
    },

    async redirect({ url, baseUrl }) {
      const actualBaseUrl = cloudRunUrl || baseUrl;
      if (url.startsWith('/')) return `${actualBaseUrl}${url}`;
      else if (new URL(url).origin === actualBaseUrl) return url;
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

        delete token.name;
        delete token.email;
        delete token.picture;
      }

      const now = Math.floor(Date.now() / 1000);
      const loginTime = Number(token.loginTime) || Number(token.iat) || 0;
      const tokenAge = now - loginTime;
      const maxAge = 6 * 60 * 60;

      console.log('🕐 JWT: Token age check - age:', tokenAge, 'max:', maxAge, 'hours:', (tokenAge / 3600).toFixed(1));

      if (tokenAge > maxAge) {
        console.log('❌ JWT: Token expired after 6 hours, forcing re-login');
        return {};
      }

      return token;
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  debug: !isProduction,

  secret: process.env.NEXTAUTH_SECRET,
});