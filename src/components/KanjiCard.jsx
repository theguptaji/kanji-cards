import React, { useState } from 'react';
import { Eye, CheckCircle, RefreshCcw, Info, Edit3 } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';

const KanjiCard = ({ kanjiData }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { progress, updateProgress, notes, updateNote } = useProgress();

  const status = progress[kanjiData.id] || 'unseen';
  const currentNote = notes[kanjiData.id] || '';

  const handleMark = (e, newStatus) => {
    e.stopPropagation();
    updateProgress(kanjiData.id, newStatus);
  };

  const getStatusColor = () => {
    if (status === 'learned') return 'var(--status-learned)';
    if (status === 'revisit') return 'var(--status-revisit)';
    if (status === 'hard') return 'var(--status-hard)';
    return 'var(--text-secondary)';
  };

  return (
    <div 
      className={`kanji-card hover-scale animate-slide-up ${isFlipped ? 'flipped' : ''}`}
      style={{ width: '100%', maxWidth: '380px', height: '65svh', minHeight: '400px', maxHeight: '480px', perspective: '1000px', cursor: 'pointer', margin: '0 auto' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="kanji-card-inner">
        {/* FRONT */}
        <div className="kanji-card-front glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ position: 'absolute', top: '16px', right: '16px', color: getStatusColor() }}>
            <CheckCircle size={24} style={{ opacity: status !== 'unseen' ? 1 : 0.2 }} />
          </div>
          <div style={{ position: 'absolute', top: '16px', left: '16px', fontSize: '1rem', color: 'var(--text-secondary)' }}>
            {kanjiData.level}
          </div>
          <h1 style={{ fontSize: '120px', margin: '20px 0', textShadow: '0 0 20px rgba(157, 78, 221, 0.4)', color: 'var(--text-primary)' }}>
            {kanjiData.character}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginTop: '10px' }}>
            Tap to reveal meaning
          </p>
        </div>

        {/* BACK */}
        <div className="kanji-card-back glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: '24px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--card-border)', paddingBottom: '16px', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '3rem', margin: 0, lineHeight: 1 }}>{kanjiData.character}</h2>
            <div style={{ textAlign: 'right' }}>
              <h3 className="text-gradient" style={{ fontSize: '1.5rem', margin: 0 }}>{kanjiData.meanings.join(', ')}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>On: {kanjiData.onyomi.join(', ')}</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>Kun: {kanjiData.kunyomi.join(', ')}</p>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', marginBottom: '4px' }}>
                <Eye size={16} /> <span style={{ fontWeight: 600 }}>Mnemonic</span>
              </div>
              <p style={{ fontSize: '1rem', color: 'var(--text-primary)', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
                {kanjiData.mnemonic}
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--secondary)', marginBottom: '4px' }}>
                <Info size={16} /> <span style={{ fontWeight: 600 }}>Examples</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {kanjiData.examples.map((ex, idx) => (
                  <li key={idx} style={{ padding: '8px 0', borderBottom: idx < kanjiData.examples.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>{ex.word}</span>
                    <span style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{ex.meaning}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', marginBottom: '4px' }}>
                <Edit3 size={16} /> <span style={{ fontWeight: 600 }}>My Notes</span>
              </div>
              <textarea 
                value={currentNote}
                onChange={(e) => updateNote(kanjiData.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder="Add your own associations or memory hooks..."
                style={{ 
                  width: '100%', 
                  background: 'rgba(0,0,0,0.2)', 
                  border: '1px solid var(--card-border)', 
                  padding: '12px', 
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  minHeight: '80px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* ACTIONS */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button 
              className="glass-button" 
              style={{ 
                flex: 1, 
                backgroundColor: status === 'revisit' ? 'rgba(255, 209, 102, 0.2)' : '',
                border: status === 'revisit' ? '1px solid var(--status-revisit)' : '1px solid var(--card-border)',
                color: status === 'revisit' ? 'var(--status-revisit)' : 'var(--text-primary)'
              }}
              onClick={(e) => handleMark(e, 'revisit')}
            >
              <RefreshCcw size={18} /> Revisit
            </button>
            <button 
              className="glass-button primary" 
              style={{ 
                flex: 1, 
                backgroundColor: status === 'learned' ? 'rgba(6, 214, 160, 0.2)' : 'var(--text-primary)',
                border: status === 'learned' ? '1px solid var(--status-learned)' : '1px solid transparent',
                color: status === 'learned' ? 'var(--status-learned)' : 'var(--background)'
              }}
              onClick={(e) => handleMark(e, 'learned')}
            >
              <CheckCircle size={18} /> Learned
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanjiCard;
