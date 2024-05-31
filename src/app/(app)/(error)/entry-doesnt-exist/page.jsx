import Link from 'next/link';
import styles from './EDE.module.scss';

// TODO: Add possible suggestions based on inputs
export default async function Page({ searchParams }) {
  return (
    <div className={styles.pageWrapper}>
      <h1>Entry Doesn&apos;t Exist</h1>
      <p>
        Entry named <span>{searchParams.val}</span> was not found.
      </p>
      <Link href='/write?v=new'>Back to Write</Link>
    </div>
  );
}
