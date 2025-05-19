// src/pages/_app.tsx
import '@/styles/globals.css';
import '../app/globals.css'

import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  // ตรวจสอบว่าอยู่ใน browser ไม่ใช่ server-side
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // แสดง loading หรือไม่แสดงอะไรเลยระหว่าง hydration
    return null;
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#FF6B93" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <title>Nummu App</title>
      </Head>
      <div className="mx-auto" style={{ maxWidth: '414px', margin: '0 auto', height: '100dvh', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <SessionProvider session={session}>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </SessionProvider>
      </div>
    </>
  );
}

export default MyApp;