import React, { createContext, useContext, useState, useEffect } from 'react';

const ProgressContext = createContext();

export const useProgress = () => useContext(ProgressContext);

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState({});
  const [notes, setNotes] = useState({});

  useEffect(() => {
    const savedProgress = localStorage.getItem('kanjiProgress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
    const savedNotes = localStorage.getItem('kanjiNotes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
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

  const resetProgress = () => {
    setProgress({});
    setNotes({});
    localStorage.removeItem('kanjiProgress');
    localStorage.removeItem('kanjiNotes');
  };

  return (
    <ProgressContext.Provider value={{ progress, updateProgress, notes, updateNote, resetProgress }}>
      {children}
    </ProgressContext.Provider>
  );
};
