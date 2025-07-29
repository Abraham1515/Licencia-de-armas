// src/context/SettingsContext.tsx
import React, { createContext, useContext, useState } from 'react';

type Settings = {
  themeName: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
};

const SettingsContext = createContext<Settings | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <SettingsContext.Provider value={{ themeName, setTheme }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be inside SettingsProvider');
  return ctx;
}
