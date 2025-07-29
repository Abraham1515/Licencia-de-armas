// src/context/ScoresContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ScoreEntry = {
  titulo: string;
  errores: number;
  aciertos: number;
  total: number;
  fecha: string;
};

type ScoresCtx = {
  scores: ScoreEntry[];
  addScore: (s: Omit<ScoreEntry, 'fecha'>) => void;
  clearScores: () => void;
};

const ScoresContext = createContext<ScoresCtx | null>(null);

export const ScoresProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [scores, setScores] = useState<ScoreEntry[]>([]);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem('scores');
      if (raw) setScores(JSON.parse(raw));
    })();
  }, []);

  const persist = (arr: ScoreEntry[]) => {
    setScores(arr);
    AsyncStorage.setItem('scores', JSON.stringify(arr));
  };

  const addScore = (s: Omit<ScoreEntry, 'fecha'>) => {
    const entry: ScoreEntry = { ...s, fecha: new Date().toLocaleString() };
    const next = [entry, ...scores].slice(0, 10);
    persist(next);
  };

  const clearScores = () => persist([]);

  return (
    <ScoresContext.Provider value={{ scores, addScore, clearScores }}>
      {children}
    </ScoresContext.Provider>
  );
};

export const useScores = () => {
  const ctx = useContext(ScoresContext);
  if (!ctx) throw new Error('useScores must be inside ScoresProvider');
  return ctx;
};
