import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import Link from 'next/link';

export default function NummuHome() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogin = () => {
    router.push('/login');
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  return (
    <>
      <Head>
        <title>Welcome - Nummu App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        {/* Phone-like screen */}
        <div className="w-full max-w-md bg-[#FFDCE6] rounded-3xl overflow-hidden p-8">
          {/* Full orange background with logo and images */}
          <div className="flex flex-col items-center justify-center py-10 bg-[#FF7A05] rounded-3xl -mx-8 -mt-8 px-8 pt-12 pb-32 relative" style={{ backgroundImage: 'url(/images/orange-bg-full.jpg)', backgroundSize: 'cover' }}>
            <div className="w-48 h-48 mb-4">
              <img 
                src="/images/noumi.png" 
                alt="Nummu Logo"
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="w-25 h-12 mb-4">
              <img 
                src="/images/nummu-guides.png" 
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="w-40 h-12">
              <img 
                src="/images/wat-suthat.svg" 
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* Pink section with a curved top-left corner */}
            <div className="absolute bottom-0 left-0 right-0 h-30 bg-[#FFDCE6]" style={{ borderTopLeftRadius: '60% 100%' }}></div>
          </div>
          
          {/* Buttons */}
          <div className="relative z-10 flex flex-col space-y-4 mt-6 px-4">
            <button 
              onClick={handleLogin}
              className="w-full py-3 bg-[#FF8CB7] hover:bg-[#FF7A05] transition text-[#FFDCE6] rounded-full z-20"
            >
              Log In
            </button>
            
            <button 
              onClick={handleSignUp}
              className="w-full py-3 bg-[#FF8CB7] hover:bg-[#FF7A05] transition text-[#FFDCE6] rounded-full z-20"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </>
  );
}