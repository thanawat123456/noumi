import NextAuth, { Session, User } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbService from '@/lib/db';
import { updateUserData } from '@/lib/userUpdateHelper';

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
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        try {
          // Initialize database
          await dbService.init();
          
          const user = await dbService.getUserByEmailAndPassword(
            credentials.email,
            credentials.password
          );
          
          if (user) {
            // บันทึกการ login สำหรับ credentials provider
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
      try {
        // Initialize database
        await dbService.init();
        
        // ถ้าเป็นการล็อกอินด้วย Google
        if (account?.provider === 'google' && profile?.email) {
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
          } else {
            // *** แก้ไขส่วนนี้ - อัปเดตเฉพาะข้อมูลที่จำเป็นเท่านั้น ***
            // อัปเดตเฉพาะ avatar ถ้าไม่มี หรือถ้า Google มีข้อมูลใหม่
            const shouldUpdateAvatar = !dbUser.avatar && profile.image;
            
            if (shouldUpdateAvatar) {
              // ใช้ helper function สำหรับอัปเดตข้อมูล
              await updateUserData(dbUser.id!, {
                avatar: profile.image
              });
              // รีเฟรชข้อมูล user หลังจากอัปเดต
              dbUser = await dbService.getUserById(dbUser.id!);
            }
            
            // *** ไม่อัปเดต full_name เพราะ user อาจจะแก้ไขแล้ว ***
            // *** ใช้ข้อมูลจาก database แทนข้อมูลจาก Google profile ***
          }
          
          // บันทึกการ login สำหรับ Google provider
          if (dbUser && dbUser.id) {
            await dbService.recordLogin(dbUser.id);
            console.log(`Login recorded for user ${dbUser.email} (Google)`);
            
            // *** ใช้ข้อมูลจาก database เป็นหลัก แทนการใช้ข้อมูลจาก Google profile ***
            user.id = dbUser.id.toString();
            user.name = dbUser.full_name || profile.name || '';  // ใช้ข้อมูลจาก database ก่อน
            user.email = dbUser.email;
            user.image = dbUser.avatar || profile.image || null;  // ใช้ avatar จาก database ก่อน
          }
        }
        
        return true;
      } catch (error) {
        console.error('Sign-in error:', error);
        return false;
      }
    },
    
    async session({ session, token }) {
      // *** เพิ่มการโหลดข้อมูลล่าสุดจาก database ทุกครั้งที่สร้าง session ***
      if (token?.sub && session.user) {
        try {
          await dbService.init();
          const dbUser = await dbService.getUserById(parseInt(token.sub));
          
          if (dbUser) {
            // ใช้ข้อมูลล่าสุดจาก database
            session.user.id = dbUser.id?.toString() || token.sub;
            session.user.name = dbUser.full_name || session.user.name;
            session.user.email = dbUser.email || session.user.email;
            session.user.image = dbUser.avatar || session.user.image;
          } else {
            // fallback ถ้าไม่เจอใน database
            session.user.id = token.sub;
          }
        } catch (error) {
          console.error('Error loading user data in session:', error);
          // fallback to token data
          session.user.id = token.sub || '';
        }
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