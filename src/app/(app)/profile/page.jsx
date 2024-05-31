'use client';
import { useContext, useState } from 'react';
import { updateTraveler } from '@/app/actions/traveler.js';
import { TravelerContext } from '@/lib/context';
import styles from './Profile.module.scss';
import Link from 'next/link';

export default function Profile() {
  const { traveler } = useContext(TravelerContext);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(traveler);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    await updateTraveler(formData);
    // TODO: Launch Toast
    setIsLoading(false);
  };

  return (
    <div className={styles.profileWrapper}>
      <form onSubmit={handleUpdate}>
        <label>traveler</label>
        <input type='text' value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
        <p>Your name is how we will refer to you. You can remove it at any time.</p>

        <label>email address</label>
        <h2>{traveler.emailAddress}</h2>
        <p>
          You can manage your email addresses in your <Link href='/profile/email'>email settings</Link>.
        </p>

        <label>password</label>
        <h2>**********</h2>
        <p>
          Manage your security settings <Link href='/profile/security'>here</Link>.
        </p>

        <input type='submit' value='update traveler' />
      </form>
    </div>
  );
}
