'use client';
import { useContext, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

import { HiSun } from 'react-icons/hi';
import { BiSolidHomeHeart } from 'react-icons/bi';
import { GiJourney, GiMirrorMirror } from 'react-icons/gi';
import { IoIosMore } from 'react-icons/io';
import { IoLibrary } from 'react-icons/io5';
import { EntryStateContext } from '@/lib/context';
import { launchDailyEntry } from '@/lib/helpers/launchDailyEntry.js';

import styles from './AppLayoutClientComponents.module.scss';

function AppNav() {
  const {
    entryState: { daily },
  } = useContext(EntryStateContext);
  const pathname = usePathname();
  const router = useRouter();

  const openMenu = () => {
    console.log('open menu');
  };

  return (
    <>
      <Link href='/' className={styles.logo}>
        <HiSun />
      </Link>

      <Link href='/home' className={`${styles.link} ${pathname.startsWith('/home') ? styles.selected : null}`}>
        <BiSolidHomeHeart />
        <p>home</p>
      </Link>

      <Link href='/journey' className={`${styles.link} ${pathname.startsWith('/journey') ? styles.selected : null}`}>
        <GiJourney />
        <p>journey</p>
      </Link>

      <Link href='/reflect' className={`${styles.link} ${pathname.startsWith('/reflect') ? styles.selected : null}`}>
        <GiMirrorMirror />
        <p>reflect</p>
      </Link>

      <Link href='/archive' className={`${styles.link} ${pathname.startsWith('/archive') ? styles.selected : null}`}>
        <IoLibrary />
        <p>archive</p>
      </Link>

      <button type='button' onClick={openMenu} className={styles.more}>
        <IoIosMore />
      </button>

      <button type='button' onClick={() => launchDailyEntry(daily, router)} className={styles.write}>
        write
      </button>
    </>
  );
}

function MobileAppNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.mobileAppNav}>
      <Link href='/home' className={pathname === '/home' ? styles.selected : ''}>
        <BiSolidHomeHeart />
      </Link>

      <Link href='/journey' className={pathname === '/journey' ? styles.selected : ''}>
        <GiJourney />
      </Link>

      <Link href='/reflect' className={pathname === '/reflect' ? styles.selected : ''}>
        <GiMirrorMirror />
      </Link>

      <Link href='/archive' className={pathname === '/archive' ? styles.selected : ''}>
        <IoLibrary />
      </Link>
    </nav>
  );
}

function PageName() {
  const pageName = usePathname()?.split('/')[1];

  return <h1 className={styles.pageName}>{pageName}</h1>;
}

function SearchInput() {
  const router = useRouter();
  const [input, setInput] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();

    setInput('');

    router.push(`/search?s=${input}`);
  };

  return (
    <form className={styles.searchInput} onSubmit={handleSearch} tabIndex='1'>
      <input type='input' placeholder='Search' value={input} onChange={(e) => setInput(e.target.value)} />
    </form>
  );
}

function HeaderWriteButton() {
  const {
    entryState: { daily },
  } = useContext(EntryStateContext);
  const router = useRouter();

  return (
    <button type='button' className={styles.headerWriteButton} onClick={() => launchDailyEntry(daily, router)}>
      write
    </button>
  );
}

export { AppNav, MobileAppNav, PageName, SearchInput, HeaderWriteButton };
