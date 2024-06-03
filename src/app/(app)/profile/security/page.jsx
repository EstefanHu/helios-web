'use client';
import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { TravelerContext } from '@/lib/context';
import { logout } from '@/app/actions/auth.js';
import styles from './ProfileSecurity.module.scss';

export default function ProfileSecurity() {
  const router = useRouter();
  const { setTraveler } = useContext(TravelerContext);

  const runLogout = async () => {
    setTraveler({});
    logout();
    router.push('/');
  };

  return (
    <div className={styles.profileWrapper}>
      <button className={styles.logout} type='button' onClick={runLogout}>
        logout
      </button>
    </div>
  );
}
