

// pages/Signup.js — all styles inline, no CSS file needed
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import WebcamCapture from '../components/WebcamCapture';
import { useFaceApi } from '../hooks/useFaceApi';

function Signup() {
  const navigate = useNavigate();
  const { modelsLoaded, modelError, captureDescriptor } = useFaceApi();

  const [formData, setFormData] = useState({
    name: '', voterId: '', email: '',
    password: '', state: '', city: ''
  });

  const [message, setMessage]           = useState('');
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);
  const [faceDescriptor, setFaceDescriptor] = useState(null);
  const [faceStatus, setFaceStatus]     = useState('');

  const validVoters = [
    { epic: 'ABC1234577', hasVoted: false },
    { epic: 'XYZ9877543', hasVoted: false },
    { epic: 'TNA5778901', hasVoted: false },
    { epic: 'MHB2345778', hasVoted: true  },
    { epic: 'KAR3457789', hasVoted: false },
    { epic: 'GJB4577890', hasVoted: false },
    { epic: 'RJA5778902', hasVoted: true  },
    { epic: 'UPB7789013', hasVoted: false },
    { epic: 'WBA7890124', hasVoted: false },
    { epic: 'DLX8901235', hasVoted: false },
    { epic: 'PBA9012347', hasVoted: true  },
    { epic: 'HRY0123457', hasVoted: false },
    { epic: 'MPZ1234578', hasVoted: false },
    { epic: 'APQ2345779', hasVoted: false },
    { epic: 'TGR3457780', hasVoted: true  },
    { epic: 'ODB4577891', hasVoted: false },
    { epic: 'JKH5778902', hasVoted: false },
    { epic: 'CHD7789013', hasVoted: false },
    { epic: 'SKM7890124', hasVoted: true  },
    { epic: 'NGA8901235', hasVoted: false },
    { epic: 'BHR9012347', hasVoted: false },
    { epic: 'ASM0123457', hasVoted: false },
    { epic: 'MNP1234579', hasVoted: false },
    { epic: 'PNB2345770', hasVoted: true  },
    { epic: 'ZKL3457781', hasVoted: false },
  ];

  const handleChange = (e) => {
    const value = e.target.name === 'voterId'
      ? e.target.value.toUpperCase()
      : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleFaceCapture = async (webcamRef) => {
    setFaceStatus('Detecting face...');
    setError('');
    try {
      const descriptor = await captureDescriptor(webcamRef);
      if (!descriptor) {
        setFaceStatus('');
        setError('No face detected. Please look at the camera and try again.');
        return;
      }
      setFaceDescriptor(Array.from(descriptor));
      setFaceStatus('✓ Face captured successfully!');
    } catch {
      setFaceStatus('');
      setError('Face capture failed. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMessage(''); setLoading(true);

    const formatRegex = /^[A-Z]{3}[0-9]{7}$/;
    if (!formatRegex.test(formData.voterId)) {
      setError('Voter ID must be 3 uppercase letters followed by 7 digits (e.g. ABC1234577).');
      setLoading(false); return;
    }

    const voter = validVoters.find(v => v.epic === formData.voterId);
    if (!voter) {
      setError('Not a registered voter. Please check your Voter ID.');
      setLoading(false); return;
    }

    if (voter.hasVoted) {
      setError('This voter has already voted and cannot register again.');
      setLoading(false); return;
    }

    if (!faceDescriptor) {
      setError('Please capture your face before signing up.');
      setLoading(false); return;
    }

    try {
      const res = await axios.post('https://secure-online-voting-system-backend-7.onrender.com/api/auth/signup', {
        ...formData, role: 'user', faceDescriptor
      });
      setMessage(res.data.message + ' Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Try again.');
    } finally { setLoading(false); }
  };

  // ── All styles inline — won't affect any other page ───────────────────────
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
      padding: '40px 48px 48px',
      width: '100%',
      maxWidth: '500px',
      boxShadow: '0 4px 7px rgba(30,90,170,0.07), 0 12px 40px rgba(30,90,170,0.10)',
      textAlign: 'center',
    },
    heading: {
      fontFamily: "'Sora', sans-serif",
      fontSize: '1.75rem',
      fontWeight: 700,
      color: '#0d2b4e',
      letterSpacing: '-0.4px',
      marginBottom: '7px',
    },
    sub: {
      fontSize: '0.85rem',
      color: '#7b87a2',
      marginBottom: '28px',
      fontWeight: 400,
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      textAlign: 'left',
    },
    row: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px',
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
    faceSection: {
      border: '1.5px dashed #b8d4ed',
      borderRadius: '12px',
      padding: '17px',
      background: '#f5f9fd',
    },
    faceLabel: {
      fontSize: '0.82rem',
      color: '#7b87a2',
      margin: '0 0 10px',
      textAlign: 'center',
      fontWeight: 500,
    },
    faceSuccess: {
      color: '#1a7e3c',
      fontSize: '0.82rem',
      textAlign: 'center',
      margin: '8px 0 0',
      fontWeight: 500,
    },
    faceError: {
      color: '#c0392b',
      fontSize: '0.82rem',
      textAlign: 'center',
      margin: '8px 0 0',
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
    btn: {
      marginTop: '4px',
      padding: '13px',
      background: 'linear-gradient(135deg, #2e7bcf 0%, #1a5aa8 100%)',
      color: '#ffffff',
      fontFamily: "'Sora', sans-serif",
      fontSize: '0.95rem',
      fontWeight: 700,
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      width: '100%',
      boxShadow: '0 4px 14px rgba(30,90,195,0.28)',
      letterSpacing: '0.2px',
    },
    btnDisabled: {
      background: 'linear-gradient(135deg, #9ab5d4 0%, #7a9fc0 100%)',
      cursor: 'not-allowed',
      boxShadow: 'none',
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

        <h2 style={s.heading}>Create Voter Account</h2>
        <p style={s.sub}>Register to participate in the election</p>

        <form onSubmit={handleSubmit} style={s.form}>

          <input
            name="name" placeholder="Full Name"
            value={formData.name} onChange={handleChange}
            required style={s.input}
          />
          <input
            name="voterId" placeholder="Voter ID (e.g. ABC1234577)"
            value={formData.voterId} onChange={handleChange}
            required maxLength={10} style={s.input}
          />
          <input
            name="email" type="email" placeholder="Email"
            value={formData.email} onChange={handleChange}
            required style={s.input}
          />
          <input
            name="password" type="password" placeholder="Password"
            value={formData.password} onChange={handleChange}
            required style={s.input}
          />

          {/* State & City side by side */}
          <div style={s.row}>
            <input
              name="state" placeholder="State"
              value={formData.state} onChange={handleChange}
              required style={s.input}
            />
            <input
              name="city" placeholder="City"
              value={formData.city} onChange={handleChange}
              required style={s.input}
            />
          </div>

          {/* Face capture section */}
          <div style={s.faceSection}>
            <p style={s.faceLabel}>
              {modelsLoaded
                ? 'Capture your face for identity verification'
                : 'Loading face recognition models...'}
            </p>
            {modelError && <p style={s.faceError}>{modelError}</p>}
            {modelsLoaded && (
              <WebcamCapture
                onCapture={handleFaceCapture}
                buttonLabel={faceDescriptor ? '↺ Re-capture Face' : 'Capture Face'}
              />
            )}
            {faceStatus && (
              <p style={faceDescriptor ? s.faceSuccess : s.faceError}>{faceStatus}</p>
            )}
          </div>

          {error   && <p style={s.error}>{error}</p>}
          {message && <p style={s.success}>{message}</p>}

          <button
            type="submit"
            disabled={loading || !modelsLoaded}
            style={{ ...s.btn, ...((loading || !modelsLoaded) ? s.btnDisabled : {}) }}
          >
            {loading ? 'Registering...' : 'Sign Up'}
          </button>

          <p style={s.small}>
            Already have an account?{' '}
            <span onClick={() => navigate('/login')} style={s.link}>Login here</span>
          </p>

        </form>
      </div>
    </div>
  );
}

export default Signup;