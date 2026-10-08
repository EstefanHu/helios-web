'use client';
import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { logoutTraveler, updateTraveler, updateTravelerPassword } from '@/app/actions';
import { TravelerContext } from '@/lib/context';
import styles from './Profile.module.scss';
import Link from 'next/link';

export default function Profile() {
  const router = useRouter();
  const { traveler, setTraveler } = useContext(TravelerContext);
  const [isLoading, setIsLoading] = useState(false);
  const [travelerFormData, setTravelerFormData] = useState(traveler);
  const [passwordFormData, setPasswordFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    await updateTraveler(travelerFormData);
    // TODO: Launch Toast
    setIsLoading(false);
  };

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setIsLoading(false);
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    const { oldPassword, newPassword, confirmNewPassword } = passwordFormData;
    // TODO: Add TOAST
    if (!oldPassword || !newPassword || !confirmNewPassword) return;
    if (newPassword !== confirmNewPassword) return;
    if (oldPassword === newPassword) return;
    setIsLoading(true);
    await updateTravelerPassword({ oldPassword, newPassword });
    setIsLoading(false);
  };

  const runLogout = async () => {
    setTraveler({});
    await logoutTraveler();
    router.push('/');
  };

  return (
    <div className={styles.profileWrapper}>
      <form className={styles.travelerForm} onSubmit={handleUpdate}>
        <div className={styles.formHeader}>
          <h2>traveler</h2>
          <input type='submit' value='update traveler' />
        </div>

        <hr />

        <span>
          <label>name</label>
          <input
            type='text'
            value={travelerFormData.name ?? ''}
            onChange={(e) => setTravelerFormData({ ...travelerFormData, name: e.target.value })}
          />
          <p>Your name is how we will refer to you. You can remove it at any time.</p>
        </span>
      </form>

      <form className={styles.emailForm} onSubmit={handleEmailUpdate}>
        <div className={styles.formHeader}>
          <h2>email</h2>
        </div>

        <hr />

        <span>
          <label>email address</label>
          <h2>{traveler.emailAddress}</h2>
        </span>
      </form>

      <form className={styles.passwordForm} onSubmit={handlePasswordUpdate}>
        <div className={styles.formHeader}>
          <h2>password</h2>
          <input type='submit' value='update password' />
        </div>

        <hr />

        <span>
          <label>old password</label>
          <input
            type='password'
            value={passwordFormData.oldPassword}
            onChange={(e) => setPasswordFormData({ ...passwordFormData, oldPassword: e.target.value })}
          />
          <p>
            Forgot your password? <Link href='/recover_account'>Click here.</Link>
          </p>
        </span>

        <span>
          <label>new password</label>
          <input
            type='password'
            value={passwordFormData.newPassword}
            onChange={(e) => setPasswordFormData({ ...passwordFormData, newPassword: e.target.value })}
          />
        </span>

        <span>
          <label>confirm new password</label>
          <input
            type='password'
            value={passwordFormData.confirmNewPassword}
            onChange={(e) => setPasswordFormData({ ...passwordFormData, confirmNewPassword: e.target.value })}
          />
        </span>

        <p className={styles.ensureSecure}>
          Ensure your password is secure by using best practices.{' '}
          <Link href='/creating-secure-passwords'>Learn more.</Link>
        </p>
      </form>

      <button className={styles.logout} type='button' onClick={runLogout}>
        logout
      </button>
    </div>
  );
}
