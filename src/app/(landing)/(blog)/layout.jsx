import styles from './layout.module.scss';

export default function layout({ children }) {
  return (
    <div className={styles.blogWrapper}>
      <nav></nav>
      {children}
    </div>
  );
}
