// // pages/AdminDashboard.js - Admin view: see all candidates + vote counts, add candidates
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// function AdminDashboard() {
//   const navigate = useNavigate();
//   const token = localStorage.getItem('token');

//   const [candidates, setCandidates] = useState([]);
//   const [newName, setNewName] = useState('');
//   const [newParty, setNewParty] = useState('');
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Axios config with JWT token
//   const authConfig = {
//     headers: { Authorization: `Bearer ${token}` }
//   };

//   // Fetch all candidates when component mounts
//   useEffect(() => {
//     fetchCandidates();
//   }, []); // eslint-disable-line react-hooks/exhaustive-deps

//   const fetchCandidates = async () => {
//     try {
//       const res = await axios.get('http://localhost:5000/api/candidates', authConfig);
//       setCandidates(res.data);
//     } catch (err) {
//       setError('Failed to load candidates. Session may have expired.');
//       localStorage.clear();
//       setTimeout(() => navigate('/login'), 2000);
//     }
//   };

//   // Add a new candidate
//   const handleAddCandidate = async (e) => {
//     e.preventDefault();
//     setError('');
//     setMessage('');
//     setLoading(true);

//     try {
//       const res = await axios.post(
//         'http://localhost:5000/api/candidates',
//         { name: newName, party: newParty },
//         authConfig
//       );
//       setMessage(res.data.message);
//       setNewName('');
//       setNewParty('');
//       fetchCandidates(); // Refresh the list
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to add candidate.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Calculate total votes for percentage display
//   const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate('/login');
//   };

//   return (
//     <div style={styles.container}>
//       {/* Header */}
//       <div style={styles.header}>
//         <h2>Admin Dashboard</h2>
//         <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
//       </div>

//       <p>Total votes cast: <strong>{totalVotes}</strong></p>

//       {/* ── Candidate Results Table ── */}
//       <h3>Candidates &amp; Vote Counts</h3>
//       {candidates.length === 0 ? (
//         <p>No candidates added yet.</p>
//       ) : (
//         <table style={styles.table}>
//           <thead>
//             <tr>
//               <th style={styles.th}>#</th>
//               <th style={styles.th}>Name</th>
//               <th style={styles.th}>Party</th>
//               <th style={styles.th}>Votes</th>
//               <th style={styles.th}>Share (%)</th>
//             </tr>
//           </thead>
//           <tbody>
//             {/* Sort by voteCount descending */}
//             {[...candidates]
//               .sort((a, b) => b.voteCount - a.voteCount)
//               .map((c, idx) => (
//                 <tr key={c._id} style={idx === 0 && totalVotes > 0 ? styles.topRow : {}}>
//                   <td style={styles.td}>{idx + 1}</td>
//                   <td style={styles.td}>{c.name}</td>
//                   <td style={styles.td}>{c.party}</td>
//                   <td style={styles.td}>{c.voteCount}</td>
//                   <td style={styles.td}>
//                     {totalVotes > 0
//                       ? ((c.voteCount / totalVotes) * 100).toFixed(1) + '%'
//                       : '0%'}
//                   </td>
//                 </tr>
//               ))}
//           </tbody>
//         </table>
//       )}

//       {/* ── Add New Candidate Form ── */}
//       <h3 style={{ marginTop: '30px' }}>Add New Candidate</h3>
//       <form onSubmit={handleAddCandidate} style={styles.form}>
//         <input
//           placeholder="Candidate Name"
//           value={newName}
//           onChange={(e) => setNewName(e.target.value)}
//           required
//           style={styles.input}
//         />
//         <input
//           placeholder="Party Name"
//           value={newParty}
//           onChange={(e) => setNewParty(e.target.value)}
//           required
//           style={styles.input}
//         />

//         {error && <p style={styles.error}>{error}</p>}
//         {message && <p style={styles.success}>{message}</p>}

//         <button type="submit" disabled={loading} style={styles.addBtn}>
//           {loading ? 'Adding...' : 'Add Candidate'}
//         </button>
//       </form>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     maxWidth: '700px',
//     margin: '40px auto',
//     padding: '20px',
//     border: '1px solid #ccc',
//     borderRadius: '8px',
//     fontFamily: 'Arial, sans-serif'
//   },
//   header: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center'
//   },
//   logoutBtn: {
//     padding: '6px 12px',
//     backgroundColor: '#ef4444',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer'
//   },
//   table: {
//     width: '100%',
//     borderCollapse: 'collapse',
//     marginTop: '10px'
//   },
//   th: {
//     borderBottom: '2px solid #ccc',
//     padding: '10px',
//     textAlign: 'left',
//     backgroundColor: '#f3f4f6'
//   },
//   td: {
//     padding: '10px',
//     borderBottom: '1px solid #eee'
//   },
//   // Highlight the leading candidate row
//   topRow: {
//     backgroundColor: '#f0fdf4',
//     fontWeight: 'bold'
//   },
//   form: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '10px',
//     maxWidth: '360px'
//   },
//   input: {
//     padding: '10px',
//     fontSize: '14px',
//     borderRadius: '4px',
//     border: '1px solid #aaa'
//   },
//   addBtn: {
//     padding: '10px',
//     backgroundColor: '#3b82f6',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer',
//     fontSize: '15px'
//   },
//   error: { color: 'red', margin: 0 },
//   success: { color: 'green', margin: 0 }
// };

// export default AdminDashboard;















// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './AdminDashboard.css';

// function AdminDashboard() {
//   const navigate = useNavigate();
//   const token = localStorage.getItem('token');

//   const [candidates, setCandidates] = useState([]);
//   const [newName, setNewName] = useState('');
//   const [newParty, setNewParty] = useState('');
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const authConfig = {
//     headers: { Authorization: `Bearer ${token}` }
//   };

//   useEffect(() => {
//     fetchCandidates();
//   }, []);

//   const fetchCandidates = async () => {
//     try {
//       const res = await axios.get('http://localhost:5000/api/candidates', authConfig);
//       setCandidates(res.data);
//     } catch {
//       setError('Session expired. Please login again.');
//       localStorage.clear();
//       setTimeout(() => navigate('/login'), 2000);
//     }
//   };

//   const handleAddCandidate = async (e) => {
//     e.preventDefault();
//     setError('');
//     setMessage('');
//     setLoading(true);

//     try {
//       const res = await axios.post(
//         'http://localhost:5000/api/candidates',
//         { name: newName, party: newParty },
//         authConfig
//       );
//       setMessage(res.data.message);
//       setNewName('');
//       setNewParty('');
//       fetchCandidates();
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to add candidate.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate('/login');
//   };

//   return (
//     <div className="admin-container">
//       <div className="admin-card">

//         {/* Header */}
//         <div className="admin-header">
//           <h2>Admin Dashboard</h2>
//           <button className="logout-btn" onClick={handleLogout}>Logout</button>
//         </div>

//         <p className="total-votes">
//           Total Votes: <strong>{totalVotes}</strong>
//         </p>

//         {/* Table */}
//         <h3 className="section-title">Candidates & Results</h3>

//         {candidates.length === 0 ? (
//           <p>No candidates added yet.</p>
//         ) : (
//           <table className="candidate-table">
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>Name</th>
//                 <th>Party</th>
//                 <th>Votes</th>
//                 <th>Share</th>
//               </tr>
//             </thead>
//             <tbody>
//               {[...candidates]
//                 .sort((a, b) => b.voteCount - a.voteCount)
//                 .map((c, idx) => (
//                   <tr key={c._id} className={idx === 0 && totalVotes > 0 ? 'top-row' : ''}>
//                     <td>{idx + 1}</td>
//                     <td>{c.name}</td>
//                     <td>{c.party}</td>
//                     <td>{c.voteCount}</td>
//                     <td>
//                       {totalVotes > 0
//                         ? ((c.voteCount / totalVotes) * 100).toFixed(1) + '%'
//                         : '0%'}
//                     </td>
//                   </tr>
//                 ))}
//             </tbody>
//           </table>
//         )}

//         {/* Add Candidate */}
//         <h3 className="section-title">Add New Candidate</h3>

//         <form onSubmit={handleAddCandidate} className="form">
//           <input
//             placeholder="Candidate Name"
//             value={newName}
//             onChange={(e) => setNewName(e.target.value)}
//             required
//           />
//           <input
//             placeholder="Party Name"
//             value={newParty}
//             onChange={(e) => setNewParty(e.target.value)}
//             required
//           />

//           {error && <p className="error">{error}</p>}
//           {message && <p className="success">{message}</p>}

//           <button type="submit" disabled={loading}>
//             {loading ? 'Adding...' : 'Add Candidate'}
//           </button>
//         </form>

//       </div>
//     </div>
//   );
// }

// export default AdminDashboard;















//gggggggg






// // pages/AdminDashboard.js — real-time analytics dashboard
// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { io } from 'socket.io-client';
// import {
//   Chart as ChartJS,
//   CategoryScale, LinearScale, BarElement,
//   ArcElement, Tooltip, Legend, Title
// } from 'chart.js';
// import { Bar, Pie } from 'react-chartjs-2';

// // Register Chart.js components
// ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title);

// // ── Colour palette for candidates ────────────────────────────────────────────
// const COLORS = [
//   '#2e7bcf', '#e05c3a', '#27ae60', '#9b59b6',
//   '#f39c12', '#16a085', '#c0392b', '#2980b9',
//   '#8e44ad', '#d35400'
// ];

// function AdminDashboard() {
//   const navigate = useNavigate();
//   const token = localStorage.getItem('token');
//   const authConfig = { headers: { Authorization: `Bearer ${token}` } };

//   const [candidates, setCandidates] = useState([]);
//   const [totalVotes, setTotalVotes] = useState(0);
//   const [leader, setLeader] = useState(null);
//   const [newName, setNewName] = useState('');
//   const [newParty, setNewParty] = useState('');
//   const [addMsg, setAddMsg] = useState('');
//   const [addError, setAddError] = useState('');
//   const [lastUpdate, setLastUpdate] = useState(null);
//   const [liveIndicator, setLiveIndicator] = useState(false);
//   const socketRef = useRef(null);

//   // ── Build chart datasets from candidates array ────────────────────────────
//   const buildChartData = (data) => {
//     const labels = data.map(c => c.name);
//     const votes  = data.map(c => c.voteCount);
//     const bgColors = data.map((_, i) => COLORS[i % COLORS.length]);

//     const barData = {
//       labels,
//       datasets: [{
//         label: 'Votes',
//         data: votes,
//         backgroundColor: bgColors,
//         borderRadius: 6,
//         borderSkipped: false,
//       }]
//     };

//     const pieData = {
//       labels,
//       datasets: [{
//         data: votes,
//         backgroundColor: bgColors,
//         borderWidth: 2,
//         borderColor: '#fff',
//       }]
//     };

//     return { barData, pieData };
//   };

//   // ── Fetch initial analytics data ──────────────────────────────────────────
//   const fetchAnalytics = async () => {
//     try {
//       const res = await axios.get('http://localhost:5000/api/analytics', authConfig);
//       setCandidates(res.data.candidates);
//       setTotalVotes(res.data.totalVotes);
//       setLeader(res.data.leader);
//     } catch (err) {
//       if (err.response?.status === 401) {
//         localStorage.clear();
//         navigate('/login');
//       }
//     }
//   };

//   // ── Update state when new socket data arrives ─────────────────────────────
//   const applyUpdate = (updatedCandidates) => {
//     const sorted = [...updatedCandidates].sort((a, b) => b.voteCount - a.voteCount);
//     setCandidates(sorted);
//     const total = sorted.reduce((s, c) => s + c.voteCount, 0);
//     setTotalVotes(total);
//     setLeader(sorted[0] || null);
//     setLastUpdate(new Date().toLocaleTimeString());
//     // Flash live indicator
//     setLiveIndicator(true);
//     setTimeout(() => setLiveIndicator(false), 1500);
//   };

//   // ── Mount: fetch data + connect socket ───────────────────────────────────
//   useEffect(() => {
//     fetchAnalytics();

//     socketRef.current = io('http://localhost:5000');

//     socketRef.current.on('connect', () => {
//       console.log('Socket connected:', socketRef.current.id);
//     });

//     // Listen for vote updates pushed by server
//     socketRef.current.on('voteUpdate', (updatedCandidates) => {
//       console.log('Live vote update received');
//       applyUpdate(updatedCandidates);
//     });

//     return () => {
//       socketRef.current.disconnect();
//     };
//   }, []); // eslint-disable-next-line

//   // ── Add candidate ─────────────────────────────────────────────────────────
//   const handleAddCandidate = async (e) => {
//     e.preventDefault();
//     setAddMsg(''); setAddError('');
//     try {
//       const res = await axios.post('http://localhost:5000/api/candidates', { name: newName, party: newParty }, authConfig);
//       setAddMsg(res.data.message);
//       setNewName(''); setNewParty('');
//       fetchAnalytics();
//     } catch (err) {
//       setAddError(err.response?.data?.message || 'Failed to add candidate.');
//     }
//   };

//   const handleLogout = () => {
//     socketRef.current?.disconnect();
//     localStorage.clear();
//     navigate('/login');
//   };

//   const { barData, pieData } = buildChartData(candidates);

//   const barOptions = {
//     responsive: true,
//     plugins: {
//       legend: { display: false },
//       title: { display: false },
//       tooltip: {
//         callbacks: {
//           label: (ctx) => {
//             const pct = totalVotes > 0 ? ((ctx.raw / totalVotes) * 100).toFixed(1) : 0;
//             return ` ${ctx.raw} votes (${pct}%)`;
//           }
//         }
//       }
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         ticks: { stepSize: 1, color: '#6b87a2' },
//         grid: { color: '#eef3f8' }
//       },
//       x: {
//         ticks: { color: '#0d2b4e', font: { weight: '500' } },
//         grid: { display: false }
//       }
//     }
//   };

//   const pieOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'bottom',
//         labels: { padding: 16, color: '#0d2b4e', font: { size: 12 } }
//       },
//       tooltip: {
//         callbacks: {
//           label: (ctx) => {
//             const pct = totalVotes > 0 ? ((ctx.raw / totalVotes) * 100).toFixed(1) : 0;
//             return ` ${ctx.label}: ${ctx.raw} votes (${pct}%)`;
//           }
//         }
//       }
//     }
//   };

//   return (
//     <div style={s.page}>

//       {/* ── Top Bar ── */}
//       <div style={s.topbar}>
//         <div>
//           <h1 style={s.pageTitle}>Admin Dashboard</h1>
//           <p style={s.pageSub}>Real-time voting analytics</p>
//         </div>
//         <div style={s.topRight}>
//           {/* Live indicator dot */}
//           <div style={s.liveRow}>
//             <span style={{ ...s.liveDot, background: liveIndicator ? '#27ae60' : '#ccc' }} />
//             <span style={s.liveText}>{liveIndicator ? 'Live update!' : 'Live'}</span>
//           </div>
//           <button onClick={handleLogout} style={s.logoutBtn}>Logout</button>
//         </div>
//       </div>

//       {/* ── Stat Cards ── */}
//       <div style={s.statGrid}>
//         <div style={s.statCard}>
//           <p style={s.statLabel}>Total Votes Cast</p>
//           <p style={s.statValue}>{totalVotes}</p>
//         </div>
//         <div style={s.statCard}>
//           <p style={s.statLabel}>Total Candidates</p>
//           <p style={s.statValue}>{candidates.length}</p>
//         </div>
//         <div style={{ ...s.statCard, borderLeft: '4px solid #2e7bcf' }}>
//           <p style={s.statLabel}>Leading Candidate</p>
//           <p style={{ ...s.statValue, color: '#2e7bcf' }}>
//             {leader ? leader.name : '—'}
//           </p>
//           {leader && <p style={s.statSub}>{leader.party} · {leader.voteCount} votes</p>}
//         </div>
//         <div style={s.statCard}>
//           <p style={s.statLabel}>Last Update</p>
//           <p style={s.statValue}>{lastUpdate || '—'}</p>
//           <p style={s.statSub}>auto-refreshes on vote</p>
//         </div>
//       </div>

//       {/* ── Charts Row ── */}
//       {candidates.length > 0 ? (
//         <div style={s.chartRow}>

//           {/* Bar Chart */}
//           <div style={s.chartCard}>
//             <h3 style={s.chartTitle}>Votes per Candidate</h3>
//             <Bar data={barData} options={barOptions} />
//           </div>

//           {/* Pie Chart */}
//           <div style={s.chartCard}>
//             <h3 style={s.chartTitle}>Vote Distribution</h3>
//             {totalVotes > 0 ? (
//               <Pie data={pieData} options={pieOptions} />
//             ) : (
//               <p style={s.noVotes}>No votes cast yet</p>
//             )}
//           </div>

//         </div>
//       ) : (
//         <div style={s.emptyChart}>
//           <p>No candidates yet. Add candidates below to see charts.</p>
//         </div>
//       )}

//       {/* ── Results Table ── */}
//       {candidates.length > 0 && (
//         <div style={s.tableCard}>
//           <h3 style={s.sectionTitle}>Full Results</h3>
//           <table style={s.table}>
//             <thead>
//               <tr>
//                 {['Rank', 'Candidate', 'Party', 'Votes', 'Share', 'Progress'].map(h => (
//                   <th key={h} style={s.th}>{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {candidates.map((c, i) => {
//                 const pct = totalVotes > 0 ? ((c.voteCount / totalVotes) * 100).toFixed(1) : 0;
//                 const isLeader = leader && c.name === leader.name;
//                 return (
//                   <tr key={c._id} style={isLeader ? s.leaderRow : {}}>
//                     <td style={s.td}>
//                       {isLeader ? '🏆' : `#${i + 1}`}
//                     </td>
//                     <td style={{ ...s.td, fontWeight: isLeader ? '600' : '400' }}>{c.name}</td>
//                     <td style={s.td}>{c.party}</td>
//                     <td style={{ ...s.td, fontWeight: '600', color: COLORS[i % COLORS.length] }}>{c.voteCount}</td>
//                     <td style={s.td}>{pct}%</td>
//                     <td style={{ ...s.td, minWidth: '120px' }}>
//                       <div style={s.barBg}>
//                         <div style={{ ...s.barFill, width: `${pct}%`, background: COLORS[i % COLORS.length] }} />
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* ── Add Candidate ── */}
//       <div style={s.addCard}>
//         <h3 style={s.sectionTitle}>Add New Candidate</h3>
//         <form onSubmit={handleAddCandidate} style={s.addForm}>
//           <input
//             placeholder="Candidate Name"
//             value={newName}
//             onChange={e => setNewName(e.target.value)}
//             required
//             style={s.input}
//           />
//           <input
//             placeholder="Party Name"
//             value={newParty}
//             onChange={e => setNewParty(e.target.value)}
//             required
//             style={s.input}
//           />
//           <button type="submit" style={s.addBtn}>Add Candidate</button>
//         </form>
//         {addMsg   && <p style={s.success}>{addMsg}</p>}
//         {addError && <p style={s.error}>{addError}</p>}
//       </div>

//     </div>
//   );
// }

// // ── Styles ────────────────────────────────────────────────────────────────────
// const s = {
//   page:        { maxWidth: '1100px', margin: '0 auto', padding: '24px 20px', fontFamily: 'Arial, sans-serif' },
//   topbar:      { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
//   pageTitle:   { fontSize: '24px', fontWeight: '700', color: '#0d2b4e', margin: 0 },
//   pageSub:     { fontSize: '13px', color: '#6b87a2', margin: '4px 0 0' },
//   topRight:    { display: 'flex', alignItems: 'center', gap: '16px' },
//   liveRow:     { display: 'flex', alignItems: 'center', gap: '6px' },
//   liveDot:     { width: '10px', height: '10px', borderRadius: '50%', transition: 'background 0.3s' },
//   liveText:    { fontSize: '12px', color: '#6b87a2' },
//   logoutBtn:   { padding: '8px 16px', background: '#e05c3a', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' },

//   statGrid:    { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' },
//   statCard:    { background: '#fff', border: '1px solid #e8f0f8', borderRadius: '12px', padding: '16px 20px' },
//   statLabel:   { fontSize: '12px', color: '#6b87a2', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.5px' },
//   statValue:   { fontSize: '26px', fontWeight: '700', color: '#0d2b4e', margin: 0 },
//   statSub:     { fontSize: '12px', color: '#6b87a2', margin: '4px 0 0' },

//   chartRow:    { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' },
//   chartCard:   { background: '#fff', border: '1px solid #e8f0f8', borderRadius: '12px', padding: '20px 24px' },
//   chartTitle:  { fontSize: '15px', fontWeight: '600', color: '#0d2b4e', margin: '0 0 16px' },
//   noVotes:     { color: '#9ab2c8', textAlign: 'center', padding: '40px 0', fontSize: '14px' },
//   emptyChart:  { background: '#f5f9fd', border: '1px dashed #c5daed', borderRadius: '12px', padding: '40px', textAlign: 'center', color: '#6b87a2', marginBottom: '24px' },

//   tableCard:   { background: '#fff', border: '1px solid #e8f0f8', borderRadius: '12px', padding: '20px 24px', marginBottom: '24px', overflowX: 'auto' },
//   sectionTitle:{ fontSize: '15px', fontWeight: '600', color: '#0d2b4e', margin: '0 0 16px' },
//   table:       { width: '100%', borderCollapse: 'collapse' },
//   th:          { padding: '10px 12px', textAlign: 'left', fontSize: '12px', color: '#6b87a2', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #e8f0f8' },
//   td:          { padding: '12px 12px', fontSize: '14px', color: '#0d2b4e', borderBottom: '1px solid #f0f5fb' },
//   leaderRow:   { background: '#f0f8ff' },
//   barBg:       { background: '#eef3f8', borderRadius: '4px', height: '8px', overflow: 'hidden' },
//   barFill:     { height: '8px', borderRadius: '4px', transition: 'width 0.5s ease' },

//   addCard:     { background: '#fff', border: '1px solid #e8f0f8', borderRadius: '12px', padding: '20px 24px' },
//   addForm:     { display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' },
//   input:       { flex: 1, minWidth: '160px', padding: '10px 14px', border: '1.5px solid #dde8f2', borderRadius: '8px', fontSize: '14px', color: '#0d2b4e', background: '#f5f9fd', outline: 'none' },
//   addBtn:      { padding: '10px 20px', background: '#2e7bcf', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
//   success:     { color: '#27ae60', fontSize: '13px', margin: '4px 0 0' },
//   error:       { color: '#e05c3a', fontSize: '13px', margin: '4px 0 0' },
// };

// export default AdminDashboard;










// // pages/AdminDashboard.js
// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { io } from 'socket.io-client';
// import {
//   Chart as ChartJS,
//   CategoryScale, LinearScale, BarElement,
//   ArcElement, Tooltip, Legend, Title
// } from 'chart.js';
// import { Bar, Pie } from 'react-chartjs-2';
// import './AdminDashboard.css';
// import adminBanner from './admin-banner.png';

// ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title);

// const COLORS = [
//   '#1a56db', '#d03801', '#057a55', '#7e3af2',
//   '#c27803', '#036672', '#9b1c1c', '#1e429f',
//   '#5521b5', '#723b13'
// ];

// function AdminDashboard() {
//   const navigate = useNavigate();
//   const token = localStorage.getItem('token');
//   const authConfig = { headers: { Authorization: `Bearer ${token}` } };

//   const [candidates, setCandidates]     = useState([]);
//   const [totalVotes, setTotalVotes]     = useState(0);
//   const [leader, setLeader]             = useState(null);
//   const [newName, setNewName]           = useState('');
//   const [newParty, setNewParty]         = useState('');
//   const [addMsg, setAddMsg]             = useState('');
//   const [addError, setAddError]         = useState('');
//   const [lastUpdate, setLastUpdate]     = useState(null);
//   const [liveIndicator, setLiveIndicator] = useState(false);
//   const socketRef = useRef(null);

//   const buildChartData = (data) => {
//     const labels   = data.map(c => c.name);
//     const votes    = data.map(c => c.voteCount);
//     const bgColors = data.map((_, i) => COLORS[i % COLORS.length]);

//     return {
//       barData: {
//         labels,
//         datasets: [{
//           label: 'Votes',
//           data: votes,
//           backgroundColor: bgColors,
//           borderRadius: 4,
//           borderSkipped: false,
//         }]
//       },
//       pieData: {
//         labels,
//         datasets: [{
//           data: votes,
//           backgroundColor: bgColors,
//           borderWidth: 2,
//           borderColor: '#ffffff',
//         }]
//       }
//     };
//   };

//   const fetchAnalytics = async () => {
//     try {
//       const res = await axios.get('http://localhost:5000/api/analytics', authConfig);
//       setCandidates(res.data.candidates);
//       setTotalVotes(res.data.totalVotes);
//       setLeader(res.data.leader);
//     } catch (err) {
//       if (err.response?.status === 401) { localStorage.clear(); navigate('/login'); }
//     }
//   };

//   const applyUpdate = (updatedCandidates) => {
//     const sorted = [...updatedCandidates].sort((a, b) => b.voteCount - a.voteCount);
//     setCandidates(sorted);
//     setTotalVotes(sorted.reduce((s, c) => s + c.voteCount, 0));
//     setLeader(sorted[0] || null);
//     setLastUpdate(new Date().toLocaleTimeString());
//     setLiveIndicator(true);
//     setTimeout(() => setLiveIndicator(false), 1500);
//   };

//   // eslint-disable-next-line
//   useEffect(() => {
//     fetchAnalytics();
//     socketRef.current = io('http://localhost:5000');
//     socketRef.current.on('voteUpdate', applyUpdate);
//     return () => socketRef.current.disconnect();
//   }, []);

//   const handleAddCandidate = async (e) => {
//     e.preventDefault();
//     setAddMsg(''); setAddError('');
//     try {
//       const res = await axios.post('http://localhost:5000/api/candidates', { name: newName, party: newParty }, authConfig);
//       setAddMsg(res.data.message);
//       setNewName(''); setNewParty('');
//       fetchAnalytics();
//     } catch (err) {
//       setAddError(err.response?.data?.message || 'Failed to add candidate.');
//     }
//   };

//   const handleLogout = () => {
//     socketRef.current?.disconnect();
//     localStorage.clear();
//     navigate('/login');
//   };

//   const { barData, pieData } = buildChartData(candidates);

//   const barOptions = {
//     responsive: true,
//     plugins: {
//       legend: { display: false },
//       tooltip: {
//         backgroundColor: '#0f172a',
//         padding: 10,
//         titleFont: { size: 13, weight: '600' },
//         bodyFont: { size: 12 },
//         callbacks: {
//           label: (ctx) => {
//             const pct = totalVotes > 0 ? ((ctx.raw / totalVotes) * 100).toFixed(1) : 0;
//             return `  ${ctx.raw} votes  (${pct}%)`;
//           }
//         }
//       }
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         ticks: { stepSize: 1, color: '#64748b', font: { size: 11 } },
//         grid: { color: '#f1f5f9' },
//         border: { dash: [4, 4], color: '#e2e8f0' }
//       },
//       x: {
//         ticks: { color: '#334155', font: { size: 11, weight: '500' } },
//         grid: { display: false },
//         border: { color: '#e2e8f0' }
//       }
//     }
//   };

//   const pieOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'bottom',
//         labels: { padding: 18, color: '#334155', font: { size: 11 }, boxWidth: 12, boxHeight: 12 }
//       },
//       tooltip: {
//         backgroundColor: '#0f172a',
//         padding: 10,
//         callbacks: {
//           label: (ctx) => {
//             const pct = totalVotes > 0 ? ((ctx.raw / totalVotes) * 100).toFixed(1) : 0;
//             return `  ${ctx.label}: ${ctx.raw} votes (${pct}%)`;
//           }
//         }
//       }
//     }
//   };

//   return (
//     <div className="ad-root">

//       {/* ── Top bar — fixed Sign Out top right ── */}
//       <div className="ad-topbar">
//         <div className={`ad-live-badge ${liveIndicator ? 'ad-live-pulse' : ''}`}>
//           <span className="ad-live-dot" />
//           <span>{liveIndicator ? 'Updating...' : 'Live'}</span>
//         </div>
//         {lastUpdate && <span className="ad-last-update">Updated {lastUpdate}</span>}
//         <button className="ad-logout-btn" onClick={handleLogout}>Sign Out</button>
//       </div>

//       {/* ── Hero — left text, big image right ── */}
//       <div className="ad-hero">
//         <div className="ad-hero-text">
//           <p className="ad-hero-eyebrow">Welcome, Administrator</p>
//           <div className="ad-hero-pills">
//             <span className="ad-hero-pill ad-hero-pill--blue">Real-time Analytics</span>
//             <span className="ad-hero-pill ad-hero-pill--orange">Candidate Management</span>
//             <span className="ad-hero-pill ad-hero-pill--green">Live Results</span>
//           </div>
//         </div>
//         <div className="ad-hero-img-wrap">
//           <img src={adminBanner} alt="Admin Dashboard" className="ad-hero-img" />
//         </div>
//       </div>

//       <div className="ad-page">

//       {/* ── Section heading ── */}
//       <div className="ad-section-head">
//         <h1 className="ad-title">Election Dashboard</h1>
//         <p className="ad-subtitle">Real-time voting analytics</p>
//       </div>

//       {/* ── Stat Cards ── */}
//       <section className="ad-stat-grid">
//         <div className="ad-stat-card">
//           <span className="ad-stat-label">Total Votes</span>
//           <span className="ad-stat-value">{totalVotes.toLocaleString()}</span>
//           <span className="ad-stat-hint">across all candidates</span>
//         </div>
//         <div className="ad-stat-card">
//           <span className="ad-stat-label">Candidates</span>
//           <span className="ad-stat-value">{candidates.length}</span>
//           <span className="ad-stat-hint">registered in system</span>
//         </div>
//         <div className="ad-stat-card ad-stat-card--accent">
//           <span className="ad-stat-label">Current Leader</span>
//           <span className="ad-stat-value ad-stat-value--leader">
//             {leader ? leader.name : '—'}
//           </span>
//           <span className="ad-stat-hint">
//             {leader ? `${leader.party} · ${leader.voteCount} votes` : 'no votes yet'}
//           </span>
//         </div>
//         <div className="ad-stat-card">
//           <span className="ad-stat-label">Vote Share (Leader)</span>
//           <span className="ad-stat-value">
//             {leader && totalVotes > 0
//               ? `${((leader.voteCount / totalVotes) * 100).toFixed(1)}%`
//               : '—'}
//           </span>
//           <span className="ad-stat-hint">of total votes cast</span>
//         </div>
//       </section>

//       {/* ── Charts ── */}
//       {candidates.length > 0 ? (
//         <section className="ad-chart-grid">
//           <div className="ad-card">
//             <div className="ad-card-header">
//               <h2 className="ad-card-title">Votes per Candidate</h2>
//               <span className="ad-card-tag">Bar Chart</span>
//             </div>
//             <div className="ad-chart-wrap">
//               <Bar data={barData} options={barOptions} />
//             </div>
//           </div>
//           <div className="ad-card">
//             <div className="ad-card-header">
//               <h2 className="ad-card-title">Vote Distribution</h2>
//               <span className="ad-card-tag">Pie Chart</span>
//             </div>
//             <div className="ad-chart-wrap ad-chart-wrap--pie">
//               {totalVotes > 0
//                 ? <Pie data={pieData} options={pieOptions} />
//                 : <p className="ad-empty-note">No votes cast yet</p>
//               }
//             </div>
//           </div>
//         </section>
//       ) : (
//         <div className="ad-empty-state">
//           <p>No candidates added yet. Use the form below to get started.</p>
//         </div>
//       )}

//       {/* ── Results Table ── */}
//       {candidates.length > 0 && (
//         <div className="ad-card ad-card--full">
//           <div className="ad-card-header">
//             <h2 className="ad-card-title">Full Results</h2>
//             <span className="ad-card-tag">{candidates.length} candidates</span>
//           </div>
//           <div className="ad-table-wrap">
//             <table className="ad-table">
//               <thead>
//                 <tr>
//                   <th>Rank</th>
//                   <th>Candidate</th>
//                   <th>Party</th>
//                   <th>Votes</th>
//                   <th>Share</th>
//                   <th>Progress</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {candidates.map((c, i) => {
//                   const pct = totalVotes > 0 ? ((c.voteCount / totalVotes) * 100).toFixed(1) : 0;
//                   const isLeader = leader && c._id === leader._id;
//                   return (
//                     <tr key={c._id} className={isLeader ? 'ad-row--leader' : ''}>
//                       <td>
//                         {isLeader
//                           ? <span className="ad-rank-badge">1st</span>
//                           : <span className="ad-rank-num">#{i + 1}</span>
//                         }
//                       </td>
//                       <td className={isLeader ? 'ad-td--bold' : ''}>{c.name}</td>
//                       <td className="ad-td--muted">{c.party}</td>
//                       <td>
//                         <span className="ad-vote-count" style={{ color: COLORS[i % COLORS.length] }}>
//                           {c.voteCount}
//                         </span>
//                       </td>
//                       <td className="ad-td--muted">{pct}%</td>
//                       <td className="ad-td--progress">
//                         <div className="ad-progress-track">
//                           <div
//                             className="ad-progress-fill"
//                             style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length] }}
//                           />
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* ── Add Candidate ── */}
//       <div className="ad-card ad-card--full">
//         <div className="ad-card-header">
//           <h2 className="ad-card-title">Add Candidate</h2>
//         </div>
//         <form className="ad-add-form" onSubmit={handleAddCandidate}>
//           <input
//             className="ad-input"
//             placeholder="Candidate full name"
//             value={newName}
//             onChange={e => setNewName(e.target.value)}
//             required
//           />
//           <input
//             className="ad-input"
//             placeholder="Party / affiliation"
//             value={newParty}
//             onChange={e => setNewParty(e.target.value)}
//             required
//           />
//           <button type="submit" className="ad-add-btn">Add Candidate</button>
//         </form>
//         {addMsg   && <p className="ad-msg ad-msg--success">{addMsg}</p>}
//         {addError && <p className="ad-msg ad-msg--error">{addError}</p>}
//       </div>

//       </div>
//     </div>
//   );
// }

// export default AdminDashboard;











// pages/AdminDashboard.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  ArcElement, Tooltip, Legend, Title
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import './AdminDashboard.css';
import adminBanner from './admin-banner.png';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title);

const COLORS = [
  '#1a56db', '#d03801', '#057a55', '#7e3af2',
  '#c27803', '#036672', '#9b1c1c', '#1e429f',
  '#5521b5', '#723b13'
];

function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const authConfig = { headers: { Authorization: `Bearer ${token}` } };

  const [candidates, setCandidates]     = useState([]);
  const [totalVotes, setTotalVotes]     = useState(0);
  const [leader, setLeader]             = useState(null);
  const [newName, setNewName]           = useState('');
  const [newParty, setNewParty]         = useState('');
  const [addMsg, setAddMsg]             = useState('');
  const [addError, setAddError]         = useState('');
  const [lastUpdate, setLastUpdate]     = useState(null);
  const [liveIndicator, setLiveIndicator] = useState(false);
  // once totalVotes > 0, election is started — lock candidate addition
  const [electionStarted, setElectionStarted] = useState(false);
  const socketRef = useRef(null);

  const buildChartData = (data) => {
    const labels   = data.map(c => c.name);
    const votes    = data.map(c => c.voteCount);
    const bgColors = data.map((_, i) => COLORS[i % COLORS.length]);

    return {
      barData: {
        labels,
        datasets: [{
          label: 'Votes',
          data: votes,
          backgroundColor: bgColors,
          borderRadius: 4,
          borderSkipped: false,
        }]
      },
      pieData: {
        labels,
        datasets: [{
          data: votes,
          backgroundColor: bgColors,
          borderWidth: 2,
          borderColor: '#ffffff',
        }]
      }
    };
  };

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/analytics', authConfig);
      setCandidates(res.data.candidates);
      setTotalVotes(res.data.totalVotes);
      setLeader(res.data.leader);
      setElectionStarted(res.data.totalVotes > 0);
    } catch (err) {
      if (err.response?.status === 401) { localStorage.clear(); navigate('/login'); }
    }
  };

  const applyUpdate = (updatedCandidates) => {
    const sorted = [...updatedCandidates].sort((a, b) => b.voteCount - a.voteCount);
    setCandidates(sorted);
    setTotalVotes(sorted.reduce((s, c) => s + c.voteCount, 0));
    setLeader(sorted[0] || null);
    setLastUpdate(new Date().toLocaleTimeString());
    setLiveIndicator(true);
    setTimeout(() => setLiveIndicator(false), 1500);
    // lock candidate addition once first vote is cast
    if (sorted.reduce((s, c) => s + c.voteCount, 0) > 0) setElectionStarted(true);
  };

  // eslint-disable-next-line
  useEffect(() => {
    fetchAnalytics();
    socketRef.current = io('http://localhost:5000');
    socketRef.current.on('voteUpdate', applyUpdate);
    return () => socketRef.current.disconnect();
  }, []);

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    setAddMsg(''); setAddError('');
    try {
      const res = await axios.post('http://localhost:5000/api/candidates', { name: newName, party: newParty }, authConfig);
      setAddMsg(res.data.message);
      setNewName(''); setNewParty('');
      fetchAnalytics();
    } catch (err) {
      setAddError(err.response?.data?.message || 'Failed to add candidate.');
    }
  };

  const handleLogout = () => {
    socketRef.current?.disconnect();
    localStorage.clear();
    navigate('/login');
  };

  const { barData, pieData } = buildChartData(candidates);

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 10,
        titleFont: { size: 13, weight: '600' },
        bodyFont: { size: 12 },
        callbacks: {
          label: (ctx) => {
            const pct = totalVotes > 0 ? ((ctx.raw / totalVotes) * 100).toFixed(1) : 0;
            return `  ${ctx.raw} votes  (${pct}%)`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, color: '#64748b', font: { size: 11 } },
        grid: { color: '#f1f5f9' },
        border: { dash: [4, 4], color: '#e2e8f0' }
      },
      x: {
        ticks: { color: '#334155', font: { size: 11, weight: '500' } },
        grid: { display: false },
        border: { color: '#e2e8f0' }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 18, color: '#334155', font: { size: 11 }, boxWidth: 12, boxHeight: 12 }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 10,
        callbacks: {
          label: (ctx) => {
            const pct = totalVotes > 0 ? ((ctx.raw / totalVotes) * 100).toFixed(1) : 0;
            return `  ${ctx.label}: ${ctx.raw} votes (${pct}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="ad-root">

      {/* ── Top bar — fixed Sign Out top right ── */}
      <div className="ad-topbar">
        <div className={`ad-live-badge ${liveIndicator ? 'ad-live-pulse' : ''}`}>
          <span className="ad-live-dot" />
          <span>{liveIndicator ? 'Updating...' : 'Live'}</span>
        </div>
        {lastUpdate && <span className="ad-last-update">Updated {lastUpdate}</span>}
        <button className="ad-logout-btn" onClick={handleLogout}>Sign Out</button>
      </div>

      {/* ── Hero — left text, big image right ── */}
      <div className="ad-hero">
        <div className="ad-hero-text">
          <p className="ad-hero-eyebrow">Welcome, Administrator</p>
          <div className="ad-hero-pills">
            <span className="ad-hero-pill ad-hero-pill--blue">Real-time Analytics</span>
            <span className="ad-hero-pill ad-hero-pill--orange">Candidate Management</span>
            <span className="ad-hero-pill ad-hero-pill--green">Live Results</span>
          </div>
        </div>
        <div className="ad-hero-img-wrap">
          <img src={adminBanner} alt="Admin Dashboard" className="ad-hero-img" />
        </div>
      </div>

      <div className="ad-page">

      {/* ── Section heading ── */}
      <div className="ad-section-head">
        <h1 className="ad-title">Election Dashboard</h1>
        <p className="ad-subtitle">Real-time voting analytics</p>
      </div>

      {/* ── Stat Cards ── */}
      <section className="ad-stat-grid">
        <div className="ad-stat-card">
          <span className="ad-stat-label">Total Votes</span>
          <span className="ad-stat-value">{totalVotes.toLocaleString()}</span>
          <span className="ad-stat-hint">across all candidates</span>
        </div>
        <div className="ad-stat-card">
          <span className="ad-stat-label">Candidates</span>
          <span className="ad-stat-value">{candidates.length}</span>
          <span className="ad-stat-hint">registered in system</span>
        </div>
        <div className="ad-stat-card ad-stat-card--accent">
          <span className="ad-stat-label">Current Leader</span>
          <span className="ad-stat-value ad-stat-value--leader">
            {leader ? leader.name : '—'}
          </span>
          <span className="ad-stat-hint">
            {leader ? `${leader.party} · ${leader.voteCount} votes` : 'no votes yet'}
          </span>
        </div>
        <div className="ad-stat-card">
          <span className="ad-stat-label">Vote Share (Leader)</span>
          <span className="ad-stat-value">
            {leader && totalVotes > 0
              ? `${((leader.voteCount / totalVotes) * 100).toFixed(1)}%`
              : '—'}
          </span>
          <span className="ad-stat-hint">of total votes cast</span>
        </div>
      </section>

      {/* ── Charts ── */}
      {candidates.length > 0 ? (
        <section className="ad-chart-grid">
          <div className="ad-card">
            <div className="ad-card-header">
              <h2 className="ad-card-title">Votes per Candidate</h2>
              <span className="ad-card-tag">Bar Chart</span>
            </div>
            <div className="ad-chart-wrap">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
          <div className="ad-card">
            <div className="ad-card-header">
              <h2 className="ad-card-title">Vote Distribution</h2>
              <span className="ad-card-tag">Pie Chart</span>
            </div>
            <div className="ad-chart-wrap ad-chart-wrap--pie">
              {totalVotes > 0
                ? <Pie data={pieData} options={pieOptions} />
                : <p className="ad-empty-note">No votes cast yet</p>
              }
            </div>
          </div>
        </section>
      ) : (
        <div className="ad-empty-state">
          <p>No candidates added yet. Use the form below to get started.</p>
        </div>
      )}

      {/* ── Results Table ── */}
      {candidates.length > 0 && (
        <div className="ad-card ad-card--full">
          <div className="ad-card-header">
            <h2 className="ad-card-title">Full Results</h2>
            <span className="ad-card-tag">{candidates.length} candidates</span>
          </div>
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Candidate</th>
                  <th>Party</th>
                  <th>Votes</th>
                  <th>Share</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((c, i) => {
                  const pct = totalVotes > 0 ? ((c.voteCount / totalVotes) * 100).toFixed(1) : 0;
                  const isLeader = leader && c._id === leader._id;
                  return (
                    <tr key={c._id} className={isLeader ? 'ad-row--leader' : ''}>
                      <td>
                        {isLeader
                          ? <span className="ad-rank-badge">1st</span>
                          : <span className="ad-rank-num">#{i + 1}</span>
                        }
                      </td>
                      <td className={isLeader ? 'ad-td--bold' : ''}>{c.name}</td>
                      <td className="ad-td--muted">{c.party}</td>
                      <td>
                        <span className="ad-vote-count" style={{ color: COLORS[i % COLORS.length] }}>
                          {c.voteCount}
                        </span>
                      </td>
                      <td className="ad-td--muted">{pct}%</td>
                      <td className="ad-td--progress">
                        <div className="ad-progress-track">
                          <div
                            className="ad-progress-fill"
                            style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length] }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Add Candidate ── */}
      <div className="ad-card ad-card--full">
        <div className="ad-card-header">
          <h2 className="ad-card-title">Add Candidate</h2>
          {electionStarted && (
            <span className="ad-card-tag" style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' }}>
              🔒 Locked — Election in Progress
            </span>
          )}
        </div>

        {electionStarted ? (
          /* ── Locked state — election already has votes ── */
          <div style={{
            background: '#fef2f2', border: '1px solid #fecaca',
            borderRadius: '10px', padding: '20px 24px',
            display: 'flex', alignItems: 'flex-start', gap: '14px'
          }}>
            <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>🔒</span>
            <div>
              <p style={{ fontWeight: 600, color: '#991b1b', fontSize: '0.9rem', marginBottom: '4px' }}>
                Candidate Registration Closed
              </p>
              <p style={{ fontSize: '0.82rem', color: '#b91c1c', lineHeight: 1.6 }}>
                The election has started — <strong>{totalVotes} vote{totalVotes !== 1 ? 's' : ''}</strong> have already been cast.
                Adding new candidates after voting has begun is not allowed to ensure election integrity.
              </p>
            </div>
          </div>
        ) : (
          /* ── Unlocked state — no votes yet ── */
          <>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '14px' }}>
              ⚠️ You can only add candidates <strong>before</strong> the election starts. Once the first vote is cast, this form will be locked.
            </p>
            <form className="ad-add-form" onSubmit={handleAddCandidate}>
              <input
                className="ad-input"
                placeholder="Candidate full name"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                required
              />
              <input
                className="ad-input"
                placeholder="Party / affiliation"
                value={newParty}
                onChange={e => setNewParty(e.target.value)}
                required
              />
              <button type="submit" className="ad-add-btn">Add Candidate</button>
            </form>
            {addMsg   && <p className="ad-msg ad-msg--success">{addMsg}</p>}
            {addError && <p className="ad-msg ad-msg--error">{addError}</p>}
          </>
        )}
      </div>

      </div>
    </div>
  );
}

export default AdminDashboard;