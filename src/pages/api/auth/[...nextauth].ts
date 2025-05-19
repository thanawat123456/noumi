import NextAuth, { Session, User } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbService from '@/lib/db';

// ขยาย type สำหรับ session
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

export default NextAuth({
  providers: [
    // Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    
    // Credentials Provider
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        try {
          const user = await dbService.getUserByEmailAndPassword(
            credentials.email,
            credentials.password
          );
          
          if (user) {
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
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        secure: true,
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        sameSite: 'none',
        path: '/',
        secure: true,
      },
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        secure: true,
      },
    },
  },
  
  callbacks: {
    async signIn({ user, account, profile }) {
      // ถ้าเป็นการล็อกอินด้วย Google
      if (account?.provider === 'google' && profile?.email) {
        try {
          // ตรวจสอบว่ามีผู้ใช้นี้ในฐานข้อมูลหรือยัง
          let dbUser = await dbService.getUserByEmail(profile.email);
          
          // ถ้ายังไม่มี ให้สร้างผู้ใช้ใหม่
          if (!dbUser) {
            const newUser = {
              email: profile.email,
              full_name: profile.name || '',
              avatar: profile.image || null,
              created_at: new Date().toISOString()
            };
            
            const userId = await dbService.addUser(newUser);
            dbUser = await dbService.getUserById(userId);
          }
          
          // อัปเดตข้อมูลใน user object (สำหรับใช้ใน session)
          if (dbUser && dbUser.id) {
            user.id = dbUser.id.toString();
            user.name = dbUser.full_name || profile.name || '';
            user.email = dbUser.email;
            user.image = dbUser.avatar || profile.image || null;
          }
        } catch (error) {
          console.error('Google sign-in error:', error);
          return false;
        }
      }
      
      return true;
    },
    
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub || '';
      }
      return session;
    },
    
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    }
  },
  
  pages: {
    signIn: '/login',
    error: '/login'
  },
  
  session: {
    strategy: 'jwt',
  },
  
  secret: process.env.NEXTAUTH_SECRET
});