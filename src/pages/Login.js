









// pages/Login.js — all styles inline, no CSS file needed
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [tab, setTab]           = useState('user');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp]           = useState('');
  const [step, setStep]         = useState(1);
  const [adminId, setAdminId]   = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [error, setError]       = useState('');
  const [message, setMessage]   = useState('');
  const [loading, setLoading]   = useState(false);

  const resetState = () => {
    setError(''); setMessage('');
    setEmail(''); setPassword(''); setOtp(''); setStep(1);
    setAdminId(''); setAdminPass('');
  };

  const switchTab = (t) => { setTab(t); resetState(); };

  const handleUserLogin = async (e) => {
    e.preventDefault();
    setError(''); setMessage(''); setLoading(true);
    try {
      const res = await axios.post('https://secure-online-voting-system-backend-7.onrender.com/api/auth/login', { email, password });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await axios.post('https://secure-online-voting-system-backend-7.onrender.com/api/auth/verify-otp', { email, otp });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      navigate('/face-verify');
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed.');
    } finally { setLoading(false); }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await axios.post('https://secure-online-voting-system-backend-7.onrender.com/api/auth/admin-login', { adminId, adminPass });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', 'admin');
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid admin credentials.');
    } finally { setLoading(false); }
  };

  // ── Inline styles — scoped, won't affect other pages ─────────────────────
  const s = {
    page: {
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#eaf3fb',
      fontFamily: "'DM Sans', sans-serif",
      padding: '48px 17px',
      boxSizing: 'border-box',
    },
    card: {
      background: '#ffffff',
      borderRadius: '20px',
      padding: '44px 48px 52px',
      width: '100%',
      maxWidth: '470px',
      boxShadow: '0 4px 7px rgba(30,90,170,0.07), 0 12px 40px rgba(30,90,170,0.10)',
      textAlign: 'center',
    },
    heading: {
      fontFamily: "'Sora', sans-serif",
      fontSize: '1.75rem',
      fontWeight: 700,
      color: '#0d2b4e',
      letterSpacing: '-0.4px',
      marginBottom: '24px',
    },
    tabRow: {
      display: 'flex',
      marginBottom: '28px',
      borderRadius: '12px',
      overflow: 'hidden',
      border: '1.5px solid #dde8f2',
      background: '#f0f7fc',
    },
    tab: {
      flex: 1,
      padding: '11px 0',
      border: 'none',
      cursor: 'pointer',
      background: 'transparent',
      fontFamily: "'DM Sans', sans-serif",
      fontSize: '0.88rem',
      fontWeight: 500,
      color: '#7b87a2',
      transition: 'background 0.2s, color 0.2s',
    },
    tabActive: {
      background: 'linear-gradient(135deg, #2e7bcf 0%, #1a5aa8 100%)',
      color: '#ffffff',
      fontWeight: 700,
      fontFamily: "'Sora', sans-serif",
      fontSize: '0.85rem',
      letterSpacing: '0.2px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      textAlign: 'left',
    },
    input: {
      width: '100%',
      padding: '12px 17px',
      border: '1.5px solid #dde8f2',
      borderRadius: '10px',
      fontFamily: "'DM Sans', sans-serif",
      fontSize: '0.9rem',
      color: '#0d2b4e',
      background: '#f5f9fd',
      outline: 'none',
      boxSizing: 'border-box',
    },
    otpInput: {
      width: '100%',
      padding: '14px 17px',
      border: '1.5px solid #dde8f2',
      borderRadius: '10px',
      fontFamily: "'Sora', sans-serif",
      fontSize: '1.2rem',
      fontWeight: 700,
      color: '#1a5aa8',
      background: '#f5f9fd',
      outline: 'none',
      textAlign: 'center',
      letterSpacing: '7px',
      boxSizing: 'border-box',
    },
    btn: {
      marginTop: '4px',
      padding: '13px',
      background: 'linear-gradient(135deg, #2e7bcf 0%, #1a5aa8 100%)',
      color: '#ffffff',
      fontFamily: "'Sora', sans-serif",
      fontSize: '0.95rem',
      fontWeight: 700,
      letterSpacing: '0.2px',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      width: '100%',
      boxShadow: '0 4px 14px rgba(30,90,195,0.28)',
    },
    btnDisabled: {
      background: 'linear-gradient(135deg, #9ab5d4 0%, #7a9fc0 100%)',
      cursor: 'not-allowed',
      boxShadow: 'none',
    },
    error: {
      fontSize: '0.82rem',
      color: '#c0392b',
      background: '#fff0ef',
      border: '1px solid #f5c7c2',
      borderRadius: '8px',
      padding: '9px 13px',
      margin: 0,
      textAlign: 'center',
    },
    success: {
      fontSize: '0.82rem',
      color: '#1a7e3c',
      background: '#edfaf3',
      border: '1px solid #b2dfc5',
      borderRadius: '8px',
      padding: '9px 13px',
      margin: 0,
      textAlign: 'center',
    },
    small: {
      fontSize: '0.82rem',
      color: '#7b87a2',
      margin: 0,
      textAlign: 'center',
    },
    link: {
      color: '#2e7bcf',
      fontWeight: 700,
      cursor: 'pointer',
      textDecoration: 'underline',
      textUnderlineOffset: '2px',
    },
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h2 style={s.heading}>Secure Voting System</h2>

        {/* Tab switcher */}
        <div style={s.tabRow}>
          <button
            onClick={() => switchTab('user')}
            style={{ ...s.tab, ...(tab === 'user' ? s.tabActive : {}) }}
          >
            User Login
          </button>
          <button
            onClick={() => switchTab('admin')}
            style={{ ...s.tab, ...(tab === 'admin' ? s.tabActive : {}) }}
          >
            Admin Login
          </button>
        </div>

        {/* ── USER LOGIN ── */}
        {tab === 'user' && (
          <>
            {step === 1 && (
              <form onSubmit={handleUserLogin} style={s.form}>
                <input
                  type="email" placeholder="Email"
                  value={email} onChange={e => setEmail(e.target.value)}
                  required style={s.input}
                />
                <input
                  type="password" placeholder="Password"
                  value={password} onChange={e => setPassword(e.target.value)}
                  required style={s.input}
                />
                {error && <p style={s.error}>{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  style={{ ...s.btn, ...(loading ? s.btnDisabled : {}) }}
                >
                  {loading ? 'Sending OTP...' : 'Login'}
                </button>
                <p style={s.small}>
                  New user?{' '}
                  <span onClick={() => navigate('/signup')} style={s.link}>
                    Sign up here
                  </span>
                </p>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyOtp} style={s.form}>
                {message && <p style={s.success}>{message}</p>}
                <p style={s.small}>
                  OTP sent to <strong style={{ color: '#0d2b4e' }}>{email}</strong>
                </p>
                <input
                  type="text" placeholder="Enter 7-digit OTP"
                  value={otp} onChange={e => setOtp(e.target.value)}
                  maxLength={7} required style={s.otpInput}
                />
                {error && <p style={s.error}>{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  style={{ ...s.btn, ...(loading ? s.btnDisabled : {}) }}
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
                <p style={s.small}>
                  <span onClick={() => { setStep(1); setError(''); }} style={s.link}>
                    ← Back
                  </span>
                </p>
              </form>
            )}
          </>
        )}

        {/* ── ADMIN LOGIN ── */}
        {tab === 'admin' && (
          <form onSubmit={handleAdminLogin} style={s.form}>
            <p style={s.small}>Admin access only. No registration required.</p>
            <input
              type="text" placeholder="Admin ID"
              value={adminId} onChange={e => setAdminId(e.target.value)}
              required style={s.input}
            />
            <input
              type="password" placeholder="Admin Password"
              value={adminPass} onChange={e => setAdminPass(e.target.value)}
              required style={s.input}
            />
            {error && <p style={s.error}>{error}</p>}
            <button
              type="submit"
              disabled={loading}
              style={{ ...s.btn, ...(loading ? s.btnDisabled : {}) }}
            >
              {loading ? 'Logging in...' : 'Admin Login'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;