'use client';
import { logout } from '@/app/actions/auth.js';
import styles from './ProfileSecurity.module.scss';

export default function ProfileSecurity() {
  const runLogout = async () => {
    setTraveler(null);
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
