'use client';
import { useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DailyContext } from '@/lib/context';
import { getOrCreateEntryByTitle } from '@/app/actions';
import TextareaAutosize from 'react-textarea-autosize';
import { RotatingLines } from 'react-loader-spinner';
import { GoCheck } from 'react-icons/go';
import { FaRegSave } from 'react-icons/fa';
import { dateToTitle, slugifyDate } from '@/lib/helpers/date';
import styles from './Write.module.scss';
import { updateEntryBody } from '@/app/actions';

const SaveStates = {
  SAVED: 'Saved',
  SAVING: 'Saving',
  WILL_SAVE: 'WillSave',
};

// lastSavedRef holds the body most recently persisted for this entry, so unchanged saves are skipped
const save = async ({ id, body, router, setSaveState, lastSavedRef, daily, setDaily }) => {
  if (body === lastSavedRef.current) return setSaveState(SaveStates.SAVED);
  setSaveState(SaveStates.SAVING);
  const { code } = await updateEntryBody(id, body);
  if (code === 307 || code === 401 || code === 440) return router.push('/');
  if (code === 200) {
    lastSavedRef.current = body;
    // keep the cached daily entry in sync when it is the one being edited
    if (daily?.id === id) setDaily({ ...daily, body });
  }
  setSaveState(SaveStates.SAVED);
};

export function WriteInput({ entry }) {
  const { id, title, body = '' } = entry;
  const router = useRouter();
  const inputRef = useRef(null);
  // per-instance autosave timer; a module-level timer would be shared by every WriteInput
  const timerRef = useRef(null);
  const lastSavedRef = useRef(body);
  const { daily, setDaily } = useContext(DailyContext);
  const [currBody, setCurrBody] = useState(body);
  const [bodyCount, setBodyCount] = useState(body.split(' ').filter((n) => n != '').length);
  const [saveState, setSaveState] = useState(SaveStates.SAVED);
  const [shouldScroll, setShouldScroll] = useState(false);

  // TODO: Fix auto scroll
  const scrollToBottom = useCallback((footer) => {
    return;
    if (!footer) return;
    footer.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const captureKeydown = (e) => {
      if ((e.metaKey && e.key === 's') || (e.ctrlKey && e.key === 's')) {
        e.preventDefault();
        clearTimeout(timerRef.current);
        const body = inputRef.current?.value || '';
        save({ id, body, router, setSaveState, lastSavedRef, daily, setDaily });
      } else if (e.key === 'Tab') {
        e.preventDefault();
        // TODO: Add Tab character
        // TODO: Make Undo (cmd+z) work https://stackoverflow.com/questions/44471699/how-to-make-undo-work-in-an-html-textarea-after-setting-the-value
      }
    };
    document.addEventListener('keydown', captureKeydown);

    // Sets cursor to bottom of input
    inputRef.current?.focus();
    inputRef.current?.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);

    return () => document.removeEventListener('keydown', captureKeydown);
  }, [id, router, daily, setDaily]);

  const setAutoSaveTimout = (newBody) => {
    setSaveState(SaveStates.WILL_SAVE);
    setShouldScroll(newBody.split(currBody)[0] === '');
    clearTimeout(timerRef.current);
    setCurrBody(newBody);
    setBodyCount(newBody.split(' ').filter((n) => n != '').length);
    // save newBody, not currBody: currBody is still the value from before this keystroke
    timerRef.current = setTimeout(() => {
      save({ id, body: newBody, router, setSaveState, lastSavedRef, daily, setDaily });
    }, 10000);
  };

  const forceSave = () => {
    clearTimeout(timerRef.current);
    save({ id, body: currBody, router, setSaveState, lastSavedRef, daily, setDaily });
    inputRef.current?.focus();
  };

  const correctViewport = () => {
    if (!shouldScroll) return;
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
  };

  return (
    <>
      <>
        <h1>{title}</h1>

        <TextareaAutosize
          autoFocus
          className={styles.writeInput}
          ref={inputRef}
          value={currBody}
          onChange={(e) => setAutoSaveTimout(e.target.value)}
          onHeightChange={correctViewport}
        />
      </>

      <footer className={styles.writeFooter} ref={scrollToBottom}>
        <p className={styles.count}>{bodyCount} words</p>

        <span>
          {saveState === 'Saved' ? (
            <GoCheck />
          ) : saveState === 'Saving' ? (
            <RotatingLines strokeColor='#f3b04e' />
          ) : (
            <FaRegSave onClick={() => forceSave(body)} style={{ cursor: 'pointer' }} />
          )}
        </span>
      </footer>
    </>
  );
}

export function ClientRenderWriteInput({ searchParams }) {
  const { daily, setDaily } = useContext(DailyContext);
  const router = useRouter();
  const { v } = searchParams;

  const getOrCreateDaily = useCallback(async () => {
    const { payload } = await getOrCreateEntryByTitle(dateToTitle(new Date()));
    setDaily(payload);
    //router.push(`/write?v=daily&s=${slugifyDate(new Date())}`, undefined, { shallow: true });
  }, [setDaily]);

  useEffect(() => {
    switch (v) {
      case '':
      case null:
      case undefined:
        // normalize the url, then fall through to load the daily entry
        router.push('/write?v=daily', undefined, { shallow: true });
      case 'daily':
        if (!daily) getOrCreateDaily();
        break;
      default:
        router.push('/write?v=daily');
    }
  }, [v, router, daily, getOrCreateDaily]);

  if (!daily) return <h1>TODO: add loading skeleton</h1>;

  return (
    <div className={styles.pageWrapper}>
      <WriteInput entry={daily} />
    </div>
  );
}
