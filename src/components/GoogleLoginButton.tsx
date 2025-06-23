// // สร้างไฟล์: /components/GoogleLoginButton.tsx
// import React, { useEffect, useRef, useState } from 'react';
// import { useAuth } from '@/contexts/AuthContext';
// import axios from 'axios';

// interface GoogleLoginButtonProps {
//   onSuccess?: () => void;
//   onError?: (error: string) => void;
// }

// const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onSuccess, onError }) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
//   const buttonRef = useRef<HTMLDivElement>(null);
//   const { handleGoogleLoginSuccess } = useAuth(); // เปลี่ยนเป็นใช้ helper function

//   // โหลด Google Identity Services
//   useEffect(() => {
//     const loadGoogleScript = () => {
//       if (window.google) {
//         setIsGoogleLoaded(true);
//         return;
//       }

//       const script = document.createElement('script');
//       script.src = 'https://accounts.google.com/gsi/client';
//       script.async = true;
//       script.defer = true;
//       script.onload = () => {
//         setIsGoogleLoaded(true);
//       };
//       script.onerror = () => {
//         onError?.('ไม่สามารถโหลด Google Login ได้');
//       };
//       document.head.appendChild(script);
//     };

//     loadGoogleScript();
//   }, [onError]);

//   // Initialize Google Button เมื่อ Google Script โหลดเสร็จ
//   useEffect(() => {
//     if (isGoogleLoaded && buttonRef.current && window.google) {
//       try {
//         window.google.accounts.id.initialize({
//           client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '174968872857-bl9h6ha2piuq6qm8i1fldhgtda5a0o1i.apps.googleusercontent.com',
//           callback: handleCredentialResponse,
//           auto_select: false,
//           cancel_on_tap_outside: true,
//         });

//         // Render Google Button
//         window.google.accounts.id.renderButton(
//           buttonRef.current,
//           {
//             theme: 'outline',
//             size: 'large',
//             type: 'standard',
//             shape: 'rectangular',
//             text: 'signin_with',
//             logo_alignment: 'left',
//             width: '100%'
//           }
//         );
//       } catch (error) {
//         console.error('Google button initialization failed:', error);
//         onError?.('เกิดข้อผิดพลาดในการตั้งค่า Google Login');
//       }
//     }
//   }, [isGoogleLoaded]);

//   const handleCredentialResponse = async (response: any) => {
//     setIsLoading(true);
    
//     try {
//       // ส่ง credential ไปยัง backend
//       const result = await axios.post('/api/auth/google-login', {
//         credential: response.credential
//       });

//       if (result.data.success && result.data.user) {
//         // ใช้ helper function แทน
//         handleGoogleLoginSuccess(result.data.user);
        
//         onSuccess?.();
        
//         // Redirect ไปหน้า settings
//         setTimeout(() => {
//           window.location.href = '/settings';
//         }, 500);
//       } else {
//         throw new Error(result.data.error || 'Google login failed');
//       }
//     } catch (error: any) {
//       console.error('Google login failed:', error);
//       const errorMessage = error.response?.data?.error || 'การเข้าสู่ระบบด้วย Google ไม่สำเร็จ';
//       onError?.(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleManualLogin = () => {
//     if (window.google && isGoogleLoaded) {
//       window.google.accounts.id.prompt();
//     }
//   };

//   if (!isGoogleLoaded) {
//     return (
//       <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-center">
//         <div className="animate-pulse">กำลังโหลด Google Login...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full">
//       {/* Google Button Container */}
//       <div ref={buttonRef} className="w-full"></div>
      
//       {/* Fallback Button */}
//       {isLoading && (
//         <div className="w-full p-3 border border-gray-300 rounded-lg bg-blue-50 text-center mt-2">
//           <div className="flex items-center justify-center">
//             <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
//             กำลังเข้าสู่ระบบ...
//           </div>
//         </div>
//       )}
      
//       {/* Manual Trigger Button (สำรอง) */}
//       <button
//         onClick={handleManualLogin}
//         disabled={isLoading}
//         className="w-full mt-2 p-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-50"
//       >
//         {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบด้วย Google (สำรอง)'}
//       </button>
//     </div>
//   );
// };

// export default GoogleLoginButton;