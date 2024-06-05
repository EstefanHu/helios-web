'use client';
import { useEffect, useState } from 'react';
import styles from './Profile.module.scss';

export default function ProfileSubmitButton({ defaultState, currState }) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    console.log({ defaultState, currState });
  }, [defaultState, currState]);

  return <input className={styles.profileSubmitButton} type='submit' value='update' />;
}
