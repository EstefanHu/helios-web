import { Link } from 'next/link';
import styles from './Unaccessible.module.scss';

// TODO: Add possible suggestions based on inputs
export default async function Page({ searchParams }) {
  const { val } = await searchParams;

  return (
    <div className={styles.pageWrapper}>
      <h1>Entry Doesn&apos;t Exist</h1>
      <p>
        Entry named <span>{val}</span> was not found.
      </p>
      <Link href='/write?v=new'>Back to Write</Link>
    </div>
  );
}
