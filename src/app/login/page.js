'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaPhone, 
  FaKey, 
  FaUtensils, 
  FaArrowRight,
  FaSpinner,
  FaCheck
} from 'react-icons/fa';

const Login = () => {
  const router = useRouter();
  const [loginType, setLoginType] = useState('owner'); // 'owner' or 'staff'
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [staffCredentials, setStaffCredentials] = useState({ loginId: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    
    try {
      // Call backend API to send OTP
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
        setStep('otp');
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!otp || otp.length !== 4) {
      setError('Please enter a valid 4-digit OTP');
      return;
    }

    setLoading(true);
    
    try {
      // Call backend API to verify OTP
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
        
        // Redirect based on backend response - new/existing owner goes to admin
        if (data.redirectTo) {
          router.push(data.redirectTo);
        } else {
          router.push('/admin'); // Default for owners
        }
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (error) {
      setError('Network error. Please try again.');
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
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setOtp(value);
  };

  const handleStaffLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!staffCredentials.loginId || !staffCredentials.password) {
      setError('Please enter both login ID and password');
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
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Staff goes to main POS page
        router.push('/');
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
                  We have sent a 4-digit code to +91 {phoneNumber}
                </p>
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
                    placeholder="1234"
                    maxLength="4"
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
                    <div style={{
                      fontSize: "12px",
                      color: "#6b7280"
                    }}>
                      For testing use: <strong style={{ color: "#e53e3e" }}>1234 </strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep("phone")}
                      style={{
                        fontSize: "12px",
                        color: "#e53e3e",
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "600",
                        textDecoration: "underline"
                      }}
                    >
                      Change Number
                    </button>
                  </div>
                </div>
  
  
                <button
                  type="submit"
                  disabled={loading || otp.length !== 4}
                  style={{
                    width: "100%",
                    background: otp.length === 4 && !loading
                      ? "linear-gradient(135deg, #10b981, #059669)"
                      : "#d1d5db",
                    color: "white",
                    padding: "16px",
                    borderRadius: "12px",
                    fontWeight: "700",
                    fontSize: "16px",
                    border: "none",
                    cursor: otp.length === 4 && !loading ? "pointer" : "not-allowed",
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
                    Login ID (Email)
                  </label>
                  <input
                    type="email"
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
                    placeholder="your.email@restaurant.com"
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
    </div>
  );  
};

export default Login;