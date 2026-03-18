// // hooks/useFaceApi.js
// import { useEffect, useState } from 'react';
// import * as faceapi from 'face-api.js';

// const MODEL_URL = process.env.PUBLIC_URL + '/models';

// export function useFaceApi() {
//   const [modelsLoaded, setModelsLoaded] = useState(false);
//   const [modelError, setModelError] = useState('');

//   useEffect(() => {
//     const loadModels = async () => {
//       try {
//         await Promise.all([
//           faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
//           faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
//           faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
//         ]);
//         setModelsLoaded(true);
//       } catch (err) {
//         console.error('Model load error:', err);
//         setModelError('Failed to load face models. Make sure /public/models/ files exist.');
//       }
//     };
//     loadModels();
//   }, []);

//   const captureDescriptor = async (webcamRef) => {
//     // ── FIX: correctly extract the raw <video> element from react-webcam ──
//     // webcamRef.current is the Webcam component instance
//     // webcamRef.current.video is the actual HTMLVideoElement face-api needs
//     const video = webcamRef?.current?.video;

//     if (!video) {
//       console.error('No video element found on ref');
//       return null;
//     }

//     // Wait until video is actually playing and has dimensions
//     if (video.readyState !== 4) {
//       console.error('Video not ready yet, readyState:', video.readyState);
//       return null;
//     }

//     console.log('Video element:', video); // confirm it's HTMLVideoElement
//     console.log('Video dimensions:', video.videoWidth, video.videoHeight);

//     const detection = await faceapi
//       .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
//       .withFaceLandmarks()
//       .withFaceDescriptor();

//     if (!detection) {
//       console.log('No face detected in frame');
//       return null;
//     }

//     return detection.descriptor; // Float32Array of 128 values
//   };

//   const compareFaces = (stored, live, threshold = 0.5) => {
//     const d1 = new Float32Array(Object.values(stored));
//     const d2 = new Float32Array(live);
//     const distance = faceapi.euclideanDistance(d1, d2);
//     console.log('Face distance:', distance);
//     return distance < threshold;
//   };

//   return { modelsLoaded, modelError, captureDescriptor, compareFaces };
// }










//////////fff










// hooks/useFaceApi.js
import { useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';

const MODEL_URL = process.env.PUBLIC_URL + '/models';

export function useFaceApi() {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [modelError, setModelError] = useState('');

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
      } catch (err) {
        console.error('Model load error:', err);
        setModelError('Failed to load face models. Make sure /public/models/ files exist.');
      }
    };
    loadModels();
  }, []);

  // Extract face descriptor from webcam ref
  const captureDescriptor = async (webcamRef) => {
    const video = webcamRef?.current?.video;
    if (!video) { console.error('No video element'); return null; }
    if (video.readyState !== 4) { console.error('Video not ready'); return null; }

    const detection = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) return null;
    return detection.descriptor; // Float32Array[128]
  };

  // Compare live face vs stored descriptor
  // Threshold 0.45 — matches backend. Lower = stricter
  const compareFaces = (stored, live, threshold = 0.45) => {
    const d1 = new Float32Array(Object.values(stored));
    const d2 = new Float32Array(live);
    const distance = faceapi.euclideanDistance(d1, d2);
    console.log('Face verification distance:', distance.toFixed(4));
    // Show in UI for debugging — remove in production
    return { match: distance < threshold, distance: distance.toFixed(4) };
  };

  return { modelsLoaded, modelError, captureDescriptor, compareFaces };
}