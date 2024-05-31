'use client';
import { createContext, useState } from 'react';

export const EntryStateContext = createContext([]);

export default function EntryStateContextProvider({ children }) {
  const [entryState, setEntryState] = useState({ daily: {} });

  return <EntryStateContext.Provider value={{ entryState, setEntryState }}>{children}</EntryStateContext.Provider>;
}
