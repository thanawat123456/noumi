import { useState, useEffect, CSSProperties } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

// Error Modal Component
interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  actionText?: string;
  actionLink?: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  actionText, 
  actionLink 
}) => {
  if (!isOpen) return null;

  const modalStyles: { [key: string]: CSSProperties } = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px',
    },
    modal: {
      backgroundColor: '#ffecf1',
      borderRadius: '20px',
      padding: '32px',
      maxWidth: '400px',
      width: '100%',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
      animation: 'slideIn 0.3s ease-out',
      position: 'relative',
    },
    closeButton: {
      position: 'absolute',
      top: '16px',
      right: '16px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#f6802f',
      fontSize: '24px',
      fontWeight: 'bold',
    },
    icon: {
      textAlign: 'center',
      marginBottom: '20px',
      fontSize: '48px',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#f6802f',
      textAlign: 'center',
      marginBottom: '16px',
    },
    message: {
      fontSize: '16px',
      color: '#666',
      textAlign: 'center',
      lineHeight: '1.5',
      marginBottom: '24px',
    },
    buttonContainer: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center',
    },
    button: {
      padding: '12px 24px',
      borderRadius: '25px',
      border: 'none',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    primaryButton: {
      backgroundColor: '#FF8CB7',
      color: 'white',
    },
    secondaryButton: {
      backgroundColor: 'white',
      color: '#f6802f',
      border: '2px solid #f6802f',
    },
  };

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={modalStyles.closeButton} onClick={onClose}>
          ×
        </button>
        
        <div style={modalStyles.icon}>
          ⚠️
        </div>
        
        <h3 style={modalStyles.title}>{title}</h3>
        <p style={modalStyles.message}>{message}</p>
        
        <div style={modalStyles.buttonContainer}>
          {actionText && actionLink ? (
            <>
              <Link href={actionLink}>
                <button 
                  style={{...modalStyles.button, ...modalStyles.primaryButton}}
                  onClick={onClose}
                >
                  {actionText}
                </button>
              </Link>
              <button 
                style={{...modalStyles.button, ...modalStyles.secondaryButton}}
                onClick={onClose}
              >
                ลองใหม่
              </button>
            </>
          ) : (
            <button 
              style={{...modalStyles.button, ...modalStyles.primaryButton}}
              onClick={onClose}
            >
              ตกลง
            </button>
          )}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default function Login() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Modal states
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorModalData, setErrorModalData] = useState({
    title: '',
    message: '',
    actionText: '',
    actionLink: ''
  });

  // ถ้าผู้ใช้ล็อกอินอยู่แล้ว ให้ redirect ไปหน้าหลัก
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  const showError = (title: string, message: string, actionText?: string, actionLink?: string) => {
    setErrorModalData({
      title,
      message,
      actionText: actionText || '',
      actionLink: actionLink || ''
    });
    setShowErrorModal(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !password) {
      showError(
        'ข้อมูลไม่ครบถ้วน',
        'กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน'
      );
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      // ลบ router.push('/dashboard') ออก เพราะ useEffect จะทำงานเมื่อ isAuthenticated เปลี่ยน
    } catch (err: any) {
      // ใช้ AuthError ที่มี userMessage แทน
      if (err.name === 'AuthError') {
        if (err.statusCode === 401 || err.statusCode === 404) {
          showError(
            'ไม่พบข้อมูลผู้ใช้',
            'ดูเหมือนว่าคุณยังไม่ได้สมัครสมาชิกหรืออีเมล/รหัสผ่านไม่ถูกต้อง กรุณาสมัครสมาชิกก่อนเข้าใช้งาน',
            'สมัครสมาชิก',
            '/signup'
          );
        } else if (err.statusCode === 400) {
          showError(
            'ข้อมูลไม่ถูกต้อง',
            err.userMessage || 'กรุณาตรวจสอบรูปแบบอีเมลและรหัสผ่านของคุณ'
          );
        } else if (err.statusCode >= 500) {
          showError(
            'เซิร์ฟเวอร์ขัดข้อง',
            err.userMessage || 'ระบบมีปัญหาชั่วคราว กรุณาลองใหม่อีกครั้งในภายหลัง'
          );
        } else if (err.statusCode === 0) {
          showError(
            'ปัญหาการเชื่อมต่อ',
            err.userMessage || 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้'
          );
        } else {
          showError(
            'เข้าสู่ระบบไม่สำเร็จ',
            err.userMessage || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'
          );
        }
      } else {
        // Fallback สำหรับ error ที่ไม่ใช่ AuthError
        showError(
          'เข้าสู่ระบบไม่สำเร็จ',
          'เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error: any) {
      if (error.name === 'AuthError') {
        showError(
          'Google Login ไม่สำเร็จ',
          error.userMessage || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Google กรุณาลองใหม่อีกครั้ง'
        );
      } else {
        showError(
          'Google Login ไม่สำเร็จ',
          'เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Google กรุณาลองใหม่อีกครั้ง'
        );
      }
    }
  };

  const styles: { [key: string]: CSSProperties } = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#f3f4f6',
      padding: '16px',
    },
    card: {
      width: '100%',
      minHeight: '100vh',
      maxWidth: '100vh',
      background: '#ffecf1',
      borderRadius: '28px',
      padding: '24px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      color: '#f6802f',
      marginBottom: '16px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '4px',
    },
    backIcon: {
      width: '24px',
      height: '24px',
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#f6802f',
      textAlign: 'center',
      marginBottom: '32px',
    },
    greetingTitle: {
      fontSize: '26px',
      fontWeight: 'bold',
      color: '#f6802f',
      marginBottom: '8px',
    },
    greetingText: {
      fontSize: '14px',
      color: '#f6802f',
      marginBottom: '24px',
      lineHeight: '1.4',
    },
    formGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      fontSize: '16px',
      fontWeight: '500',
      color: '#f6802f',
      marginBottom: '8px',
    },
    inputContainer: {
      position: 'relative',
    },
    input: {
      width: '100%',
      padding: '14px 20px',
      borderRadius: '9999px',
      border: '1px solid #e5e7eb',
      backgroundColor: 'white',
      fontSize: '16px',
      color: '#FF7A05',
      outline: 'none',
    },
    passwordToggle: {
      position: 'absolute',
      right: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#f6802f',
    },
    forgotPassword: {
      display: 'block',
      textAlign: 'right',
      fontSize: '14px',
      color: '#FF8CB7',
      marginTop: '8px',
      textDecoration: 'none',
    },
    loginButton: {
      width: '100%',
      padding: '14px',
      borderRadius: '9999px',
      backgroundColor: '#FF8CB7',
      color: '#FFDCE6',
      border: 'none',
      fontSize: '18px',
      fontWeight: '500',
      cursor: 'pointer',
      marginTop: '24px',
      marginBottom: '16px',
      opacity: isSubmitting ? 0.7 : 1,
    },
    orSignUpWith: {
      textAlign: 'center',
      color: '#FF8CB7',
      fontSize: '14px',
      margin: '16px 0',
    },
    socialContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '16px',
      margin: '24px 0',
    },
    socialButton: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      backgroundColor: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: 'none',
      cursor: 'pointer',
    },
    socialIcon: {
      color: '#f6802f',
      fontSize: '24px',
      fontWeight: 'bold',
    },
    signUpText: {
      textAlign: 'center',
      fontSize: '14px',
      color: '#ee5f9b',
      marginTop: '16px',
    },
    signUpLink: {
      color: '#ee5f9b',
      fontWeight: '500',
      textDecoration: 'none',
    },
  };

  return (
    <>
      <Head>
        <title>Log In - Nummu App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div style={styles.container}>
        <div style={styles.card}>
          {/* ปุ่มกลับ */}
          <Link href="/" style={styles.backButton}>
            <svg style={styles.backIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>

          {/* หัวข้อ */}
          <h1 style={styles.title}>Log In</h1>
          
          {/* คำทักทาย */}
          <h2 style={styles.greetingTitle}>สวัสดี :)</h2>
          <p style={styles.greetingText}>
            ยอดนิยม กลุ่มเราขาว &quot;ผู้&quot; เข้าสู่แอปพลิเคชัน
            ที่จะช่วยให้คุณตามหาแหล่งที่พักทางจิตใจและได้เข้าถึง
            การไหว้พระ ขอพร ที่สะดวกนามมากยิ่งขึ้น
          </p>
          
          <form onSubmit={handleSubmit}>
            {/* อีเมลหรือเบอร์โทร */}
            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>Email or Mobile Number</label>
              <div style={styles.inputContainer}>
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                  placeholder="example@example.com"
                />
              </div>
            </div>
            
            {/* รหัสผ่าน */}
            <div style={styles.formGroup}>
              <label htmlFor="password" style={styles.label}>Password</label>
              <div style={styles.inputContainer}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  placeholder="••••••••••••"
                />
                <button 
                  type="button" 
                  onClick={togglePasswordVisibility}
                  style={styles.passwordToggle}
                >
                  {showPassword ? (
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  )}
                </button>
              </div>
              <Link href="/forgot-password" style={styles.forgotPassword}>
                Forget Password
              </Link>
            </div>
            
            {/* ปุ่มล็อกอิน */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={styles.loginButton}
            >
              {isSubmitting ? 'กำลังเข้าสู่ระบบ...' : 'Log In'}
            </button>
          </form>
          
          {/* หรือล็อกอินด้วย */}
          <div style={styles.signUpText}>or sign up with</div>
          
          {/* ปุ่ม Social login */}
          <div style={styles.socialContainer}>
            <button 
              type="button" 
              style={styles.socialButton}
              onClick={handleGoogleLogin}
            >
              <span style={styles.socialIcon}>G</span>
            </button>
          </div>
          
          {/* ลิงก์สมัครสมาชิก */}
          <div style={styles.signUpText}>
            Don&apos;t have an account? <Link href="/signup" style={styles.signUpLink}>Sign Up</Link>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title={errorModalData.title}
        message={errorModalData.message}
        actionText={errorModalData.actionText}
        actionLink={errorModalData.actionLink}
      />
    </>
  );
}