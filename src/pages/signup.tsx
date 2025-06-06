import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { CSSProperties } from "react";

export default function SignUp() {
  const router = useRouter();
  const { signup, isAuthenticated, isLoading, loginWithGoogle } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [dayOfBirth, setDayOfBirth] = useState("");
  const [zodiacSign, setZodiacSign] = useState("");
  const [elementType, setElementType] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // สำหรับอัพโหลดรูปภาพ
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  // Days of the week options
  const daysOfWeek = [
    { value: "", label: "Select day of birth" },
    { value: "Monday", label: "Monday (วันจันทร์)" },
    { value: "Tuesday", label: "Tuesday (วันอังคาร)" },
    { value: "Wednesday", label: "Wednesday (วันพุธ)" },
    { value: "Thursday", label: "Thursday (วันพฤหัสบดี)" },
    { value: "Friday", label: "Friday (วันศุกร์)" },
    { value: "Saturday", label: "Saturday (วันเสาร์)" },
    { value: "Sunday", label: "Sunday (วันอาทิตย์)" },
  ];

  // Zodiac sign options
  const zodiacSigns = [
    { value: "", label: "Select zodiac sign" },
    { value: "Aries", label: "Aries (ราศีเมษ)" },
    { value: "Taurus", label: "Taurus (ราศีพฤษภ)" },
    { value: "Gemini", label: "Gemini (ราศีเมถุน)" },
    { value: "Cancer", label: "Cancer (ราศีกรกฎ)" },
    { value: "Leo", label: "Leo (ราศีสิงห์)" },
    { value: "Virgo", label: "Virgo (ราศีกันย์)" },
    { value: "Libra", label: "Libra (ราศีตุล)" },
    { value: "Scorpio", label: "Scorpio (ราศีพิจิก)" },
    { value: "Sagittarius", label: "Sagittarius (ราศีธนู)" },
    { value: "Capricorn", label: "Capricorn (ราศีมังกร)" },
    { value: "Aquarius", label: "Aquarius (ราศีกุมภ์)" },
    { value: "Pisces", label: "Pisces (ราศีมีน)" },
  ];

  // Element type options
  const elementTypes = [
    { value: "", label: "Select element type" },
    { value: "Fire", label: "Fire (ธาตุไฟ)" },
    { value: "Earth", label: "Earth (ธาตุดิน)" },
    { value: "Water", label: "Water (ธาตุน้ำ)" },
    { value: "Wind", label: "Wind (ธาตุลม)" },
  ];

  // Blood group options
  const bloodGroups = [
    { value: "", label: "Select blood group" },
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "AB", label: "AB" },
    { value: "O", label: "O" },
  ];

  // ฟังก์ชันสำหรับการเลือกรูปภาพ
  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const [isHovered, setIsHovered] = useState(false);
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBirthDate(e.target.value);
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fullName || !email || !phone || !birthDate) {
      setError("กรุณากรอกข้อมูลสำคัญให้ครบถ้วน");
      return;
    }

    if (!agreeToTerms) {
      setError("กรุณายอมรับข้อตกลงและเงื่อนไขการใช้งาน");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // ส่งข้อมูลให้กับ API ผ่าน AuthContext
      const userData = {
        fullName,
        email,
        phone,
        birthDate,
        dayOfBirth,
        elementType,
        zodiacSign,
        bloodGroup,
        avatar,
      };

      await signup(userData);
      router.push("/set-password");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // จัดการกับข้อผิดพลาด - ตรวจสอบว่าเป็น axios error และมี response หรือไม่
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("เกิดข้อผิดพลาดในการสมัครสมาชิก");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles: { [key: string]: CSSProperties } = {
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background: "#f3f4f6",
      padding: "16px",
    },
    card: {
      width: "100%",
      minHeight: "100vh",
      maxWidth: "100vh",
      borderRadius: "28px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      position: "relative",
      display: "flex",
      flexDirection: "column" as const,
      maxHeight: "90vh",
    },
    headerSection: {
      backgroundColor: "#ffffff",
      padding: "24px",
      paddingBottom: "30px",
      position: "relative",
      borderTopLeftRadius: "28px",
      borderTopRightRadius: "28px",
    },
    formSection: {
      backgroundColor: "#ffecf1",
      padding: "24px",
      paddingTop: "0",
      borderBottomLeftRadius: "28px",
      borderBottomRightRadius: "28px",
      display: "flex",
      flexDirection: "column" as const,
      overflowY: "auto" as const,
      position: "relative",
    },
    formContainer: {
      display: "flex",
      flexDirection: "column" as const,
    },
    formBottom: {
      paddingTop: "20px",
    },
    backButton: {
      display: "flex",
      alignItems: "center",
      color: "#f6802f",
      marginBottom: "16px",
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "4px",
    },
    backButtonText: {
      marginLeft: "8px",
      fontSize: "16px",
      color: "#f6802f",
    },
    backIcon: {
      width: "24px",
      height: "24px",
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#f6802f",
      textAlign: "center",
      margin: "0",
    },
    avatarContainer: {
      position: "absolute",
      width: "100px",
      height: "100px",
      right: "24px",
      top: "80px",
      zIndex: 2,
      cursor: "pointer",
    },
    avatarCircle: {
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      backgroundColor: "#dddddd",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    avatarImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    avatarIcon: {
      position: "absolute",
      right: "-5px",
      bottom: "-5px",
      backgroundColor: "#f6802f",
      borderRadius: "50%",
      width: "36px",
      height: "36px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: "20px",
      border: "2px solid white",
      cursor: "pointer",
    },
    fileInput: {
      display: "none",
    },
    formGroup: {
      marginBottom: "16px",
    },
    label: {
      display: "block",
      fontSize: "16px",
      fontWeight: "500",
      color: "#f6802f",
      marginBottom: "8px",
    },
    input: {
      width: "100%",
      padding: "14px 20px",
      borderRadius: "9999px",
      border: "1px solid #e5e7eb",
      backgroundColor: "white",
      fontSize: "16px",
      color: "#f6802f",
      outline: "none",
    },
    select: {
      width: "100%",
      padding: "14px 20px",
      borderRadius: "9999px",
      border: "1px solid #e5e7eb",
      backgroundColor: "white",
      fontSize: "16px",
      color: "#f6802f",
      outline: "none",
      appearance: "none",
      backgroundImage:
        "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23f6802f' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 1rem center",
      backgroundSize: "1em",
    },
    dateInput: {
      width: "100%",
      padding: "14px 20px",
      borderRadius: "9999px",
      border: "1px solid #e5e7eb",
      backgroundColor: "white",
      fontSize: "16px",
      color: "#f6802f",
      outline: "none",
      appearance: "auto",
    },
    checkboxContainer: {
      display: "flex",
      alignItems: "flex-start",
      marginTop: "5px",
    },
    checkbox: {
      marginRight: "10px",
      marginTop: "3px",
      accentColor: "#f6802f",
    },
    termsContainer: {
      fontSize: "12px",
      color: "#f6802f",
      lineHeight: "1.5",
    },
    termsLink: {
      textDecoration: "underline",
      color: "#f6802f",
    },
    divider: {
      height: "1px",
      backgroundColor: "#f6802f",
      opacity: 0.3,
      margin: "16px 0",
    },
    signUpButton: {
      width: "100%",
      padding: "14px",
      borderRadius: "9999px",
      backgroundColor: isHovered ? "#FF7A05" : "#FF8CB7",
      color: "white",
      border: "none",
      fontSize: "18px",
      fontWeight: "500",
      cursor: "pointer",
      marginTop: "24px",
      marginBottom: "16px",
    },

    orSignUpWith: {
      textAlign: "center",
      color: "#9ca3af",
      fontSize: "14px",
      margin: "16px 0",
    },
    socialContainer: {
      display: "flex",
      justifyContent: "center",
      gap: "16px",
      margin: "16px 0",
    },
    socialButton: {
      width: "48px",
      height: "48px",
      borderRadius: "50%",
      backgroundColor: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      border: "1px solid #f6f6f6",
    },
    socialIcon: {
      color: "#f6802f",
      fontSize: "24px",
      fontWeight: "bold",
    },
    loginText: {
      textAlign: "center",
      fontSize: "14px",
      color: "#ee5f9b",
      marginTop: "16px",
    },
    loginLink: {
      color: "#ee5f9b",
      fontWeight: "500",
    },
    errorContainer: {
      backgroundColor: "#fee2e2",
      borderColor: "#f87171",
      color: "#b91c1c",
      padding: "12px",
      borderRadius: "8px",
      marginBottom: "16px",
    },
  };

  return (
    <>
      <Head>
        <title>Sign Up - Nummu App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.headerSection}>
            <Link href="/" style={styles.backButton}>
              <svg
                style={styles.backIcon}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <h1 style={styles.title}>New Account</h1>
          </div>

          {/* อวาตาร์ที่ทับซ้อนระหว่างสองส่วน */}
          <div style={styles.avatarContainer} onClick={handleAvatarClick}>
            <div style={styles.avatarCircle}>
              {avatar ? (
                <img src={avatar} alt="Profile" style={styles.avatarImage} />
              ) : (
                <svg width="40" height="40" fill="#aaaaaa" viewBox="0 0 16 16">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                  <path d="M8 9a5 5 0 0 0-5 5c0 1 1 1 1 1h8s1 0 1-1a5 5 0 0 0-5-5z" />
                </svg>
              )}
            </div>
            <div style={styles.avatarIcon}>
              <svg
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.5l-1.5-1.5h-5L3.5 4H2zm11 5.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z" />
              </svg>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={styles.fileInput}
            />
          </div>

          {/* ส่วนฟอร์ม (สีชมพู) */}
          <div style={styles.formSection}>
            {error && <div style={styles.errorContainer}>{error}</div>}

            <form onSubmit={handleSubmit}>
              {/* Full name - Input */}
              <div style={styles.formGroup}>
                <label htmlFor="fullName" style={styles.label}>
                  Full name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={styles.input}
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email - Input */}
              <div style={styles.formGroup}>
                <label htmlFor="email" style={styles.label}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                  placeholder="example@example.com"
                />
              </div>

              {/* Phone - Input */}
              <div style={styles.formGroup}>
                <label htmlFor="phone" style={styles.label}>
                  Mobile Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={styles.input}
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Birth date - Date picker */}
              <div style={styles.formGroup}>
                <label htmlFor="birthDate" style={styles.label}>
                  Date Of Birth
                </label>
                <input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={handleDateChange}
                  style={styles.dateInput}
                />
              </div>

              {/* Day of birth - Dropdown */}
              <div style={styles.formGroup}>
                <label htmlFor="dayOfBirth" style={styles.label}>
                  Your Day of birth
                </label>
                <select
                  id="dayOfBirth"
                  value={dayOfBirth}
                  onChange={(e) => setDayOfBirth(e.target.value)}
                  style={styles.select}
                >
                  {daysOfWeek.map((day) => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Zodiac sign - Dropdown */}
              <div style={styles.formGroup}>
                <label htmlFor="zodiacSign" style={styles.label}>
                  Your zodiac sign Type
                </label>
                <select
                  id="zodiacSign"
                  value={zodiacSign}
                  onChange={(e) => setZodiacSign(e.target.value)}
                  style={styles.select}
                >
                  {zodiacSigns.map((sign) => (
                    <option key={sign.value} value={sign.value}>
                      {sign.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Element type - Dropdown */}
              <div style={styles.formGroup}>
                <label htmlFor="elementType" style={styles.label}>
                  Your Element Type
                </label>
                <select
                  id="elementType"
                  value={elementType}
                  onChange={(e) => setElementType(e.target.value)}
                  style={styles.select}
                >
                  {elementTypes.map((element) => (
                    <option key={element.value} value={element.value}>
                      {element.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Blood group - Dropdown */}
              <div style={styles.formGroup}>
                <label htmlFor="bloodGroup" style={styles.label}>
                  Blood group Type
                </label>
                <select
                  id="bloodGroup"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  style={styles.select}
                >
                  {bloodGroups.map((group) => (
                    <option key={group.value} value={group.value}>
                      {group.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Terms agreement */}
              <div style={styles.formGroup}>
                <div style={styles.checkboxContainer}>
                  <input
                    id="agreeToTerms"
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    style={styles.checkbox}
                  />
                  <label htmlFor="agreeToTerms" style={styles.termsContainer}>
                    By continuing, you agree to Terms of Use and Privacy Policy
                  </label>
                </div>
              </div>

              <div style={styles.divider}></div>

              {/* Sign up button */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={styles.signUpButton}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {isSubmitting ? "กำลังสมัครสมาชิก..." : "Sign Up"}
              </button>

              {/* or sign up with */}
              <div style={styles.orSignUpWith}>or sign in with</div>

              {/* Social login buttons */}
              <div style={styles.socialContainer}>
                <button
                  type="button"
                  style={styles.socialButton}
                  onClick={handleGoogleLogin}
                >
                  <span style={styles.socialIcon}>G</span>
                </button>
                <button type="button" style={styles.socialButton}>
                  <span style={styles.socialIcon}>f</span>
                </button>
              </div>

              {/* Login link */}
              <div style={styles.loginText}>
                already have an account?{" "}
                <Link href="/login" style={styles.loginLink}>
                  Log In
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
