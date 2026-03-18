// components/WebcamCapture.js
import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';

function WebcamCapture({ onCapture, buttonLabel = 'Capture Face', disabled = false }) {
  // ── FIX: webcamRef.current will be the Webcam instance
  // react-webcam attaches the raw <video> at webcamRef.current.video
  const webcamRef = useRef(null);
  const [camError, setCamError] = useState('');
  const [capturing, setCapturing] = useState(false);
  const [captured, setCaptured] = useState(false);

  const handleCapture = useCallback(async () => {
    if (!webcamRef.current || capturing) return;

    // Confirm video element is accessible before passing ref up
    const video = webcamRef.current.video;
    if (!video || video.readyState !== 4) {
      alert('Camera is not ready yet. Please wait a moment and try again.');
      return;
    }

    setCapturing(true);
    // Pass the full webcamRef — parent (useFaceApi) accesses .current.video
    await onCapture(webcamRef);
    setCapturing(false);
    setCaptured(true);
    setTimeout(() => setCaptured(false), 2000);
  }, [onCapture, capturing]);

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'8px', margin:'10px 0' }}>
      {camError ? (
        <p style={{ color:'red', fontSize:'13px' }}>{camError}</p>
      ) : (
        <Webcam
          ref={webcamRef}
          audio={false}
          videoConstraints={{ width:320, height:240, facingMode:'user' }}
          onUserMediaError={(err) => {
            console.error('Camera error:', err);
            setCamError('Camera access denied. Please allow camera permissions and refresh.');
          }}
          style={{ borderRadius:'8px', border:'2px solid #ccc', width:'320px', height:'240px' }}
          mirrored={true}
        />
      )}
      <button
        type="button"
        onClick={handleCapture}
        disabled={disabled || !!camError || capturing}
        style={{
          padding:'8px 20px',
          backgroundColor: captured ? '#22c55e' : '#6366f1',
          color:'#fff', border:'none', borderRadius:'4px',
          cursor:'pointer', fontSize:'14px', width:'100%'
        }}
      >
        {capturing ? 'Processing...' : captured ? '✓ Captured!' : buttonLabel}
      </button>
    </div>
  );
}

export default WebcamCapture;