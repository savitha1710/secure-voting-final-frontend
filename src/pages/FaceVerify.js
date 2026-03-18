// // pages/FaceVerify.js
// // Face verification step — shown AFTER OTP success, BEFORE navigating to /vote
// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import WebcamCapture from '../components/WebcamCapture';
// import { useFaceApi } from '../hooks/useFaceApi';

// function FaceVerify() {
//   const navigate = useNavigate();
//   const { modelsLoaded, modelError, captureDescriptor, compareFaces } = useFaceApi();

//   const [status, setStatus] = useState(''); // feedback message
//   const [error, setError] = useState('');
//   const [verifying, setVerifying] = useState(false);
//   const [verified, setVerified] = useState(false);

//   const token = localStorage.getItem('token');
//   const authConfig = { headers: { Authorization: `Bearer ${token}` } };

//   // Called by WebcamCapture with video ref — runs full verify flow
//   const handleVerify = async (webcamRef) => {
//     setError('');
//     setStatus('Detecting face...');
//     setVerifying(true);

//     try {
//       // 1. Capture live face descriptor from webcam
//       const liveDescriptor = await captureDescriptor(webcamRef);

//       if (!liveDescriptor) {
//         setError('No face detected. Please look directly at the camera.');
//         setStatus('');
//         setVerifying(false);
//         return;
//       }

//       setStatus('Comparing with registered face...');

//       // 2. Fetch stored descriptor from backend for current user
//       const res = await axios.get('http://localhost:5000/api/auth/face-descriptor', authConfig);
//       const storedDescriptor = res.data.faceDescriptor;

//       if (!storedDescriptor) {
//         setError('No face data found for this account. Please re-register.');
//         setStatus('');
//         setVerifying(false);
//         return;
//       }

//       // 3. Compare live vs stored
//       const isMatch = compareFaces(storedDescriptor, liveDescriptor);

//       if (isMatch) {
//         setVerified(true);
//         setStatus('✓ Face verified! Redirecting to voting page...');
//         setTimeout(() => navigate('/vote'), 1500);
//       } else {
//         setError('Face does not match. Access denied.');
//         setStatus('');
//       }

//     } catch (err) {
//       console.error(err);
//       setError('Verification failed. Please try again.');
//       setStatus('');
//     } finally {
//       setVerifying(false);
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <h2>Face Verification</h2>
//       <p style={styles.sub}>Look at the camera to verify your identity before voting</p>

//       {modelError && <p style={styles.error}>{modelError}</p>}

//       {!modelsLoaded ? (
//         <p style={styles.loading}>Loading face recognition models...</p>
//       ) : (
//         <>
//           <WebcamCapture
//             onCapture={handleVerify}
//             buttonLabel={verifying ? 'Verifying...' : 'Verify My Face'}
//             disabled={verifying || verified}
//           />

//           {status && (
//             <p style={verified ? styles.success : styles.info}>{status}</p>
//           )}
//           {error && <p style={styles.error}>{error}</p>}
//         </>
//       )}

//       <p style={styles.small}>
//         <span onClick={() => { localStorage.clear(); navigate('/login'); }} style={styles.link}>
//           ← Back to Login
//         </span>
//       </p>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     maxWidth: '400px', margin: '60px auto', padding: '24px',
//     border: '1px solid #ccc', borderRadius: '8px',
//     textAlign: 'center', fontFamily: 'Arial, sans-serif'
//   },
//   sub: { fontSize: '13px', color: '#555', marginTop: 0 },
//   loading: { color: '#888', fontSize: '14px' },
//   success: { color: 'green', fontWeight: 'bold', fontSize: '14px' },
//   info: { color: '#3b82f6', fontSize: '14px' },
//   error: { color: 'red', fontSize: '14px' },
//   small: { fontSize: '13px', marginTop: '16px' },
//   link: { color: '#3b82f6', cursor: 'pointer', textDecoration: 'underline' }
// };

// export default FaceVerify;











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
      const res = await axios.get('http://localhost:5000/api/auth/face-descriptor', authConfig);
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
        setError(`Face does not match. Distance: ${distance} (must be below 0.45). Please try again in better lighting.`);
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
  container: { maxWidth:'400px', margin:'60px auto', padding:'24px', border:'1px solid #ccc', borderRadius:'8px', textAlign:'center', fontFamily:'Arial, sans-serif' },
  sub:      { fontSize:'13px', color:'#555', marginTop:0 },
  loading:  { color:'#888', fontSize:'14px' },
  success:  { color:'green', fontWeight:'bold', fontSize:'14px' },
  info:     { color:'#3b82f6', fontSize:'14px' },
  error:    { color:'red', fontSize:'14px' },
  small:    { fontSize:'13px', marginTop:'16px' },
  link:     { color:'#3b82f6', cursor:'pointer', textDecoration:'underline' }
};

export default FaceVerify;