'use client';
import { createContext, useCallback, useReducer } from 'react';

const TravelerReducer = (state, action) => {
  switch (action.type) {
    case 'error':
      return { ...state, error: action.payload };
    case 'clear_error':
      return { ...state, error: null };
    case 'set_traveler':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const defaultState = {};

export const TravelerContext = createContext();

export default function TravelerContextProvider({ children, initialTraveler }) {
  const [traveler, dispatch] = useReducer(TravelerReducer, initialTraveler ?? defaultState);

  const setTraveler = useCallback((traveler) => dispatch({ type: 'set_traveler', payload: traveler }), []);

  return <TravelerContext.Provider value={{ traveler, setTraveler }}>{children}</TravelerContext.Provider>;
}
