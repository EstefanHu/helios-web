'use client';
import { createContext, useState } from 'react';
import TravelerContextProvider from './TravelerContext';
import DailyContextProvider from './DailyContext';

export const LayoutContext = createContext({});

export default function ContextProvider({ children, currentSession }) {
  const [layout, setLayout] = useState({});

  return (
    <LayoutContext.Provider value={{ layout, setLayout }}>
      <TravelerContextProvider initialTraveler={currentSession}>
        <DailyContextProvider>{children}</DailyContextProvider>
      </TravelerContextProvider>
    </LayoutContext.Provider>
  );
}
