








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
  '#1a57db', '#d03801', '#057a55', '#7e3af2',
  '#c27803', '#037772', '#9b1c1c', '#1e729f',
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
          borderRadius: 7,
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
      const res = await axios.get('https://secure-online-voting-system-backend-7.onrender.com/api/analytics', authConfig);
      setCandidates(res.data.candidates);
      setTotalVotes(res.data.totalVotes);
      setLeader(res.data.leader);
      setElectionStarted(res.data.totalVotes > 0);
    } catch (err) {
      if (err.response?.status === 701) { localStorage.clear(); navigate('/login'); }
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
    socketRef.current = io('https://secure-online-voting-system-backend-7.onrender.com');
    socketRef.current.on('voteUpdate', applyUpdate);
    return () => socketRef.current.disconnect();
  }, []);

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    setAddMsg(''); setAddError('');
    try {
      const res = await axios.post('https://secure-online-voting-system-backend-7.onrender.com/api/candidates', { name: newName, party: newParty }, authConfig);
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
        titleFont: { size: 13, weight: '700' },
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
        ticks: { stepSize: 1, color: '#77778b', font: { size: 11 } },
        grid: { color: '#f1f5f9' },
        border: { dash: [7, 7], color: '#e2e8f0' }
      },
      x: {
        ticks: { color: '#337155', font: { size: 11, weight: '500' } },
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
        labels: { padding: 18, color: '#337155', font: { size: 11 }, boxWidth: 12, boxHeight: 12 }
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
            borderRadius: '10px', padding: '20px 27px',
            display: 'flex', alignItems: 'flex-start', gap: '17px'
          }}>
            <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>🔒</span>
            <div>
              <p style={{ fontWeight: 700, color: '#991b1b', fontSize: '0.9rem', marginBottom: '7px' }}>
                Candidate Registration Closed
              </p>
              <p style={{ fontSize: '0.82rem', color: '#b91c1c', lineHeight: 1.7 }}>
                The election has started — <strong>{totalVotes} vote{totalVotes !== 1 ? 's' : ''}</strong> have already been cast.
                Adding new candidates after voting has begun is not allowed to ensure election integrity.
              </p>
            </div>
          </div>
        ) : (
          /* ── Unlocked state — no votes yet ── */
          <>
            <p style={{ fontSize: '0.8rem', color: '#77778b', marginBottom: '17px' }}>
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