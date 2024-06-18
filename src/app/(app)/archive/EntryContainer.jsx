'use client';
import viewer from './viewer.module.scss';
import Link from 'next/link';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import EntryBody from './EntryBody';
import { AnimatePresence, motion } from 'framer-motion';

export default function EntryContainer({ entry, nextEntry, previousEntry }) {
  return (
    <section className={viewer.viewerContainer}>
      <div className={viewer.viewerDetails}>
        <div className={viewer.editGroup}>
          <button>edit</button>
          <span className='italicLight'>
            last edited {entry.updated_at.toLocaleDateString('en-us', { month: 'short', day: 'numeric' })}
          </span>
        </div>

        <div className={viewer.dateGroup}>
          {previousEntry && (
            <Link href={`${previousEntry.slug}`}>
              <IoIosArrowBack />
            </Link>
          )}
          <div className={viewer.createdTimeDate}>
            <span>
              {entry.created_at.toLocaleDateString('en-us', {
                weekday: 'long',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
            <span>&bull;</span>
            <span>{entry.created_at.toLocaleTimeString('en-us', { timeStyle: 'short' })}</span>
          </div>
          {nextEntry && (
            <Link href={`${nextEntry.slug}`}>
              <IoIosArrowForward />
            </Link>
          )}
        </div>
      </div>
      <AnimatePresence mode='wait'>
        <EntryBody entry={entry} />
      </AnimatePresence>
    </section>
  );
}
