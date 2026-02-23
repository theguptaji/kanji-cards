import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { fetchKanjiLevel } from '../data/api';
import KanjiCard from '../components/KanjiCard';
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';

const StudyInterface = () => {
  const { level } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [deck, setDeck] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchKanjiLevel(level).then(data => {
      setDeck(data);
      if (data) {
        const queryParams = new URLSearchParams(location.search);
        const targetId = queryParams.get('id');
        if (targetId) {
          const idx = data.findIndex(k => k.id === targetId);
          if (idx !== -1) setCurrentIndex(idx);
        }
      }
    });
  }, [level, location.search]);

  if (!deck) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading Kanji data...</div>;
  }

  if (deck.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Level {level} not found or empty</h2>
        <button className="glass-button" onClick={() => navigate('/')}>Back Home</button>
      </div>
    );
  }

  const handleNext = () => {
    if (currentIndex < deck.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '24px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <button className="glass-button" onClick={() => navigate('/')}>
          <Home size={20} /> Home
        </button>
        <div className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
          Study {level}
        </div>
        <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          {currentIndex + 1} / {deck.length}
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {deck.map((kanji, idx) => (
          <div key={kanji.id} style={{ display: idx === currentIndex ? 'block' : 'none', width: '100%' }}>
            {idx === currentIndex && <KanjiCard kanjiData={kanji} />}
          </div>
        ))}
      </main>

      <footer style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '40px' }}>
        <button 
          className="glass-button" 
          onClick={handlePrev} 
          disabled={currentIndex === 0}
          style={{ opacity: currentIndex === 0 ? 0.5 : 1 }}
        >
          <ArrowLeft size={24} /> Prev
        </button>
        <button 
          className="glass-button" 
          onClick={handleNext} 
          disabled={currentIndex === deck.length - 1}
          style={{ opacity: currentIndex === deck.length - 1 ? 0.5 : 1 }}
        >
          Next <ArrowRight size={24} />
        </button>
      </footer>
    </div>
  );
};

export default StudyInterface;
