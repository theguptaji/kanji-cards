import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ProgressProvider, useProgress } from './context/ProgressContext';
import StudyInterface from './pages/StudyInterface';
import LevelTest from './pages/LevelTest';
import { BookOpen, GraduationCap, Flame, Star, Zap } from 'lucide-react';
import { fetchMetadata, fetchKanjiLevel } from './data/api';

const Home = () => {
  const navigate = useNavigate();
  const { progress } = useProgress();

  const [metadata, setMetadata] = useState({});
  const [decks, setDecks] = useState({});

  useEffect(() => {
    fetchMetadata().then(setMetadata);
    ['N5', 'N4', 'N3', 'N2', 'N1'].forEach(l => {
        fetchKanjiLevel(l).then(data => setDecks(prev => ({ ...prev, [l]: data })));
    });
  }, []);

  const levels = ['N5', 'N4', 'N3', 'N2', 'N1'];

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <header className="animate-slide-up" style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <img src="/favicon.png" alt="Kanjify Logo" style={{ width: '96px', height: '96px', borderRadius: '24px', boxShadow: '0 0 30px rgba(157, 78, 221, 0.5)', objectFit: 'cover' }} />
        </div>
        <h1 className="text-gradient" style={{ fontSize: '4rem', marginBottom: '16px' }}>Kanjify</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Master Japanese characters from JLPT N5 to N1 with hackable mnemonics, micro-animations, and game-like progression.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {levels.map((level, i) => {
          const total = metadata[level] || 0;
          const deck = decks[level] || [];
          const learned = deck.length ? deck.filter(k => progress[k.id] === 'learned').length : 0;
          const percent = total ? Math.round((learned / total) * 100) : 0;

          return (
            <div key={level} className={`glass-panel hover-scale delay-${i + 1} animate-slide-up`} style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '2rem', margin: 0 }}>{level}</h2>
                <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 600 }}>
                  {total} Kanji
                </span>
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <span>Progress</span>
                  <span>{percent}%</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${percent}%`, background: 'var(--status-learned)', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                <button 
                  className="glass-button" 
                  style={{ flex: 1 }}
                  onClick={() => navigate(`/study/${level}`)}
                  disabled={!total}
                >
                  <BookOpen size={18} /> Learn
                </button>
                <button 
                  className="glass-button primary" 
                  style={{ flex: 1 }}
                  onClick={() => navigate(`/test/${level}`)}
                  disabled={!total}
                >
                  <GraduationCap size={18} /> Test
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="glass-panel animate-slide-up delay-3" style={{ marginTop: '40px', padding: '32px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: '24px' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
           <div style={{ background: 'rgba(6, 214, 160, 0.2)', padding: '12px', borderRadius: '50%' }}>
              <Star size={24} color="var(--status-learned)" />
           </div>
           <div style={{ textAlign: 'left' }}>
             <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Hackable Memorization</h3>
             <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Rich mnemonics and examples.</p>
           </div>
         </div>
         <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
           <div style={{ background: 'rgba(76, 201, 240, 0.2)', padding: '12px', borderRadius: '50%' }}>
              <Zap size={24} color="var(--accent)" />
           </div>
           <div style={{ textAlign: 'left' }}>
             <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Dynamic Micro-animations</h3>
             <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>A UI that feels alive and premium.</p>
           </div>
         </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <ProgressProvider>
      <Router>
        <div style={{ position: 'fixed', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle at center, rgba(157, 78, 221, 0.05) 0%, transparent 50%)', zIndex: -1, pointerEvents: 'none' }} className="animate-float" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/study/:level" element={<StudyInterface />} />
          <Route path="/test/:level" element={<LevelTest />} />
        </Routes>
      </Router>
    </ProgressProvider>
  );
}

export default App;
