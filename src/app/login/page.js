'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaPhone, 
  FaKey, 
  FaUtensils, 
  FaArrowRight,
  FaSpinner,
  FaCheck,
  FaEdit,
  FaTimes
} from 'react-icons/fa';
import { auth } from '../../../firebase';
import { 
  signInWithPhoneNumber,
  RecaptchaVerifier,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

const Login = () => {
  const router = useRouter();
  const [loginType, setLoginType] = useState('owner'); // 'owner' or 'staff'
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [staffCredentials, setStaffCredentials] = useState({ loginId: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Firebase OTP state
  const [verificationId, setVerificationId] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [isFirebaseOTP, setIsFirebaseOTP] = useState(false);

  // Setup Firebase reCAPTCHA
  useEffect(() => {
    if (step === 'phone') {
      setupRecaptcha();
    }
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, [step]);

  const setupRecaptcha = () => {
    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {},
          'expired-callback': () => {
            setError('reCAPTCHA expired. Please try again.');
          }
        });
      }
    } catch (error) {
      console.error("Error setting up RecaptchaVerifier:", error);
      setError("Failed to setup verification. Please refresh the page.");
    }
  };

  // Check if phone number is dummy account
  const isDummyAccount = (phone) => {
    return phone === '9000000000' || phone === '+919000000000';
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    
    try {
      // Check if it's dummy account
      if (isDummyAccount(phoneNumber)) {
        // Use backend OTP for dummy account
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://dine-backend-lake.vercel.app';
        const response = await fetch(`${backendUrl}/api/auth/phone/send-otp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phone: `+91${phoneNumber}` }),
        });

        const data = await response.json();
        
        if (response.ok) {
          setIsFirebaseOTP(false);
          setStep('otp');
        } else {
          setError(data.message || 'Failed to send OTP');
        }
      } else {
        // Use Firebase OTP for real numbers
        const formattedPhone = phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber}`;
        
        const appVerifier = window.recaptchaVerifier;
        const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
        
        setVerificationId(confirmationResult);
        setIsFirebaseOTP(true);
        setOtpSent(true);
        setStep('otp');
        setError('');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError('Failed to send OTP. Please check your phone number and try again.');
      
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.render().then(widgetId => {
          window.grecaptcha.reset(widgetId);
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!otp || (isFirebaseOTP ? otp.length !== 6 : otp.length !== 4)) {
      setError(`Please enter a valid ${isFirebaseOTP ? '6' : '4'}-digit OTP`);
      return;
    }

    setLoading(true);
    
    try {
      if (isFirebaseOTP) {
        // Verify Firebase OTP
        const result = await verificationId.confirm(otp);
        
        // Call backend to get JWT token
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://dine-backend-lake.vercel.app';
        const firebaseResponse = await fetch(`${backendUrl}/api/auth/firebase/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: result.user.uid,
            phoneNumber: result.user.phoneNumber,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL
          }),
        });

        const firebaseData = await firebaseResponse.json();
        
        if (firebaseResponse.ok) {
          // Store auth token and user data
          localStorage.setItem('authToken', firebaseData.token);
          localStorage.setItem('user', JSON.stringify(firebaseData.user));
          
          // Redirect based on backend response
          if (firebaseData.redirectTo) {
            router.push(firebaseData.redirectTo);
          } else {
            router.push('/dashboard');
          }
        } else {
          setError(firebaseData.message || 'Failed to verify with backend');
        }
      } else {
        // Verify backend OTP (for dummy account)
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
        const response = await fetch(`${backendUrl}/api/auth/phone/verify-otp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phone: `+91${phoneNumber}`, otp }),
        });

        const data = await response.json();
        
        if (response.ok) {
          // Store auth token in localStorage
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          // Redirect based on backend response
          if (data.redirectTo) {
            router.push(data.redirectTo);
          } else {
            router.push('/dashboard');
          }
        } else {
          setError(data.message || 'Invalid OTP');
        }
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const numbers = value.replace(/\D/g, '');
    // Limit to 10 digits
    return numbers.slice(0, 10);
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const handleOtpChange = (e) => {
    const maxLength = isFirebaseOTP ? 6 : 4;
    const value = e.target.value.replace(/\D/g, '').slice(0, maxLength);
    setOtp(value);
  };

  const resetOtpState = () => {
    setOtp('');
    setOtpSent(false);
    setVerificationId(null);
    setIsFirebaseOTP(false);
    setStep('phone');
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Call backend to get JWT token
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://dine-backend-lake.vercel.app';
      const googleResponse = await fetch(`${backendUrl}/api/auth/firebase/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: result.user.uid,
          phoneNumber: result.user.phoneNumber,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL
        }),
      });

      const googleData = await googleResponse.json();
      
      if (googleResponse.ok) {
        // Store auth token and user data
        localStorage.setItem('authToken', googleData.token);
        localStorage.setItem('user', JSON.stringify(googleData.user));
        
        // Redirect based on backend response
        if (googleData.redirectTo) {
          router.push(googleData.redirectTo);
        } else {
          router.push('/dashboard');
        }
      } else {
        setError(googleData.message || 'Google login failed');
      }

    } catch (error) {
      console.error('Google login error:', error);
      setError('Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStaffLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!staffCredentials.loginId || !staffCredentials.password) {
      setError('Please enter both User ID and password');
      return;
    }

    setLoading(true);
    
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
      const response = await fetch(`${backendUrl}/api/auth/staff/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loginId: staffCredentials.loginId,
          password: staffCredentials.password
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        
        // Store user data with restaurant and owner info
        const userData = {
          ...data.user,
          restaurant: data.restaurant,
          owner: data.owner
        };
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Staff goes to main POS page
        router.push('/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#fef7f0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        backgroundColor: "white",
        borderRadius: "24px",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
        width: "100%",
        maxWidth: "440px",
        overflow: "hidden",
        border: "1px solid #fed7aa"
      }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #e53e3e, #dc2626)",
          padding: "32px 24px",
          textAlign: "center",
          color: "white"
        }}>
          <div style={{
            width: "80px",
            height: "80px",
            backgroundColor: "rgba(255,255,255,0.2)",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            backdropFilter: "blur(10px)"
          }}>
            <FaUtensils size={36} />
          </div>
          <h1 style={{
            fontSize: "28px",
            fontWeight: "bold",
            margin: "0 0 8px 0"
          }}>
            Dine POS
          </h1>
          <p style={{
            fontSize: "16px",
            opacity: 0.9,
            margin: 0
          }}>
            Restaurant Management System
          </p>
        </div>

        {/* Login Type Tabs */}
        <div style={{ display: 'flex', borderBottom: '2px solid #f1f5f9' }}>
          <button
            onClick={() => {
              setLoginType('owner');
              setStep('phone');
              setError('');
            }}
            style={{
              flex: 1,
              padding: '16px',
              fontSize: '16px',
              fontWeight: '600',
              border: 'none',
              backgroundColor: loginType === 'owner' ? '#e53e3e' : 'transparent',
              color: loginType === 'owner' ? 'white' : '#64748b',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Restaurant Owner
          </button>
          <button
            onClick={() => {
              setLoginType('staff');
              setStep('staff-login');
              setError('');
            }}
            style={{
              flex: 1,
              padding: '16px',
              fontSize: '16px',
              fontWeight: '600',
              border: 'none',
              backgroundColor: loginType === 'staff' ? '#e53e3e' : 'transparent',
              color: loginType === 'staff' ? 'white' : '#64748b',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Staff Member
          </button>
        </div>
  
        {/* Login Form */}
        <div style={{ padding: "32px 24px" }}>
          {error && (
            <div style={{
              backgroundColor: "#fee2e2",
              color: "#dc2626",
              padding: "12px 16px",
              borderRadius: "12px",
              marginBottom: "20px",
              fontSize: "14px",
              fontWeight: "500"
            }}>
              {error}
            </div>
          )}

          {loginType === 'owner' && step === "phone" ? (
            <>
              <div style={{ textAlign: "center", marginBottom: "32px" }}>
                <div style={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: "#fef7f0",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  border: "2px solid #fed7aa"
                }}>
                  <FaPhone size={24} style={{ color: "#e53e3e" }} />
                </div>
                <h2 style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#1f2937",
                  margin: "0 0 8px 0"
                }}>
                  Phone Login
                </h2>
                <p style={{
                  color: "#6b7280",
                  margin: 0,
                  fontSize: "14px"
                }}>
                  Enter your phone number to receive an OTP
                </p>
              </div>
  
              <form onSubmit={handlePhoneSubmit}>
                <div style={{ marginBottom: "24px" }}>
                  <label style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "8px"
                  }}>
                    Phone Number
                  </label>
                  <div style={{ position: "relative" }}>
                    <div style={{
                      position: "absolute",
                      left: "16px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#6b7280",
                      fontSize: "14px",
                      fontWeight: "500"
                    }}>
                      🇮🇳 +91
                    </div>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      placeholder="Enter 10-digit number"
                      style={{
                        width: "100%",
                        paddingLeft: "80px",
                        paddingRight: "16px",
                        paddingTop: "16px",
                        paddingBottom: "16px",
                        border: "2px solid #e5e7eb",
                        borderRadius: "12px",
                        fontSize: "16px",
                        outline: "none",
                        backgroundColor: "#fef7f0",
                        transition: "all 0.2s",
                        letterSpacing: "1px"
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#e53e3e";
                        e.target.style.backgroundColor = "white";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e5e7eb";
                        e.target.style.backgroundColor = "#fef7f0";
                      }}
                    />
                  </div>
                  {phoneNumber && phoneNumber.length === 10 && (
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      marginTop: "8px",
                      color: "#10b981",
                      fontSize: "12px",
                      fontWeight: "500"
                    }}>
                      <FaCheck size={10} />
                      Valid phone number
                    </div>
                  )}
                </div>
  
  
                <button
                  type="submit"
                  disabled={loading || phoneNumber.length !== 10}
                  style={{
                    width: "100%",
                    background: phoneNumber.length === 10 && !loading
                      ? "linear-gradient(135deg, #e53e3e, #dc2626)"
                      : "#d1d5db",
                    color: "white",
                    padding: "16px",
                    borderRadius: "12px",
                    fontWeight: "700",
                    fontSize: "16px",
                    border: "none",
                    cursor: phoneNumber.length === 10 && !loading ? "pointer" : "not-allowed",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px"
                  }}
                >
                  {loading ? (
                    <FaSpinner className="animate-spin" size={16} />
                  ) : (
                    <FaArrowRight size={16} />
                  )}
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>

              {/* Google Login Button */}
              <div style={{ marginTop: '24px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
                  <span style={{
                    padding: '0 16px',
                    fontSize: '14px',
                    color: '#6b7280',
                    backgroundColor: 'white'
                  }}>
                    Or continue with
                  </span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: 'white',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#374151',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    transition: 'all 0.2s',
                    opacity: loading ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.backgroundColor = '#f9fafb';
                      e.target.style.borderColor = '#d1d5db';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.borderColor = '#e5e7eb';
                    }
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
              </div>
            </>
          ) : loginType === 'owner' && step === 'otp' ? (
            <>
              <div style={{ textAlign: "center", marginBottom: "32px" }}>
                <div style={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: "#fef7f0",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  border: "2px solid #fed7aa"
                }}>
                  <FaKey size={24} style={{ color: "#e53e3e" }} />
                </div>
                <h2 style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#1f2937",
                  margin: "0 0 8px 0"
                }}>
                  Enter OTP
                </h2>
                <p style={{
                  color: "#6b7280",
                  margin: 0,
                  fontSize: "14px"
                }}>
                  We have sent a {isFirebaseOTP ? '6' : '4'}-digit code to +91 {phoneNumber}
                </p>
              </div>

              {/* Phone number display with edit option */}
              <div style={{ 
                marginBottom: "24px", 
                padding: "12px", 
                backgroundColor: "#f9fafb", 
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <FaPhone style={{ color: "#6b7280" }} />
                  <span style={{ fontWeight: "500", color: "#374151" }}>+91 {phoneNumber}</span>
                </div>
                <button
                  type="button"
                  onClick={resetOtpState}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#3b82f6",
                    cursor: "pointer",
                    padding: "4px",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <FaEdit size={14} />
                  <span style={{ fontSize: "12px" }}>Edit</span>
                </button>
              </div>
  
              <form onSubmit={handleOtpSubmit}>
                <div style={{ marginBottom: "24px" }}>
                  <label style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "8px"
                  }}>
                    OTP Code
                  </label>
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={handleOtpChange}
                    placeholder={isFirebaseOTP ? "123456" : "1234"}
                    maxLength={isFirebaseOTP ? 6 : 4}
                    style={{
                      width: "100%",
                      padding: "16px",
                      border: "2px solid #e5e7eb",
                      borderRadius: "12px",
                      fontSize: "24px",
                      outline: "none",
                      backgroundColor: "#fef7f0",
                      transition: "all 0.2s",
                      letterSpacing: "8px",
                      textAlign: "center",
                      fontWeight: "bold"
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#e53e3e";
                      e.target.style.backgroundColor = "white";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e5e7eb";
                      e.target.style.backgroundColor = "#fef7f0";
                    }}
                  />
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "12px"
                  }}>
                    {!isFirebaseOTP && (
                      <div style={{
                        fontSize: "12px",
                        color: "#6b7280"
                      }}>
                        For testing use: <strong style={{ color: "#e53e3e" }}>1234 </strong>
                      </div>
                    )}
                  </div>
                </div>
  
  
                <button
                  type="submit"
                  disabled={loading || (isFirebaseOTP ? otp.length !== 6 : otp.length !== 4)}
                  style={{
                    width: "100%",
                    background: ((isFirebaseOTP ? otp.length === 6 : otp.length === 4) && !loading)
                      ? "linear-gradient(135deg, #10b981, #059669)"
                      : "#d1d5db",
                    color: "white",
                    padding: "16px",
                    borderRadius: "12px",
                    fontWeight: "700",
                    fontSize: "16px",
                    border: "none",
                    cursor: ((isFirebaseOTP ? otp.length === 6 : otp.length === 4) && !loading) ? "pointer" : "not-allowed",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px"
                  }}
                >
                  {loading ? (
                    <FaSpinner className="animate-spin" size={16} />
                  ) : (
                    <FaCheck size={16} />
                  )}
                  {loading ? "Verifying..." : "Verify and Login"}
                </button>
              </form>
            </>
          ) : loginType === 'staff' && step === 'staff-login' ? (
            <>
              <div style={{ textAlign: "center", marginBottom: "32px" }}>
                <div style={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: "#fef7f0",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  border: "2px solid #fed7aa"
                }}>
                  <FaKey size={24} style={{ color: "#e53e3e" }} />
                </div>
                <h2 style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#1f2937",
                  margin: "0 0 8px 0"
                }}>
                  Staff Login
                </h2>
                <p style={{
                  color: "#6b7280",
                  margin: 0,
                  fontSize: "14px"
                }}>
                  Enter your login credentials provided by your manager
                </p>
              </div>

              <form onSubmit={handleStaffLogin}>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "8px"
                  }}>
                    User ID
                  </label>
                  <input
                    type="text"
                    value={staffCredentials.loginId}
                    onChange={(e) => setStaffCredentials({
                      ...staffCredentials,
                      loginId: e.target.value
                    })}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      border: "2px solid #e5e7eb",
                      borderRadius: "12px",
                      fontSize: "16px",
                      outline: "none",
                      backgroundColor: "#fef7f0",
                      transition: "all 0.2s",
                      boxSizing: "border-box"
                    }}
                    placeholder="12345"
                    required
                  />
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <label style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "8px"
                  }}>
                    Password
                  </label>
                  <input
                    type="password"
                    value={staffCredentials.password}
                    onChange={(e) => setStaffCredentials({
                      ...staffCredentials,
                      password: e.target.value
                    })}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      border: "2px solid #e5e7eb",
                      borderRadius: "12px",
                      fontSize: "16px",
                      outline: "none",
                      backgroundColor: "#fef7f0",
                      transition: "all 0.2s",
                      boxSizing: "border-box"
                    }}
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !staffCredentials.loginId || !staffCredentials.password}
                  style={{
                    width: "100%",
                    background: !loading && staffCredentials.loginId && staffCredentials.password
                      ? "linear-gradient(135deg, #10b981, #059669)"
                      : "#d1d5db",
                    color: "white",
                    padding: "16px",
                    borderRadius: "12px",
                    fontWeight: "700",
                    fontSize: "16px",
                    border: "none",
                    cursor: !loading && staffCredentials.loginId && staffCredentials.password ? "pointer" : "not-allowed",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px"
                  }}
                >
                  {loading ? (
                    <FaSpinner className="animate-spin" size={16} />
                  ) : (
                    <FaArrowRight size={16} />
                  )}
                  {loading ? "Logging in..." : "Login to POS"}
                </button>
              </form>
            </>
          ) : null}
        </div>
  
        {/* Footer */}
        <div style={{
          padding: "20px 24px",
          backgroundColor: "#fef7f0",
          borderTop: "1px solid #fed7aa",
          textAlign: "center"
        }}>
          <p style={{
            fontSize: "12px",
            color: "#6b7280",
            margin: 0
          }}>
            Secure login powered by OTP verification
          </p>
        </div>
      </div>
      
      {/* Hidden reCAPTCHA container */}
      <div id="recaptcha-container" style={{ display: 'none' }}></div>
    </div>
  );  
};

export default Login;