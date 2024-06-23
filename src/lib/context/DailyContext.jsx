'use client';
import { createContext, useReducer } from 'react';

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
  const [daily, dispatch] = useReducer(DailyReducer, defaultState);

  const setDaily = async (daily) => dispatch({ type: 'set_daily', payload: daily });

  return <DailyContext.Provider value={{ daily, setDaily }}>{children}</DailyContext.Provider>;
}
