'use client';
import { createContext, useCallback, useReducer } from 'react';

const DailyReducer = (state, action) => {
  switch (action.type) {
    case 'error':
      return { ...state, error: action.payload };
    case 'clear_error':
      return { ...state, error: null };
    case 'set_daily':
      return { ...state, daily: action.payload };
    default:
      return state;
  }
};

const defaultState = {};

export const DailyContext = createContext([]);

export default function DailyContextProvider({ children }) {
  const [state, dispatch] = useReducer(DailyReducer, defaultState);

  // dispatch is stable, so setDaily is too -- consumers can safely list it as an effect dependency
  const setDaily = useCallback((daily) => dispatch({ type: 'set_daily', payload: daily }), []);

  // consumers get today's daily entry itself (or null until it is loaded), not the reducer state
  return <DailyContext.Provider value={{ daily: state.daily ?? null, setDaily }}>{children}</DailyContext.Provider>;
}
