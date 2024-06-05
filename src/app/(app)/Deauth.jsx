'use client';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { logoutTraveler } from '@/app/actions';
import { TravelerContext } from '@/lib/context';

export default function Deauth() {
  const router = useRouter();
  const { setTraveler } = useContext(TravelerContext);

  useEffect(() => {
    setTraveler({});
    logoutTraveler();
    router.push('/');
  }, [setTraveler, router]);

  return (
    <div>
      <h1>DEAUTHING</h1>
    </div>
  );
}
