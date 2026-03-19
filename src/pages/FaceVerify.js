










// pages/FaceVerify.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import WebcamCapture from '../components/WebcamCapture';
import { useFaceApi } from '../hooks/useFaceApi';

function FaceVerify() {
  const navigate = useNavigate();
  const { modelsLoaded, modelError, captureDescriptor, compareFaces } = useFaceApi();

  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const token = localStorage.getItem('token');
  const authConfig = { headers: { Authorization: `Bearer ${token}` } };

  const handleVerify = async (webcamRef) => {
    setError('');
    setStatus('Detecting your face...');
    setVerifying(true);

    try {
      // Step 1: capture live descriptor
      const liveDescriptor = await captureDescriptor(webcamRef);
      if (!liveDescriptor) {
        setError('No face detected. Look directly at the camera in good lighting.');
        setStatus('');
        setVerifying(false);
        return;
      }

      setStatus('Comparing with registered face...');

      // Step 2: fetch stored descriptor from backend
      const res = await axios.get('https://secure-online-voting-system-backend-7.onrender.com/api/auth/face-descriptor', authConfig);
      const storedDescriptor = res.data.faceDescriptor;

      if (!storedDescriptor) {
        setError('No face data found for this account. Please re-register.');
        setStatus('');
        setVerifying(false);
        return;
      }

      // Step 3: compare — now returns { match, distance }
      const { match, distance } = compareFaces(storedDescriptor, liveDescriptor);
      console.log(`Match: ${match} | Distance: ${distance}`);

      if (match) {
        setVerified(true);
        setStatus(`✓ Face verified! (confidence: ${distance}) Redirecting...`);
        setTimeout(() => navigate('/vote'), 1500);
      } else {
        // Clear failure message with distance shown for transparency
        setError(`Face does not match. Distance: ${distance} (must be below 0.75). Please try again in better lighting.`);
        setStatus('');
      }

    } catch (err) {
      console.error(err);
      setError('Verification failed. Please try again.');
      setStatus('');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Face Verification</h2>
      <p style={styles.sub}>Look at the camera to verify your identity before voting</p>

      {modelError && <p style={styles.error}>{modelError}</p>}

      {!modelsLoaded ? (
        <p style={styles.loading}>Loading face recognition models...</p>
      ) : (
        <>
          <WebcamCapture
            onCapture={handleVerify}
            buttonLabel={verifying ? 'Verifying...' : 'Verify My Face'}
            disabled={verifying || verified}
          />
          {status && <p style={verified ? styles.success : styles.info}>{status}</p>}
          {error  && <p style={styles.error}>{error}</p>}
        </>
      )}

      <p style={styles.small}>
        <span onClick={() => { localStorage.clear(); navigate('/login'); }} style={styles.link}>
          ← Back to Login
        </span>
      </p>
    </div>
  );
}

const styles = {
  container: { maxWidth:'700px', margin:'70px auto', padding:'27px', border:'1px solid #ccc', borderRadius:'8px', textAlign:'center', fontFamily:'Arial, sans-serif' },
  sub:      { fontSize:'13px', color:'#555', marginTop:0 },
  loading:  { color:'#888', fontSize:'17px' },
  success:  { color:'green', fontWeight:'bold', fontSize:'17px' },
  info:     { color:'#3b82f7', fontSize:'17px' },
  error:    { color:'red', fontSize:'17px' },
  small:    { fontSize:'13px', marginTop:'17px' },
  link:     { color:'#3b82f7', cursor:'pointer', textDecoration:'underline' }
};

export default FaceVerify;