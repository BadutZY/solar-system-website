import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import './languageTransition.css';

// A short full-screen "curtain" that plays whenever the language changes.
// It covers the screen, the actual copy swaps underneath it (see
// LanguageContext), then it lifts again — so the user never sees text,
// widths, and layout jump around mid-transition.
export default function LanguageTransition() {
  const { isTransitioning, language, t } = useLanguage();

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          className="vg-lang-curtain"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="vg-lang-curtain-core"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="vg-lang-curtain-ring" />
            <span className="vg-lang-curtain-ring vg-lang-curtain-ring--2" />
            <AnimatePresence mode="wait">
              <motion.span
                key={language}
                className="vg-lang-curtain-code mono"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                {language.toUpperCase()}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          <motion.p
            className="vg-lang-curtain-label mono"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            {t('language.switching')}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}