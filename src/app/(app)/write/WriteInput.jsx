'use client';
import { useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { EntryStateContext } from '@/lib/context';
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

let timer;

const save = async ({ id, body, router, setSaveState, entryState, setEntryState }) => {
  if (body === entryState.daily.body) return setSaveState(SaveStates.SAVED);
  setSaveState(SaveStates.SAVING);
  const { code } = await updateEntryBody(id, body);
  setEntryState({ ...entryState, daily: { ...entryState.daily, body: body } });
  setSaveState(SaveStates.SAVED);
  if (code === 307 || code === 401 || code === 440) router.push('/');
};

export function WriteInput({ entry }) {
  const { id, title, body = '' } = entry;
  const router = useRouter();
  const inputRef = useRef(null);
  const { entryState, setEntryState } = useContext(EntryStateContext);
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
        clearTimeout(timer);
        const body = inputRef.current?.value || '';
        save({ id, body, router, setSaveState, entryState, setEntryState });
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
  }, [id, router, entryState, setEntryState]);

  const setAutoSaveTimout = (newBody) => {
    setSaveState(SaveStates.WILL_SAVE);
    setShouldScroll(newBody.split(currBody)[0] === '');
    clearTimeout(timer);
    setCurrBody(newBody);
    setBodyCount(newBody.split(' ').filter((n) => n != '').length);
    timer = setTimeout(async () => {
      save({ id, body: currBody, router, setSaveState, entryState, setEntryState });
    }, 10000);
  };

  const forceSave = () => {
    clearTimeout(timer);
    save({ id, body: currBody, router, setSaveState, entryState, setEntryState });
    //inputRef.current?.focus();
  };

  const correctViewport = () => {
    if (!shouldScroll) return;
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
  };

  return (
    <>
      <div className={styles.writeViewPort} onClick={() => inputRef.current.focus()}>
        <h1>{title}</h1>

        <TextareaAutosize
          autoFocus
          className={styles.writeInput}
          ref={inputRef}
          value={currBody}
          onChange={(e) => setAutoSaveTimout(e.target.value)}
          onHeightChange={correctViewport}
        />
      </div>

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
  const { entryState, setEntryState } = useContext(EntryStateContext);
  const { daily } = entryState;
  const [entry, setEntry] = useState(null);
  const router = useRouter();
  const { v } = searchParams;

  const getOrCreateDaily = useCallback(async () => {
    const { payload } = await getOrCreateEntryByTitle(dateToTitle(new Date()));
    setEntryState({ ...entryState, daily: payload });
    //router.push(`/write?v=daily&s=${slugifyDate(new Date())}`, undefined, { shallow: true });
  }, [entryState, setEntryState]);

  useEffect(() => {
    switch (v) {
      case '':
      case null:
      case undefined:
        router.push('/write?v=daily', undefined, { shallow: true });
      case 'daily':
        Object.keys(daily).length === 0 ? getOrCreateDaily() : setEntry(daily);
        break;
      default:
        return router.push('/write?v=daily');
    }
  }, [v, router, daily, getOrCreateDaily]);

  if (!entry) return <h1>TODO: add loading skeleton</h1>;

  return (
    <div className={styles.pageWrapper}>
      <WriteInput entry={entry} />
    </div>
  );
}
