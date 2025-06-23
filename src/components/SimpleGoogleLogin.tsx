// // สร้างไฟล์: /components/SimpleGoogleLogin.tsx
// import React, { useState } from 'react';
// import { useAuth } from '@/contexts/AuthContext';

// interface SimpleGoogleLoginProps {
//   onSuccess?: () => void;
//   onError?: (error: string) => void;
// }

// const SimpleGoogleLogin: React.FC<SimpleGoogleLoginProps> = ({ onSuccess, onError }) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const { handleGoogleLoginSuccess } = useAuth();

//   const handleGoogleLogin = () => {
//     setIsLoading(true);

//     // สร้าง Google OAuth URL แบบ manual
//     const clientId = '174968872857-bl9h6ha2piuq6qm8i1fldhgtda5a0o1i.apps.googleusercontent.com';
//     const redirectUri = `${window.location.origin}/api/auth/google-callback`;
//     const scope = 'openid email profile';
//     const responseType = 'code';
//     const state = Math.random().toString(36).substring(2, 15);

//     // เก็บ state ไว้ใน sessionStorage เพื่อตรวจสอบภายหลัง
//     sessionStorage.setItem('google_oauth_state', state);

//     const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
//       `client_id=${clientId}&` +
//       `redirect_uri=${encodeURIComponent(redirectUri)}&` +
//       `scope=${encodeURIComponent(scope)}&` +
//       `response_type=${responseType}&` +
//       `state=${state}&` +
//       `access_type=offline&` +
//       `prompt=select_account`;

//     // เปิด popup window
//     const popup = window.open(
//       googleAuthUrl,
//       'google-login',
//       'width=500,height=600,scrollbars=yes,resizable=yes'
//     );

//     // ตรวจสอบผลลัพธ์จาก popup
//     const checkClosed = setInterval(() => {
//       if (popup?.closed) {
//         clearInterval(checkClosed);
//         setIsLoading(false);
//         onError?.('การเข้าสู่ระบบถูกยกเลิก');
//       }
//     }, 1000);

//     // Listen สำหรับ message จาก popup
//     const messageListener = (event: MessageEvent) => {
//       if (event.origin !== window.location.origin) return;

//       if (event.data.type === 'GOOGLE_LOGIN_SUCCESS') {
//         clearInterval(checkClosed);
//         popup?.close();
//         window.removeEventListener('message', messageListener);
        
//         handleGoogleLoginSuccess(event.data.user);
//         setIsLoading(false);
//         onSuccess?.();
        
//         // Redirect ไปหน้า settings
//         setTimeout(() => {
//           window.location.href = '/settings';
//         }, 500);
//       } else if (event.data.type === 'GOOGLE_LOGIN_ERROR') {
//         clearInterval(checkClosed);
//         popup?.close();
//         window.removeEventListener('message', messageListener);
//         setIsLoading(false);
//         onError?.(event.data.error || 'การเข้าสู่ระบบไม่สำเร็จ');
//       }
//     };

//     window.addEventListener('message', messageListener);
//   };

//   return (
//     <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0' }}>
//       <button
//         onClick={handleGoogleLogin}
//         disabled={isLoading}
//         style={{
//           width: '48px',
//           height: '48px',
//           borderRadius: '50%',
//           backgroundColor: 'white',
//           border: 'none',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//           cursor: isLoading ? 'not-allowed' : 'pointer',
//           transition: 'all 0.2s ease',
//           opacity: isLoading ? 0.7 : 1,
//           position: 'relative',
//         }}
//         onMouseEnter={(e) => {
//           if (!isLoading) {
//             e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
//             e.currentTarget.style.transform = 'translateY(-1px)';
//           }
//         }}
//         onMouseLeave={(e) => {
//           if (!isLoading) {
//             e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
//             e.currentTarget.style.transform = 'translateY(0)';
//           }
//         }}
//       >
//         {isLoading ? (
//           <div 
//             style={{
//               width: '20px',
//               height: '20px',
//               border: '2px solid #f3f3f3',
//               borderTop: '2px solid #4285f4',
//               borderRadius: '50%',
//               animation: 'spin 1s linear infinite',
//             }}
//           ></div>
//         ) : (
//           <span 
//             style={{
//               color: '#f6802f',
//               fontSize: '24px',
//               fontWeight: 'bold',
//               fontFamily: 'Arial, sans-serif',
//             }}
//           >
//             G
//           </span>
//         )}
//       </button>

//       <style jsx>{`
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default SimpleGoogleLogin;