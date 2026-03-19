









import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#1a57db','#d03801','#057a55','#7e3af2','#c27803','#037772'];

const PARTY_SYMBOLS = {
  'BJP'           : '🪷',
  'INC'           : '✋',
  'Congress'      : '✋',
  'AAP'           : '🧹',
  'DMK'           : '🌅',
  'AIADMK'        : '🌿',
  'BSP'           : '🐘',
  'SP'            : '🚲',
  'NCP'           : '⏰',
  'Trinamool'     : '🌺',
  'TMC'           : '🌺',
  'JDU'           : '🏺',
  'RJD'           : '🔦',
  'TVK'           : '🏹',
  'CPM'           : '⚒️',
  'CPI'           : '⚒️',
  'TDP'           : '🚲',
  'YSR Congress'  : '🌀',
  'MNF'           : '🌿',
  'Progress Party': '🌟',
  'Unity Front'   : '🤝',
  'People Alliance': '🕊️',
  'National Party': '🏛️',
  'Green Party'   : '🌱',
  'Workers Party' : '⚙️',
  'default'       : '🗳️',
};

function VotingPage() {
  const navigate = useNavigate();

  // ── Read token & role ONCE at top ────────────────────────────────────────
  const token = localStorage.getItem('token');
  const role  = localStorage.getItem('role');

  const authConfig = { headers: { Authorization: `Bearer ${token}` } };

  const [candidates, setCandidates]               = useState([]);
  const [votedStatus, setVotedStatus]             = useState(false);
  const [userName, setUserName]                   = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [message, setMessage]                     = useState('');
  const [error, setError]                         = useState('');
  const [loading, setLoading]                     = useState(false);
  const [showConfirm, setShowConfirm]             = useState(false);

  // ── Guard: redirect if not a user ────────────────────────────────────────
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    if (role === 'admin') {
      navigate('/admin');
      return;
    }
    // role is correct — fetch data
    const fetchData = async () => {
      try {
        const [cRes, sRes] = await Promise.all([
          axios.get('https://secure-online-voting-system-backend-7.onrender.com/api/candidates', authConfig),
          axios.get('https://secure-online-voting-system-backend-7.onrender.com/api/status',    authConfig)
        ]);
        setCandidates(cRes.data);
        setVotedStatus(sRes.data.votedStatus);
        setUserName(sRes.data.name);
      } catch {
        localStorage.clear();
        navigate('/login');
      }
    };
    fetchData();
  }, []); // eslint-disable-next-line

  const handleSubmitClick = () => {
    if (!selectedCandidate) { setError('Please select a candidate first.'); return; }
    setError('');
    setShowConfirm(true);
  };

  const handleConfirmVote = async () => {
    setShowConfirm(false);
    setLoading(true); setError(''); setMessage('');
    try {
      const res = await axios.post(
        'https://secure-online-voting-system-backend-7.onrender.com/api/vote',
        { candidateId: selectedCandidate },
        authConfig
      );
      setMessage(res.data.message);
      setVotedStatus(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Voting failed.');
    } finally { setLoading(false); }
  };

  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

  const selectedObj = candidates.find(c => c._id === selectedCandidate);

  const s = {
    page: {
      minHeight: '100vh',
      background: '#eaf3fb',
      fontFamily: "'Inter', system-ui, sans-serif",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '0 17px 78px',
      boxSizing: 'border-box',
    },
    topbar: {
      width: '100%', maxWidth: '780px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '17px 0',
      borderBottom: '1px solid rgba(0,0,0,0.07)',
      marginBottom: '32px',
    },
    brand: { fontSize: '0.9rem', fontWeight: 700, color: '#1a57db' },
    topRight: { display: 'flex', alignItems: 'center', gap: '10px' },
    userTag: { fontSize: '0.82rem', color: '#775579', fontWeight: 500 },
    logoutBtn: {
      padding: '7px 17px', fontSize: '0.8rem', fontWeight: 500,
      color: '#775579', background: 'transparent',
      border: '1px solid #e2e8f0', borderRadius: '8px',
      cursor: 'pointer', fontFamily: 'inherit',
    },
    noticeBanner: {
      width: '100%', maxWidth: '780px',
      background: '#fffbeb', border: '1px solid #fde78a',
      borderRadius: '10px', padding: '12px 17px',
      display: 'flex', alignItems: 'flex-start', gap: '10px',
      marginBottom: '17px',
    },
    noticeText: { fontSize: '0.82rem', color: '#92700e', lineHeight: 1.7 },
    card: {
      width: '100%', maxWidth: '780px',
      background: 'rgba(255,255,255,0.85)',
      border: '1px solid rgba(255,255,255,0.95)',
      borderRadius: '20px', padding: '32px 37px',
      backdropFilter: 'blur(7px)', boxSizing: 'border-box',
    },
    cardHeader: { marginBottom: '27px' },
    greeting: { fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', marginBottom: '7px' },
    subtext: { fontSize: '0.87rem', color: '#77778b' },
    divider: { height: '1px', background: '#f1f5f9', margin: '0 0 22px' },
    sectionLabel: {
      fontSize: '0.75rem', fontWeight: 700, color: '#97a3b8',
      textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '12px',
    },
    candidateGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
      gap: '17px', marginBottom: '22px',
    },
    candidateCard: (selected, color) => ({
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: '12px', padding: '20px 17px 17px',
      border: `2px solid ${selected ? color : '#e2e8f0'}`,
      borderRadius: '17px',
      background: selected ? color + '12' : '#ffffff',
      boxShadow: selected ? `0 0 0 3px ${color}22` : 'none',
      cursor: 'pointer', transition: 'all 0.15s',
      position: 'relative', textAlign: 'center',
    }),
    symbolBox: (color) => ({
      width: '80px', height: '80px', borderRadius: '50%',
      background: color + '18', border: `2px solid ${color}33`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }),
    symbolText: { fontSize: '2.7rem', lineHeight: 1, userSelect: 'none' },
    cInfo: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' },
    cName:  { fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', display: 'block' },
    cParty: { fontSize: '0.75rem', color: '#77778b', display: 'block' },
    checkDot: {
      position: 'absolute', top: '10px', right: '10px',
      width: '22px', height: '22px', borderRadius: '50%',
      background: '#1a57db', color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '12px', fontWeight: 700,
    },
    submitBtn: (disabled) => ({
      width: '100%', padding: '13px',
      background: disabled ? '#93c5fd' : 'linear-gradient(135deg,#2e7bcf,#1a5aa8)',
      color: '#fff', border: 'none', borderRadius: '10px',
      fontSize: '0.95rem', fontWeight: 700,
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: 'inherit',
      boxShadow: disabled ? 'none' : '0 7px 17px rgba(27,87,219,0.25)',
    }),
    errorBox: {
      fontSize: '0.82rem', color: '#991b1b',
      background: '#fef2f2', border: '1px solid #fecaca',
      borderRadius: '8px', padding: '9px 17px', marginBottom: '17px',
    },
    successBox: {
      fontSize: '0.82rem', color: '#075f77',
      background: '#ecfdf5', border: '1px solid #a7f3d0',
      borderRadius: '8px', padding: '9px 17px', marginBottom: '17px',
    },
    votedWrap: {
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: '12px', padding: '28px 0', textAlign: 'center',
    },
    votedIcon: {
      width: '78px', height: '78px', borderRadius: '50%',
      background: '#ecfdf5',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    votedTitle: { fontSize: '1.1rem', fontWeight: 700, color: '#075f77' },
    votedSub: { fontSize: '0.87rem', color: '#77778b', lineHeight: 1.7, maxWidth: '370px' },
    infoStrip: {
      width: '100%', maxWidth: '780px',
      display: 'flex', gap: '10px', marginTop: '17px',
    },
    infoItem: {
      flex: 1, display: 'flex', alignItems: 'center', gap: '8px',
      background: 'rgba(255,255,255,0.7)',
      border: '1px solid rgba(255,255,255,0.9)',
      borderRadius: '10px', padding: '11px 17px',
      fontSize: '0.78rem', color: '#775579', fontWeight: 500,
    },
    overlay: {
      position: 'fixed', inset: 0,
      background: 'rgba(15,23,72,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 999, padding: '17px',
    },
    modal: {
      background: '#ffffff', borderRadius: '20px',
      padding: '37px 32px', width: '100%', maxWidth: '720px',
      boxShadow: '0 20px 70px rgba(15,23,72,0.2)',
      textAlign: 'center',
    },
    modalIcon: {
      width: '70px', height: '70px', borderRadius: '50%',
      background: '#fffbeb', border: '2px solid #fde78a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      margin: '0 auto 18px', fontSize: '1.7rem',
    },
    modalTitle: { fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' },
    modalDesc:  { fontSize: '0.87rem', color: '#77778b', lineHeight: 1.7, marginBottom: '7px' },
    modalCandidate: {
      display: 'inline-block',
      background: '#eff7ff', color: '#1a57db',
      border: '1px solid #bfdbfe',
      borderRadius: '8px', padding: '7px 17px',
      fontSize: '0.9rem', fontWeight: 700,
      margin: '10px 0 20px',
    },
    modalWarning: {
      fontSize: '0.78rem', color: '#92700e',
      background: '#fffbeb', border: '1px solid #fde78a',
      borderRadius: '8px', padding: '8px 12px', marginBottom: '22px',
    },
    modalBtns: { display: 'flex', gap: '10px' },
    cancelBtn: {
      flex: 1, padding: '11px',
      background: '#f1f5f9', color: '#775579',
      border: '1px solid #e2e8f0', borderRadius: '10px',
      fontSize: '0.9rem', fontWeight: 700,
      cursor: 'pointer', fontFamily: 'inherit',
    },
    confirmBtn: {
      flex: 1, padding: '11px',
      background: 'linear-gradient(135deg,#2e7bcf,#1a5aa8)',
      color: '#fff', border: 'none', borderRadius: '10px',
      fontSize: '0.9rem', fontWeight: 700,
      cursor: 'pointer', fontFamily: 'inherit',
      boxShadow: '0 7px 12px rgba(27,87,219,0.25)',
    },
  };

  return (
    <div style={s.page}>

      {/* Topbar */}
      <div style={s.topbar}>
        <span style={s.brand}>🗳 Secure Voting</span>
        <div style={s.topRight}>
          <span style={s.userTag}>Hi, {userName}</span>
          <button style={s.logoutBtn} onClick={handleLogout}>Sign Out</button>
        </div>
      </div>

      {/* Warning notice */}
      {!votedStatus && (
        <div style={s.noticeBanner}>
          <span style={{ fontSize: '1rem', flexShrink: 0 }}>⚠️</span>
          <p style={s.noticeText}>
            <strong>Important:</strong> Your vote is <strong>final and irreversible</strong>.
            Once submitted, it cannot be changed. A confirmation dialog will appear before your vote is recorded.
          </p>
        </div>
      )}
    
      {/* Main card */}
      <div style={s.card}>
        <div style={s.cardHeader}>
          <p style={s.greeting}>Cast Your Vote</p>
          <p style={s.subtext}>Select a candidate carefully — you can only vote once.</p>
        </div>
        <div style={s.divider} />

        {votedStatus ? (
          <div style={s.votedWrap}>
            <div style={s.votedIcon}>
              <svg width="32" height="32" viewBox="0 0 27 27" fill="none" stroke="#057a55" strokeWidth="1.8">
                <path d="M9 12l2 2 7-7m7 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <p style={s.votedTitle}>Vote Successfully Cast</p>
            <p style={s.votedSub}>
              Thank you, {userName}. Your vote has been securely recorded and cannot be changed.
            </p>
          </div>
        ) : (
          <>
            <p style={s.sectionLabel}>Candidates — identify by symbol and select</p>

            <div style={s.candidateGrid}>
              {candidates.map((c, i) => {
                const selected = selectedCandidate === c._id;
                const symbol   = PARTY_SYMBOLS[c.party] || PARTY_SYMBOLS['default'];
                return (
                  <label key={c._id} style={s.candidateCard(selected, COLORS[i % COLORS.length])}>
                    <input
                      type="radio" name="candidate" value={c._id}
                      checked={selected}
                      onChange={() => { setSelectedCandidate(c._id); setError(''); }}
                      style={{ display: 'none' }}
                    />
                    <div style={s.symbolBox(COLORS[i % COLORS.length])}>
                      <span style={s.symbolText}>{symbol}</span>
                    </div>
                    <div style={s.cInfo}>
                      <span style={s.cName}>{c.name}</span>
                      <span style={s.cParty}>{c.party}</span>
                    </div>
                    {selected && <div style={s.checkDot}>✓</div>}
                  </label>
                );
              })}
            </div>

            {error   && <p style={s.errorBox}>{error}</p>}
            {message && <p style={s.successBox}>{message}</p>}

            <button
              style={s.submitBtn(loading || !selectedCandidate)}
              onClick={handleSubmitClick}
              disabled={loading || !selectedCandidate}
            >
              {loading ? 'Submitting...' : 'Submit Vote'}
            </button>
          </>
        )}
      </div>

      {/* Info strip */}
      <div style={s.infoStrip}>
        {[
          { icon: '🔒', text: 'One vote per person' },
          { icon: '🎭', text: 'Anonymous & secret'  },
          { icon: '🛡️', text: 'Encrypted & secure'  },
        ].map(item => (
          <div key={item.text} style={s.infoItem}>
            <span>{item.icon}</span><span>{item.text}</span>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <div style={s.modalIcon}>🗳️</div>
            <p style={s.modalTitle}>Confirm Your Vote</p>
            <p style={s.modalDesc}>You are about to cast your vote for:</p>
            <span style={s.modalCandidate}>
              {selectedObj?.name} — {selectedObj?.party}
            </span>
            <p style={s.modalWarning}>
              ⚠️ This action is <strong>permanent</strong>. You cannot undo your vote once confirmed.
            </p>
            <div style={s.modalBtns}>
              <button style={s.cancelBtn} onClick={() => setShowConfirm(false)}>Go Back</button>
              <button style={s.confirmBtn} onClick={handleConfirmVote}>Yes, Confirm Vote</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default VotingPage;