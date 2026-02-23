import React, { createContext, useContext, useState, useEffect } from 'react';

const ProgressContext = createContext();

export const useProgress = () => useContext(ProgressContext);

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState({});
  const [notes, setNotes] = useState({});
  const [mistakes, setMistakes] = useState({});

  useEffect(() => {
    const savedProgress = localStorage.getItem('kanjiProgress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
    const savedNotes = localStorage.getItem('kanjiNotes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
    const savedMistakes = localStorage.getItem('kanjiMistakes');
    if (savedMistakes) {
      setMistakes(JSON.parse(savedMistakes));
    }
  }, []);

  const updateProgress = (kanjiId, status) => {
    const newProgress = { ...progress, [kanjiId]: status };
    setProgress(newProgress);
    localStorage.setItem('kanjiProgress', JSON.stringify(newProgress));
  };

  const updateNote = (kanjiId, note) => {
    const newNotes = { ...notes, [kanjiId]: note };
    if (!note) {
      delete newNotes[kanjiId];
    }
    setNotes(newNotes);
    localStorage.setItem('kanjiNotes', JSON.stringify(newNotes));
  };

  const updateMistake = (kanjiId, isMistake) => {
    const newMistakes = { ...mistakes };
    if (isMistake) {
      newMistakes[kanjiId] = true;
    } else {
      delete newMistakes[kanjiId];
    }
    setMistakes(newMistakes);
    localStorage.setItem('kanjiMistakes', JSON.stringify(newMistakes));
  };

  const resetProgressAll = () => {
    setProgress({});
    localStorage.removeItem('kanjiProgress');
  };

  const resetNeedsReview = () => {
    const newProgress = { ...progress };
    Object.keys(newProgress).forEach(key => {
      if (newProgress[key] === 'revisit') {
        delete newProgress[key];
      }
    });
    setProgress(newProgress);
    localStorage.setItem('kanjiProgress', JSON.stringify(newProgress));
  };

  const resetNotes = () => {
    setNotes({});
    localStorage.removeItem('kanjiNotes');
  };

  const resetMistakes = () => {
    setMistakes({});
    localStorage.removeItem('kanjiMistakes');
  };

  const resetAll = () => {
    setProgress({});
    setNotes({});
    setMistakes({});
    localStorage.removeItem('kanjiProgress');
    localStorage.removeItem('kanjiNotes');
    localStorage.removeItem('kanjiMistakes');
  };

  return (
    <ProgressContext.Provider value={{ progress, updateProgress, notes, updateNote, mistakes, updateMistake, resetProgressAll, resetNeedsReview, resetNotes, resetMistakes, resetAll }}>
      {children}
    </ProgressContext.Provider>
  );
};
