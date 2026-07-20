import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import './loader.css';

export default function Loader({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    let raf;
    const start = performance.now();
    const DURATION = 2200;

    const tick = (now) => {
      const t = Math.min(1, (now - start) / DURATION);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setVisible(false), 350);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          className="vg-loader"
          exit={{ opacity: 0, filter: 'blur(20px)' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="vg-loader-orbit">
            <img src="/icon.png" alt="Voyager" className="vg-loader-icon" />
            <div className="vg-loader-ring" />
            <div className="vg-loader-ring vg-loader-ring--2" />
          </div>
          <div className="vg-loader-label mono">
            <span>{t('loader.initializing')}</span>
            <span className="vg-loader-percent">{progress}%</span>
          </div>
          <div className="vg-loader-bar">
            <motion.div className="vg-loader-fill" style={{ width: `${progress}%` }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}