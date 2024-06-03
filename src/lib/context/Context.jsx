'use client';
import { createContext, useState } from 'react';
import EntryStateContextProvider from './EntryStateContext';

export const LayoutContext = createContext({});
export const TravelerContext = createContext({});

export default function ContextProvider({ children, currentSession = {} }) {
  const [layout, setLayout] = useState({});
  const [traveler, setTraveler] = useState(currentSession);

  return (
    <LayoutContext.Provider value={{ layout, setLayout }}>
      <TravelerContext.Provider value={{ traveler, setTraveler }}>
        <EntryStateContextProvider>{children}</EntryStateContextProvider>
      </TravelerContext.Provider>
    </LayoutContext.Provider>
  );
}
