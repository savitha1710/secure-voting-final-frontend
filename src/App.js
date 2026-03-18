// // App.js - Root component with React Router setup
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Signup from './pages/Signup';
// import Login from './pages/Login';
// import VotingPage from './pages/VotingPage';
// import AdminDashboard from './pages/AdminDashboard';

// import './pages/Signup.css';
// import './pages/Login.css';
// import './pages/VotingPage.css';
// import './pages/AdminDashboard.css';

// // ─── Protected Route Helper ───────────────────────────────────────────────────
// // Wraps a route and redirects to /login if no token exists
// const ProtectedRoute = ({ children, requiredRole }) => {
//   const token = localStorage.getItem('token');
//   const role = localStorage.getItem('role');

//   if (!token) return <Navigate to="/login" />;
//   if (requiredRole && role !== requiredRole) return <Navigate to="/login" />;

//   return children;
// };

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Public routes */}
//         <Route path="/" element={<Navigate to="/login" />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/login" element={<Login />} />

//         {/* Protected: only 'user' role */}
//         <Route
//           path="/vote"
//           element={
//             <ProtectedRoute requiredRole="user">
//               <VotingPage />
//             </ProtectedRoute>
//           }
//         />

//         {/* Protected: only 'admin' role */}
//         <Route
//           path="/admin"
//           element={
//             <ProtectedRoute requiredRole="admin">
//               <AdminDashboard />
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;



















//////////cccccccccccccccc









// App.js — added /face-verify route
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import VotingPage from './pages/VotingPage';
import AdminDashboard from './pages/AdminDashboard';
import FaceVerify from './pages/FaceVerify';

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (!token) return <Navigate to="/login" />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Face verify — after OTP, before /vote */}
        <Route path="/face-verify" element={
          <ProtectedRoute>
            <FaceVerify />
          </ProtectedRoute>
        } />

        <Route path="/vote" element={
          <ProtectedRoute requiredRole="user">
            <VotingPage />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;