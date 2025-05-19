import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { AppProps } from 'next/app';
import { ComponentType } from 'react'; // Use ComponentType from react
// Routes configuration
export const routes = {
  // Public routes (accessible without authentication)
  public: [
    '/login',
    '/signup',
    '/forgot-password',
    '/set-password',
    '/',
  ],

  // Protected routes (require authentication)
  protected: [
    '/dashboard',
    '/sacred-places',
    '/sacred-places/[templeId]',
    '/sacred-places/[templeId]/buddha-statues/[statueId]',
    '/fortune-places',
    '/ritual-places',
    '/activity-places',
    '/profile',
    '/settings',
    '/merit',
    '/fortunes',
    '/news',
  ],
};

// Authentication middleware component
interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Check if route requires authentication
    const pathIsProtected = routes.protected.some((path) => {
      // Handle dynamic routes
      if (path.includes('[') && path.includes(']')) {
        const pathParts = path.split('/');
        const routeParts = router.pathname.split('/');

        if (pathParts.length !== routeParts.length) {
          return false;
        }

        return pathParts.every((part, i) => {
          if (part.startsWith('[') && part.endsWith(']')) {
            return true; // Dynamic part, consider it a match
          }
          return part === routeParts[i];
        });
      }

      return path === router.pathname;
    });

    if (!isLoading) {
      if (pathIsProtected && !isAuthenticated) {
        // Redirect to login if accessing protected route without authentication
        router.push('/login');
        setAuthorized(false);
      } else if (!pathIsProtected && isAuthenticated && routes.public.includes(router.pathname)) {
        // Redirect to dashboard if authenticated user tries to access login/signup
        router.push('/dashboard');
        setAuthorized(false);
      } else {
        setAuthorized(true);
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading indicator while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-orange-500">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  // Show children when authorized
  return authorized ? <>{children}</> : null;
}

// Integration with _app.tsx
interface AppWithAuthProps {
  Component: ComponentType;
  pageProps: AppProps['pageProps'];
}

export function AppWithAuth({ Component, pageProps }: AppWithAuthProps) {
  return (
    <AuthGuard>
      <Component {...pageProps} />
    </AuthGuard>
  );
}