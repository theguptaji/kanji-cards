import React, { createContext, useContext, useState, useEffect } from 'react';

const ProgressContext = createContext();

export const useProgress = () => useContext(ProgressContext);

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('kanjiProgress');
    if (saved) {
      setProgress(JSON.parse(saved));
    }
  }, []);

  const updateProgress = (kanjiId, status) => {
    const newProgress = { ...progress, [kanjiId]: status };
    setProgress(newProgress);
    localStorage.setItem('kanjiProgress', JSON.stringify(newProgress));
  };

  const resetProgress = () => {
    setProgress({});
    localStorage.removeItem('kanjiProgress');
  };

  return (
    <ProgressContext.Provider value={{ progress, updateProgress, resetProgress }}>
      {children}
    </ProgressContext.Provider>
  );
};
