import { motion } from 'framer-motion';

export default function EntryBody({ entry }) {
  const fadeTransition = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 0.75,
      },
    },
  };

  return (
    <motion.div variants={fadeTransition} key={entry.id} initial='hidden' animate='show'>
      <h1 className='title'>{entry.title}</h1>
      <p className='bodyText'>{entry.body}</p>
    </motion.div>
  );
}
